import ServiceRequest from '../../models/ServiceRequest.js';
import OrgTechnician from '../../models/OrgTechnician.js';
import OrgUser from '../../models/OrgUser.js';

/* =====================================================
   GET SERVICE REQUESTS
   - Org scoped
   - Search: device_id OR user name
   - Filter by status
   - Maps:
     - user_name
     - assigned_technician_name ✅ FIX
===================================================== */
export const getServiceRequests = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const { status, search } = req.query;

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
       MAP USER NAME
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
       MAP ASSIGNED TECHNICIAN NAME ✅ FIX
    ========================= */
    const technicianIds = [
      ...new Set(requests.map((r) => r.assigned_to).filter(Boolean)),
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
        technicianMap[r.assigned_to] || null,
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
      return res.status(400).json({ message: 'Technician ID required' });
    }

    const technician = await OrgTechnician.findOne({
      _id: technician_id,
      org_id,
      work_status: 'free',
    });

    if (!technician) {
      return res.status(400).json({ message: 'Technician not available' });
    }

    const request = await ServiceRequest.findOne({ _id: id, org_id });
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
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
===================================================== */
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const org_id = req.user.organization;

    const allowed = ['open', 'assigned', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await ServiceRequest.findOne({ _id: id, org_id });
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (status === 'closed' && request.assigned_to) {
      await OrgTechnician.findByIdAndUpdate(
        request.assigned_to,
        { work_status: 'free' }
      );
      request.assigned_to = null;
    }

    if (request.status === 'closed' && status !== 'closed') {
      request.assigned_to = null;
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      message: 'Service status updated successfully',
    });
  } catch (error) {
    console.error('🔥 updateServiceStatus:', error);
    return res.status(500).json({
      message: 'Failed to update service status',
    });
  }
};
