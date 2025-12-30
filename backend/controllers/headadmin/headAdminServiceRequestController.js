import ServiceRequest from '../../models/ServiceRequest.js';

/* =====================================================
   GET SERVICE REQUESTS (HEAD ADMIN)
   - Org scoped (SECURITY)
   - Optional status filter
===================================================== */
export const getServiceRequests = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const { status } = req.query;

    const filter = { org_id };

    // Optional filter (open / assigned / completed / closed)
    if (status) {
      filter.status = status;
    }

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('🔥 getServiceRequests:', error);
    res.status(500).json({
      message: 'Failed to fetch service requests',
    });
  }
};
