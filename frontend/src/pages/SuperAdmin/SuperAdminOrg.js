import React, { useEffect, useState } from 'react';
import { FiX, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  getOrganizations,
  deleteOrganization,
  createOrganization,
  updateOrganization,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';
import './SuperAdminOrg.css';

const SuperAdminOrg = () => {
  const [orgs, setOrgs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  
  /* Modal State */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); /* 'create' or 'edit' */
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    org_id: '',
    org_name: '',
    type: '',
    gst_number: '',
    email_id: '',
    phone_number: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const pageSize = 5;

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      setOrgs(res.data || []);
    } catch {
      alert('Failed to load organizations');
    }
  };

  /* Filter and Pagination */
  const filtered = orgs.filter((org) =>
    `
      ${org.org_name || ''}
      ${org.org_id || ''}
      ${org.email_id || ''}
      ${org.phone_number || ''}
      ${org.state || ''}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* Modal Handlers */
  const openCreateModal = () => {
    setModalMode('create');
    setForm({
      org_id: '',
      org_name: '',
      type: '',
      gst_number: '',
      email_id: '',
      phone_number: '',
      state: '',
      pincode: '',
      country: 'India',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedId) return;
    const org = orgs.find((o) => o._id === selectedId);
    if (org) {
      setModalMode('edit');
      setForm({
        org_id: org.org_id || '',
        org_name: org.org_name || '',
        type: org.type || '',
        gst_number: org.gst_number || '',
        email_id: org.email_id || '',
        phone_number: org.phone_number || '',
        state: org.state || '',
        pincode: org.pincode || '',
        country: org.country || 'India',
      });
      setFormError('');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      if (modalMode === 'create') {
        await createOrganization(form);
      } else {
        await updateOrganization(selectedId, form);
      }
      
      setModalOpen(false);
      setSelectedId(null);
      fetchOrganizations();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save organization';
      setFormError(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this organization?')) return;

    try {
      await deleteOrganization(selectedId);
      setSelectedId(null);
      fetchOrganizations();
    } catch {
      alert('Failed to delete organization');
    }
  };

  return (
    <SuperAdminNavbar>
      <div className="org-page">
        {/* Header */}
        <div className="org-header">
          <h1 className="org-title">Organizations</h1>

          <div className="org-actions">
            <button className="org-button primary" onClick={openCreateModal}>
              <FiPlus size={16} /> Create
            </button>

            <button
              className="org-button edit"
              disabled={!selectedId}
              onClick={openEditModal}
            >
              <FiEdit2 size={16} /> Edit
            </button>

            <button
              className="org-button delete"
              disabled={!selectedId}
              onClick={handleDelete}
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          className="org-search"
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Table */}
        <div className="org-card">
          <table className="org-table">
            <thead className="org-table-header">
              <tr>
                <th className="org-table-header-cell" style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="org-checkbox"
                    checked={selectedId !== null}
                    onChange={() =>
                      setSelectedId(selectedId === null ? orgs[0]?._id : null)
                    }
                  />
                </th>
                <th className="org-table-header-cell">Org ID</th>
                <th className="org-table-header-cell">Organization Name</th>
                <th className="org-table-header-cell">Email</th>
                <th className="org-table-header-cell">Phone</th>
                <th className="org-table-header-cell">State</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((org) => (
                <tr
                  key={org._id}
                  className={`org-table-body-row ${
                    selectedId === org._id ? 'selected' : ''
                  }`}
                >
                  <td className="org-table-body-cell" style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="org-checkbox"
                      checked={selectedId === org._id}
                      onChange={() =>
                        setSelectedId(
                          selectedId === org._id ? null : org._id
                        )
                      }
                    />
                  </td>
                  <td className="org-table-body-cell">{org.org_id}</td>
                  <td className="org-table-body-cell">{org.org_name}</td>
                  <td className="org-table-body-cell">
                    {org.email_id || <span className="org-table-body-cell empty">—</span>}
                  </td>
                  <td className="org-table-body-cell">
                    {org.phone_number || <span className="org-table-body-cell empty">—</span>}
                  </td>
                  <td className="org-table-body-cell">
                    {org.state || <span className="org-table-body-cell empty">—</span>}
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="org-empty">
                    No organizations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="org-pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`org-pagination-btn ${
                    page === i + 1 ? 'active' : ''
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'create'
                  ? 'Create Organization'
                  : 'Edit Organization'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX size={24} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: '12px 14px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label required">Organization ID</label>
                  <input
                    type="text"
                    className="form-input"
                    name="org_id"
                    value={form.org_id}
                    onChange={handleFormChange}
                    placeholder="org_001"
                    required
                    disabled={modalMode === 'edit'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Organization Name</label>
                  <input
                    type="text"
                    className="form-input"
                    name="org_name"
                    value={form.org_name}
                    onChange={handleFormChange}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Organization Type</label>
                  <input
                    type="text"
                    className="form-input"
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    placeholder="e.g., LLC, Partnership"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="gst_number"
                    value={form.gst_number}
                    onChange={handleFormChange}
                    placeholder="00AABCT1234A1Z5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    name="email_id"
                    value={form.email_id}
                    onChange={handleFormChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleFormChange}
                    placeholder="1234567890"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    name="state"
                    value={form.state}
                    onChange={handleFormChange}
                    placeholder="e.g., California"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleFormChange}
                    placeholder="000000"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    name="country"
                    value={form.country}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-button cancel"
                  onClick={closeModal}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-button submit"
                  disabled={formSubmitting}
                >
                  {formSubmitting
                    ? 'Saving...'
                    : modalMode === 'create'
                    ? 'Create'
                    : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminNavbar>
  );
};

export default SuperAdminOrg;
