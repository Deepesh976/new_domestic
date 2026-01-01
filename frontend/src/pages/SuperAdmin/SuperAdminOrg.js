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

const API_BASE = process.env.REACT_APP_API_URL || '';

const SuperAdminOrg = () => {
  const [orgs, setOrgs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  /* =========================
     MODAL STATE
  ========================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
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

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const pageSize = 5;

  /* =========================
     FETCH
  ========================= */
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

  /* =========================
     FILTER + PAGINATION
  ========================= */
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

  /* =========================
     MODAL HANDLERS
  ========================= */
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
    setLogo(null);
    setLogoPreview(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedId) return;
    const org = orgs.find((o) => o._id === selectedId);
    if (!org) return;

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

    setLogo(null);
    setLogoPreview(
      org.logo
        ? `${API_BASE}/uploads/organizations/${org.logo}`
        : null
    );

    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError('');
  };

  /* =========================
     FORM HANDLERS
  ========================= */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (logo) {
        formData.append('logo', logo);
      }

      if (modalMode === 'create') {
        await createOrganization(formData);
      } else {
        await updateOrganization(selectedId, formData);
      }

      setModalOpen(false);
      setSelectedId(null);
      fetchOrganizations();
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Failed to save organization'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  /* =========================
     DELETE
  ========================= */
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

  /* =========================
     RENDER
  ========================= */
  return (
    <SuperAdminNavbar>
      <div className="org-page">
        {/* HEADER */}
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

        {/* SEARCH */}
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

        {/* TABLE */}
        <div className="org-card">
          <table className="org-table">
            <thead className="org-table-header">
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Logo</th>
                <th>Org ID</th>
                <th>Organization Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>State</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((org) => (
                <tr
                  key={org._id}
                  className={selectedId === org._id ? 'selected' : ''}
                  onClick={() => setSelectedId(org._id)}
                >
                  <td>
                    <input
                      type="radio"
                      checked={selectedId === org._id}
                      readOnly
                    />
                  </td>

                  <td>
                    {org.logo ? (
                      <img
                        src={`${API_BASE}/uploads/organizations/${org.logo}`}
                        alt="logo"
                        style={{ height: 32 }}
                      />
                    ) : (
                      '—'
                    )}
                  </td>

                  <td>{org.org_id}</td>
                  <td>{org.org_name}</td>
                  <td>{org.email_id || '—'}</td>
                  <td>{org.phone_number || '—'}</td>
                  <td>{org.state || '—'}</td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="7" className="org-empty">
                    No organizations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="org-pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? 'active' : ''}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Create' : 'Edit'} Organization</h2>
              <button onClick={closeModal}>
                <FiX size={22} />
              </button>
            </div>

            {formError && <div className="modal-error">⚠️ {formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="modal-form">
                {[
                  ['org_id', 'Organization ID', modalMode === 'edit'],
                  ['org_name', 'Organization Name'],
                  ['type', 'Organization Type'],
                  ['gst_number', 'GST Number'],
                  ['email_id', 'Email'],
                  ['phone_number', 'Phone Number'],
                  ['state', 'State'],
                  ['pincode', 'Pincode'],
                  ['country', 'Country'],
                ].map(([name, label, disabled]) => (
                  <div className="form-group" key={name}>
                    <label>{label}</label>
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handleFormChange}
                      disabled={disabled}
                      required={name === 'org_id' || name === 'org_name' || name === 'email_id'}
                    />
                  </div>
                ))}

                <div className="form-group full">
                  <label>Organization Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="preview"
                      style={{ height: 60, marginTop: 8 }}
                    />
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Update'}
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
