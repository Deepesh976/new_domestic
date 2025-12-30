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

/* 🔥 REQUIRED for dropdown submit (KYC + Active/Inactive) */
export const updateTechnician = (id, data) =>
  axios.put(`/api/headadmin/technicians/${id}`, data);

/* =========================
   INSTALLATION ORDERS
========================= */
export const getInstallationOrders = () =>
  axios.get('/api/headadmin/installations');

/* 🔥 Assign technician to order */
export const assignInstallationTechnician = (id, data) =>
  axios.put(`/api/headadmin/installations/${id}/assign`, data);
