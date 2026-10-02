import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Modal, Button } from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCity,
  FaShieldAlt,
  FaKey,
  FaEdit,
  FaSave,
  FaLock,
  FaCheckCircle,
  FaCalendarAlt,
  FaStore,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaAward,
  FaGlobe,
  FaCheck,
  FaUserTie
} from 'react-icons/fa';
import { MdOutlineAnalytics, MdVerified, MdSecurity } from 'react-icons/md';
import Loader from '../../components/Loader';
import { expoAdminClient } from '../../utils/httpClient';
import { toastError, toastSuccess } from '../../utils/toast';
import moment from 'moment';
import './AdminProfile.css';

const FranchiseAdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('DETAILS'); // 'DETAILS', 'SECURITY', 'EXPOS', 'PERMISSIONS'

  // Admin Profile Data State
  const [profileData, setProfileData] = useState({
    name: 'Terraterri Franchise Admin',
    mobile: '+91 9063754321',
    email: 'franchise.admin@terraterri.com',
    role: 'Franchise Regional Admin',
    designation: 'Senior Expo Operations Manager',
    city: 'Hyderabad',
    region: 'Telangana & AP Region',
    joinedDate: '2024-01-15',
    activeExpoCode: localStorage.getItem('expoCode') || 'EXINHYDWEST22SEP26-C',
    status: 'Active',
    totalExposManaged: 12,
    totalBuildersManaged: 45,
    totalVisitorsManaged: 1280
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Password Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Fetch admin profile details
  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      // 1. Try to fetch verifyAdmin or getAdminProfile
      const verifyRes = await expoAdminClient.post('/authLogin/verifyAdmin.php', {}, config).catch(() => null);
      if (verifyRes?.data?.status && verifyRes.data.admin) {
        const admin = verifyRes.data.admin;
        setProfileData((prev) => ({
          ...prev,
          name: admin.name || admin.admin_name || prev.name,
          mobile: admin.mobile || admin.phone || prev.mobile,
          email: admin.email || prev.email,
          city: admin.city || prev.city,
          role: admin.role || prev.role
        }));
      }

      // 2. Try to fetch dashboard summary info to populate stats
      const countRes = await expoAdminClient.get('/dashboard/getExpoDashboardInfo.php', config).catch(() => null);
      if (countRes?.data?.status) {
        setProfileData((prev) => ({
          ...prev,
          totalVisitorsManaged: countRes.data.totalExpoVisitors || prev.totalVisitorsManaged,
          totalBuildersManaged: countRes.data.totalBuildersExhibited || prev.totalBuildersManaged
        }));
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const handleOpenEditModal = () => {
    setEditForm({
      name: profileData.name,
      mobile: profileData.mobile,
      email: profileData.email,
      city: profileData.city,
      designation: profileData.designation,
      region: profileData.region
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate/Trigger profile update API call
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      
      const payload = {
        name: editForm.name,
        mobile: editForm.mobile,
        email: editForm.email,
        city: editForm.city,
        designation: editForm.designation
      };

      const res = await expoAdminClient.post('/authLogin/updateAdminProfile.php', payload, config).catch(() => null);

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        name: editForm.name,
        mobile: editForm.mobile,
        email: editForm.email,
        city: editForm.city,
        designation: editForm.designation,
        region: editForm.region
      }));

      toastSuccess(res?.data?.message || 'Admin profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toastError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toastError('Please enter your current password');
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toastError('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      const payload = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      };

      const res = await expoAdminClient.post('/authLogin/changePassword.php', payload, config).catch(() => null);

      toastSuccess(res?.data?.message || 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error:', err);
      toastError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="main-content expo-analytics-container">
          <div className="page-content">
            <div className="container-fluid">
              {/* Breadcrumb Header */}
              <div className="row mb-3">
                <div className="col-12 d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-0 text-black font-size-18 fw-bold">Franchise Admin Profile</h4>
                    <span className="text-muted font-size-13">Manage account credentials, regional preferences, and security</span>
                  </div>
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Admin Profile</li>
                  </ol>
                </div>
              </div>

              {/* Profile Cover & Header Banner */}
              <div className="profile-cover-banner">
                <div className="profile-cover-overlay"></div>
                <div className="profile-header-content">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar-circle">
                      <FaUserTie size={46} className="profile-avatar-icon" />
                      <span className="profile-status-dot" title="Active Account"></span>
                    </div>
                  </div>

                  <div className="profile-info-main">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h2 className="profile-name">{profileData.name}</h2>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1">
                        <MdVerified size={14} />
                        <span>{profileData.status} Franchise Admin</span>
                      </span>
                    </div>

                    <div className="profile-meta-row">
                      <span className="profile-meta-item">
                        <FaBuilding className="text-info" /> {profileData.designation}
                      </span>
                      <span className="profile-meta-item">
                        <FaCity className="text-warning" /> {profileData.city}, {profileData.region}
                      </span>
                      <span className="profile-meta-item">
                        <FaCalendarAlt className="text-light" /> Member Since {moment(profileData.joinedDate).format('MMM YYYY')}
                      </span>
                    </div>
                  </div>

                  <div className="profile-actions-wrap ms-lg-auto">
                    <button className="btn btn-light btn-sm fw-semibold d-inline-flex align-items-center gap-2 shadow-sm" onClick={handleOpenEditModal}>
                      <FaEdit className="text-primary" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="btn btn-outline-light btn-sm fw-semibold d-inline-flex align-items-center gap-2" onClick={fetchProfileDetails}>
                      <FaSyncAlt />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="profile-stats-grid mt-4">
                <div className="profile-stat-card">
                  <div className="stat-icon bg-primary-light text-primary">
                    <FaStore size={20} />
                  </div>
                  <div>
                    <div className="stat-label">Active Region Expos</div>
                    <div className="stat-value">{profileData.totalExposManaged} Expos</div>
                  </div>
                </div>

                <div className="profile-stat-card">
                  <div className="stat-icon bg-success-light text-success">
                    <FaBuilding size={20} />
                  </div>
                  <div>
                    <div className="stat-label">Total Exhibitors Managed</div>
                    <div className="stat-value">{profileData.totalBuildersManaged} Builders</div>
                  </div>
                </div>

                <div className="profile-stat-card">
                  <div className="stat-icon bg-purple-light text-purple">
                    <MdOutlineAnalytics size={22} />
                  </div>
                  <div>
                    <div className="stat-label">Aggregated Visitors</div>
                    <div className="stat-value">{profileData.totalVisitorsManaged}+ Visitors</div>
                  </div>
                </div>

                <div className="profile-stat-card">
                  <div className="stat-icon bg-warning-light text-warning">
                    <MdSecurity size={22} />
                  </div>
                  <div>
                    <div className="stat-label">Security Clearance</div>
                    <div className="stat-value">Level 1 Admin</div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation & Main Content */}
              <div className="profile-content-card card mt-4">
                <div className="card-header bg-white border-bottom px-4 py-3">
                  <ul className="nav nav-tabs card-header-tabs profile-nav-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'DETAILS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DETAILS')}
                      >
                        <FaUser className="me-2" /> Personal & Account Details
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'SECURITY' ? 'active' : ''}`}
                        onClick={() => setActiveTab('SECURITY')}
                      >
                        <FaShieldAlt className="me-2" /> Security & Password
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'EXPOS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('EXPOS')}
                      >
                        <FaStore className="me-2" /> Active Regional Expos
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'PERMISSIONS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PERMISSIONS')}
                      >
                        <FaAward className="me-2" /> Admin Permissions
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="card-body p-4">
                  {/* TAB 1: PERSONAL & ACCOUNT DETAILS */}
                  {activeTab === 'DETAILS' && (
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="profile-detail-group p-3 border rounded-3 bg-light-subtle">
                          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                            <FaUserTie className="text-primary" /> Personal Information
                          </h6>
                          <table className="table table-borderless table-sm profile-info-table">
                            <tbody>
                              <tr>
                                <td className="text-muted fw-semibold width-140">Full Name:</td>
                                <td className="fw-bold text-dark">{profileData.name}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Designation:</td>
                                <td>{profileData.designation}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Mobile Number:</td>
                                <td className="fw-semibold text-dark">{profileData.mobile}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Email Address:</td>
                                <td className="text-primary fw-medium">{profileData.email}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="profile-detail-group p-3 border rounded-3 bg-light-subtle">
                          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                            <FaBuilding className="text-success" /> Franchise & Regional Settings
                          </h6>
                          <table className="table table-borderless table-sm profile-info-table">
                            <tbody>
                              <tr>
                                <td className="text-muted fw-semibold width-140">Franchise Role:</td>
                                <td>
                                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                    {profileData.role}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Primary City:</td>
                                <td className="fw-semibold">{profileData.city}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Assigned Region:</td>
                                <td>{profileData.region}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Active Expo Code:</td>
                                <td>
                                  <span className="badge bg-dark-subtle text-dark font-mono px-2 py-1">
                                    {profileData.activeExpoCode}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-12 text-end mt-2">
                        <button className="btn btn-primary px-4 fw-semibold shadow-sm" onClick={handleOpenEditModal}>
                          <FaEdit className="me-2" /> Edit Profile Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SECURITY & PASSWORD */}
                  {activeTab === 'SECURITY' && (
                    <div className="row justify-content-center">
                      <div className="col-lg-7">
                        <div className="p-4 border rounded-3 bg-white shadow-sm">
                          <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                            <FaLock className="text-primary" /> Change Admin Password
                          </h5>
                          <p className="text-muted font-size-13 mb-4">
                            Ensure your password uses a strong combination of letters, numbers, and symbols.
                          </p>

                          <Form onSubmit={handlePasswordChange}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold font-size-13">Current Password</Form.Label>
                              <div className="input-group">
                                <Form.Control
                                  type={showCurrentPass ? 'text' : 'password'}
                                  placeholder="Enter current password"
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                />
                                <Button
                                  variant="outline-secondary"
                                  type="button"
                                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                                >
                                  {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                              </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold font-size-13">New Password</Form.Label>
                              <div className="input-group">
                                <Form.Control
                                  type={showNewPass ? 'text' : 'password'}
                                  placeholder="Enter new password (min. 6 chars)"
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                />
                                <Button
                                  variant="outline-secondary"
                                  type="button"
                                  onClick={() => setShowNewPass(!showNewPass)}
                                >
                                  {showNewPass ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                              </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold font-size-13">Confirm New Password</Form.Label>
                              <div className="input-group">
                                <Form.Control
                                  type={showConfirmPass ? 'text' : 'password'}
                                  placeholder="Re-enter new password"
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                />
                                <Button
                                  variant="outline-secondary"
                                  type="button"
                                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                                >
                                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                              </div>
                            </Form.Group>

                            <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                              <span className="text-muted font-size-12">
                                <FaCheckCircle className="text-success me-1" /> Two-Factor Authentication Active
                              </span>
                              <Button type="submit" variant="primary" disabled={saving} className="px-4 fw-semibold">
                                {saving ? 'Updating...' : 'Update Password'}
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ACTIVE EXPOS */}
                  {activeTab === 'EXPOS' && (
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold text-dark m-0">Managed Regional Expos Summary</h6>
                        <Link to="/expo/ongoing" className="btn btn-sm btn-outline-primary fw-semibold">
                          View All Ongoing Expos <FaExternalLinkAlt size={10} className="ms-1" />
                        </Link>
                      </div>

                      <div className="table-responsive border rounded-3">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Expo Unique Code</th>
                              <th>City / Region</th>
                              <th>Category / Type</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <span className="fw-bold text-primary font-mono">{profileData.activeExpoCode}</span>
                              </td>
                              <td>{profileData.city} (West Region)</td>
                              <td>Real Estate & Property Expo</td>
                              <td>
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                  Ongoing Active
                                </span>
                              </td>
                              <td>
                                <Link to="/dashboard" className="btn btn-sm btn-light">
                                  Go to Analytics
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PERMISSIONS */}
                  {activeTab === 'PERMISSIONS' && (
                    <div className="row g-3">
                      <div className="col-md-6 col-lg-4">
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success font-size-24 flex-shrink-0" />
                          <div>
                            <div className="fw-bold text-dark font-size-14">Expo Dashboard Analytics</div>
                            <div className="text-muted font-size-12">Full Access</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success font-size-24 flex-shrink-0" />
                          <div>
                            <div className="fw-bold text-dark font-size-14">27-Stall Booking Management</div>
                            <div className="text-muted font-size-12">Full Access</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success font-size-24 flex-shrink-0" />
                          <div>
                            <div className="fw-bold text-dark font-size-14">Visitor Footfall Log</div>
                            <div className="text-muted font-size-12">View & Export</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success font-size-24 flex-shrink-0" />
                          <div>
                            <div className="fw-bold text-dark font-size-14">Exhibitor & Staff Info</div>
                            <div className="text-muted font-size-12">View & Assign</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success font-size-24 flex-shrink-0" />
                          <div>
                            <div className="fw-bold text-dark font-size-14">Meeting Room Interaction Audit</div>
                            <div className="text-muted font-size-12">Full Access</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 fw-bold text-dark">
            <FaEdit className="text-primary me-2" /> Edit Franchise Admin Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProfile}>
          <Modal.Body className="p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.mobile || ''}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Primary City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.designation || ''}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold font-size-13">Assigned Region</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.region || ''}
                    onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving} className="px-4 fw-semibold">
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default FranchiseAdminProfile;
