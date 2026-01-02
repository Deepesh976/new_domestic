import ServiceRequest from '../../models/ServiceRequest.js';
import OrgTechnician from '../../models/OrgTechnician.js';
import OrgUser from '../../models/OrgUser.js';

/* =====================================================
   GET SERVICE REQUESTS
   - Org scoped
   - Filter by status
   - Search by device_id OR user name
   - Maps:
     - user_name
     - assigned_technician_name
     - fixed_by_name
===================================================== */
export const getServiceRequests = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const { status, search } = req.query;

    /* =========================
       BASE FILTER
    ========================= */
    const filter = { org_id };
    if (status) filter.status = status;

    let requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    /* =========================
       SEARCH (DEVICE / USER NAME)
    ========================= */
    if (search) {
      const matchedUsers = await OrgUser.find({
        org_id,
        $or: [
          { 'user_name.first_name': { $regex: search, $options: 'i' } },
          { 'user_name.last_name': { $regex: search, $options: 'i' } },
        ],
      }).select('user_id');

      const userIds = matchedUsers.map((u) => u.user_id);

      requests = requests.filter(
        (r) =>
          r.device_id?.toLowerCase().includes(search.toLowerCase()) ||
          userIds.includes(r.user_id)
      );
    }

    /* =========================
       MAP USER NAMES
    ========================= */
    const userIds = [
      ...new Set(requests.map((r) => r.user_id).filter(Boolean)),
    ];

    const users = await OrgUser.find({
      user_id: { $in: userIds },
    }).select('user_id user_name');

    const userMap = {};
    users.forEach((u) => {
      userMap[u.user_id] =
        `${u.user_name?.first_name || ''} ${u.user_name?.last_name || ''}`.trim();
    });

    /* =========================
       MAP TECHNICIAN NAMES
    ========================= */
    const technicianIds = [
      ...new Set(
        requests
          .map((r) => r.assigned_to || r.fixed_by?.technician_id)
          .filter(Boolean)
      ),
    ];

    const technicians = await OrgTechnician.find({
      _id: { $in: technicianIds },
    }).select('_id user_name');

    const technicianMap = {};
    technicians.forEach((t) => {
      technicianMap[t._id.toString()] =
        `${t.user_name?.first_name || ''} ${t.user_name?.last_name || ''}`.trim();
    });

    /* =========================
       FINAL RESPONSE
    ========================= */
    const finalData = requests.map((r) => ({
      ...r,
      user_name: userMap[r.user_id] || 'Unknown',

      assigned_technician_name:
        r.assigned_to
          ? technicianMap[r.assigned_to?.toString()] || null
          : null,

      fixed_by_name:
        r.status === 'closed'
          ? r.fixed_by?.technician_name || '—'
          : '—',
    }));

    return res.status(200).json(finalData);
  } catch (error) {
    console.error('🔥 getServiceRequests:', error);
    return res.status(500).json({
      message: 'Failed to fetch service requests',
    });
  }
};

/* =====================================================
   GET AVAILABLE TECHNICIANS
   - Only FREE + APPROVED technicians
===================================================== */
export const getAvailableTechnicians = async (req, res) => {
  try {
    const org_id = req.user.organization;

    const technicians = await OrgTechnician.find({
      org_id,
      work_status: 'free',
      'kyc_details.kyc_approval_status': 'approved',
    }).select('_id user_name work_status');

    return res.status(200).json(technicians);
  } catch (error) {
    console.error('🔥 getAvailableTechnicians:', error);
    return res.status(500).json({
      message: 'Failed to fetch technicians',
    });
  }
};

/* =====================================================
   ASSIGN TECHNICIAN TO SERVICE REQUEST
===================================================== */
export const assignTechnicianToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { technician_id } = req.body;
    const org_id = req.user.organization;

    if (!technician_id) {
      return res.status(400).json({
        message: 'Technician ID is required',
      });
    }

    const request = await ServiceRequest.findOne({ _id: id, org_id });

    if (!request) {
      return res.status(404).json({
        message: 'Service request not found',
      });
    }

    if (request.status === 'closed') {
      return res.status(400).json({
        message: 'Cannot assign technician to closed request',
      });
    }

    const technician = await OrgTechnician.findOne({
      _id: technician_id,
      org_id,
      work_status: 'free',
    });

    if (!technician) {
      return res.status(400).json({
        message: 'Technician not available',
      });
    }

    request.assigned_to = technician_id;
    request.status = 'assigned';
    await request.save();

    technician.work_status = 'busy';
    await technician.save();

    return res.status(200).json({
      message: 'Technician assigned successfully',
    });
  } catch (error) {
    console.error('🔥 assignTechnicianToRequest:', error);
    return res.status(500).json({
      message: 'Failed to assign technician',
    });
  }
};

/* =====================================================
   UPDATE SERVICE STATUS
   ✅ Handles completion image upload
   ✅ Stores images in uploads/serviceimage
   ✅ Saves filenames in MongoDB
===================================================== */
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observations } = req.body;
    const org_id = req.user.organization;

    const allowedStatuses = ['open', 'assigned', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
      });
    }

    const request = await ServiceRequest.findOne({ _id: id, org_id });

    if (!request) {
      return res.status(404).json({
        message: 'Service request not found',
      });
    }

    if (request.status === 'closed') {
      return res.status(400).json({
        message: 'Closed service request cannot be modified',
      });
    }

    /* =========================
       STORE COMPLETION IMAGES
    ========================= */
    if (req.files && req.files.length > 0) {
      const imageNames = req.files.map((file) => file.filename);
      request.completion_images.push(...imageNames);
    }

    /* =========================
       UPDATE OBSERVATIONS
    ========================= */
    if (observations) {
      request.observations = observations;
    }

    /* =========================
       CLOSE SERVICE REQUEST
    ========================= */
    if (status === 'closed') {
      if (request.assigned_to) {
        const technician = await OrgTechnician.findById(
          request.assigned_to
        );

        if (technician) {
          request.fixed_by = {
            technician_id: technician._id.toString(),
            technician_name: `${technician.user_name?.first_name || ''} ${technician.user_name?.last_name || ''}`.trim(),
          };

          technician.work_status = 'free';
          await technician.save();
        }
      }

      request.completed_at = new Date();
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      message: 'Service status updated successfully',
      request,
    });
  } catch (error) {
    console.error('🔥 updateServiceStatus:', error);
    return res.status(500).json({
      message: 'Failed to update service status',
    });
  }
};
