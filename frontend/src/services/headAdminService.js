import axios from '../utils/axiosConfig';

/* =========================
   SUPPORT
========================= */
export const getSupport = () =>
  axios.get('/api/headadmin/support');

export const createSupport = (data) =>
  axios.post('/api/headadmin/support', data);

export const updateSupport = (data) =>
  axios.put('/api/headadmin/support', data);

export const deleteSupport = () =>
  axios.delete('/api/headadmin/support');

/* =========================
   TECHNICIANS
========================= */
export const getTechnicians = () =>
  axios.get('/api/headadmin/technicians');

/* 🔥 Update technician (KYC / Active / Status) */
export const updateTechnician = (id, data) =>
  axios.put(`/api/headadmin/technicians/${id}`, data);

/* =========================
   INSTALLATION ORDERS
========================= */
export const getInstallationOrders = () =>
  axios.get('/api/headadmin/installations');

/* 🔥 Assign technician to installation order */
export const assignInstallationTechnician = (id, data) =>
  axios.put(`/api/headadmin/installations/${id}/assign`, data);

/* =========================
   SERVICE REQUESTS 🔥🔥🔥
========================= */

/* Get service requests
   - params: { status, search }
*/
export const getServiceRequests = (params = {}) =>
  axios.get('/api/headadmin/service-requests', { params });

/* Get only available technicians */
export const getAvailableServiceTechnicians = () =>
  axios.get(
    '/api/headadmin/service-requests/technicians/available'
  );

/* Assign technician to service request */
export const assignServiceTechnician = (
  serviceRequestId,
  technician_id
) =>
  axios.patch(
    `/api/headadmin/service-requests/${serviceRequestId}/assign`,
    { technician_id }
  );

/* Update service status (manual fallback) */
export const updateServiceRequestStatus = (
  serviceRequestId,
  status
) =>
  axios.patch(
    `/api/headadmin/service-requests/${serviceRequestId}/status`,
    { status }
  );
