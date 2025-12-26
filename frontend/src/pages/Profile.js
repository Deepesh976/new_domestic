import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaLock,
    FaCheck,
    FaTimes,
    FaShieldAlt
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();

    const [username] = useState(localStorage.getItem('username') || 'User');
    const [email] = useState(localStorage.getItem('email') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setIsSubmitting(true);
        setErrors({});

        const validationErrors = {};
        if (password && password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        const formData = { password };

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMessage('Password updated successfully!');
                setPassword('');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            setErrors({ submit: error.message || 'Something went wrong!' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="profile-wrapper">
            <button className="back-button" onClick={handleBackClick}>
                <FaArrowLeft />
                Back
            </button>

            <div className="profile-layout">
                {/* Left Sidebar */}
                <aside className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                        <h2 className="profile-username">{username}</h2>
                        <p className="profile-role">Administrator</p>

                        <div className="profile-status">
                            <div className="status-badge active"></div>
                            <span className="status-text">Active</span>
                        </div>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-label">Account Status</span>
                                <span className="stat-value">Verified</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Member Since</span>
                                <span className="stat-value">2024</span>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            <button
                                className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                <FaUser /> Account
                            </button>

                            <button
                                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <FaShieldAlt /> Security
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Content */}
                <main className="profile-content">
                    {successMessage && (
                        <div className="alert success-alert">
                            <FaCheck className="alert-icon" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errors.submit && (
                        <div className="alert error-alert">
                            <FaTimes className="alert-icon" />
                            <span>{errors.submit}</span>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <section className="content-section">
                            <div className="section-header">
                                <h1 className="section-title">Account Information</h1>
                                <p className="section-subtitle">View your account details</p>
                            </div>

                            <div className="info-fields">
                                <div className="info-field">
                                    <label className="field-label">
                                        <FaUser className="field-icon" />
                                        Username
                                    </label>
                                    <div className="field-value-box">
                                        <span className="field-value">{username}</span>
                                    </div>
                                </div>

                                <div className="info-field">
                                    <label className="field-label">
                                        <FaEnvelope className="field-icon" />
                                        Email Address
                                    </label>
                                    <div className="field-value-box">
                                        <span className="field-value">{email || 'Not set'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <section className="content-section">
                            <div className="section-header">
                                <h1 className="section-title">Security Settings</h1>
                                <p className="section-subtitle">Manage your password and security</p>
                            </div>

                            <form onSubmit={handleUpdate} className="security-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        <FaLock className="label-icon" />
                                        New Password
                                    </label>

                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                                            placeholder="Enter a new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isSubmitting}
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isSubmitting}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <div className="error-message">
                                            <FaTimes className="error-icon" />
                                            {errors.password}
                                        </div>
                                    )}

                                    <p className="password-hint">
                                        Minimum 6 characters. Use a mix of letters, numbers, and symbols for better security.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting || !password}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Update Password
                                        </>
                                    )}
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
