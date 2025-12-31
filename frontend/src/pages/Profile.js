import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  /* =========================
     USER INFO
  ========================= */
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('Head Admin');

  useEffect(() => {
    setEmail(localStorage.getItem('email') || '');
    setUsername(localStorage.getItem('username') || 'Head Admin');
  }, []);

  /* =========================
     UI STATE
  ========================= */
  const [activeTab, setActiveTab] = useState('account');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /* =========================
     UPDATE PASSWORD (HEAD ADMIN)
  ========================= */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const validationErrors = {};

    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 6) {
      validationErrors.password =
        'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('token');

      const res = await fetch(
        '/api/headadmin/auth/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password update failed');
      }

      setSuccessMessage('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="profile-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="profile-layout">
        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              <FaUser />
            </div>

            <h2 className="profile-username">{username}</h2>
            <p className="profile-role">Head Admin</p>

            <nav className="profile-nav">
              <button
                className={`nav-item ${
                  activeTab === 'account' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('account')}
              >
                <FaUser /> Account
              </button>

              <button
                className={`nav-item ${
                  activeTab === 'security' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('security')}
              >
                <FaShieldAlt /> Security
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="profile-content">
          {successMessage && (
            <div className="alert success-alert">
              <FaCheck /> {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="alert error-alert">
              <FaTimes /> {errors.submit}
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <section className="content-section">
              <h1 className="section-title">Account Information</h1>

              <div className="info-field">
                <label className="field-label">
                  <FaEnvelope /> Email
                </label>
                <div className="field-value-box">
                  <span>{email || 'Not available'}</span>
                </div>
              </div>
            </section>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <section className="content-section">
              <h1 className="section-title">Change Password</h1>

              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label>
                    <FaLock /> New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <FaLock /> Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="error-message">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
