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
  FaUserTie,
  FaFileAlt,
  FaFilePdf,
  FaUniversity,
  FaCertificate,
  FaIdCard,
  FaDownload,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaReceipt,
  FaBriefcase,
  FaFolderOpen
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
  const [activeTab, setActiveTab] = useState('DETAILS'); // 'DETAILS', 'DOCUMENTS', 'SECURITY', 'EXPOS', 'PERMISSIONS'

  // Admin Profile Data State (Includes all fields from Add Expo Franchisee)
  const [profileData, setProfileData] = useState({
    // Company Details
    franchiseName: 'Terraterri Real Estate Franchise',
    franchiseGst: '36AACCT1234F1Z5',
    companyAddress: 'Suite 402, Building 3, Cyber Towers, Hitech City, Hyderabad, Telangana - 500081',

    // Personal Details
    name: 'Terraterri Franchise Admin',
    dob: '1990-05-15',
    role: 'Franchise Regional Admin',
    designation: 'Senior Expo Operations Manager',
    joinedDate: '2024-01-15',
    status: 'Active',

    // Contact Details
    email: 'franchise.admin@terraterri.com',
    secondaryEmail: 'support.franchise@terraterri.com',
    mobile: '+91 9063754321',
    secondaryPhone: '+91 9876543210',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    region: 'Telangana & AP Region',

    // Stats
    activeExpoCode: localStorage.getItem('expoCode') || 'EXINHYDWEST22SEP26-C',
    totalExposManaged: 12,
    totalBuildersManaged: 45,
    totalVisitorsManaged: 1280,

    // Upload Documents
    documents: {
      profileDoc: null,
      bankDetailsDoc: null,
      reraDoc: null,
      aadharCardDoc: null,
      companyPanCardDoc: null,
      personalPanCardDoc: null
    }
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Document Preview Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

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

      // 1. Try to fetch franchise info endpoint
      const franchiseRes = await expoAdminClient.get('/dashboard/franchiseInfo.php', config).catch(() => null);
      if (franchiseRes?.data?.status && (franchiseRes.data.data || franchiseRes.data.franchise)) {
        const info = franchiseRes.data.data || franchiseRes.data.franchise;
        setProfileData((prev) => ({
          ...prev,
          franchiseName: info.franchise_name,
          franchiseGst: info.franchise_gst || info.franchiseGst || info.gst_number || prev.franchiseGst,
          companyAddress: info.company_address || info.companyAddress || info.address || prev.companyAddress,
          name: info.username,
          dob: info.dob || info.date_of_birth || info.dateOfBirth || prev.dob,
          email: info.primary_email || info.email || prev.email,
          secondaryEmail: info.secondary_email,

          mobile: info.mobile,
          secondaryPhone: info.secondary_mobile,
          country: info.country || prev.country,
          state: info.state || prev.state,
          city: info.city || prev.city,
          joinedDate: info.created_date,
          documents: {
            profileDoc: info.profile_doc,
            bankDetailsDoc: info.bank,
            reraDoc: info.rera,
            aadharCardDoc: info.aadhar,
            companyPanCardDoc: info.company_pan,
            personalPanCardDoc: info.personal_pan
          }
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
      franchiseName: profileData.franchiseName,
      franchiseGst: profileData.franchiseGst,
      companyAddress: profileData.companyAddress,
      name: profileData.name,
      dob: profileData.dob,
      email: profileData.email,
      secondaryEmail: profileData.secondaryEmail,
      mobile: profileData.mobile,
      secondaryPhone: profileData.secondaryPhone,
      country: profileData.country,
      state: profileData.state,
      city: profileData.city,
      designation: profileData.designation,
      region: profileData.region
    });
    setShowEditModal(true);
  };



  const handleOpenDocModal = (docTitle, docUrl) => {
    if (!docUrl) {
      toastError(`No document uploaded yet for ${docTitle}`);
      return;
    }
    setSelectedDoc({ title: docTitle, url: docUrl });
    setShowDocModal(true);
  };

  const documentList = [
    {
      key: 'profileDoc',
      title: 'Profile Document',
      category: 'Profile Photo / ID',
      icon: <FaIdCard />,
      colorClass: 'bg-light-primary',
      url: profileData.documents.profileDoc
    },
    {
      key: 'bankDetailsDoc',
      title: 'Bank Details Document',
      category: 'Financial Verification',
      icon: <FaUniversity />,
      colorClass: 'bg-light-success',
      url: profileData.documents.bankDetailsDoc
    },
    {
      key: 'reraDoc',
      title: 'RERA Document',
      category: 'License & Compliance',
      icon: <FaCertificate />,
      colorClass: 'bg-light-warning',
      url: profileData.documents.reraDoc
    },
    {
      key: 'aadharCardDoc',
      title: 'Aadhar Card Document',
      category: 'Government Identity',
      icon: <FaIdCard />,
      colorClass: 'bg-light-purple',
      url: profileData.documents.aadharCardDoc
    },
    {
      key: 'companyPanCardDoc',
      title: 'Company PAN Card Document',
      category: 'Tax Identification',
      icon: <FaFileAlt />,
      colorClass: 'bg-light-info',
      url: profileData.documents.companyPanCardDoc
    },
    {
      key: 'personalPanCardDoc',
      title: 'Personal PAN Card Document',
      category: 'Personal Tax ID',
      icon: <FaFileAlt />,
      colorClass: 'bg-light-danger',
      url: profileData.documents.personalPanCardDoc
    }
  ];

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
                    <h4 className="mb-0 text-black font-size-18 fw-bold">Franchise Profile</h4>
                    <span className="text-muted font-size-13">View complete company, contact, personal & uploaded KYC documents</span>
                  </div>
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Franchise Profile</li>
                  </ol>
                </div>
              </div>

              {/* Profile Cover & Header Banner */}


              {/* KPI Summary Cards */}


              {/* Tab Navigation & Main Content */}
              <div className="profile-content-card card mt-4">
                <div className="card-header bg-white border-bottom px-4 py-3">
                  <ul className="nav nav-tabs card-header-tabs profile-nav-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'DETAILS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DETAILS')}
                      >
                        <FaUser className="me-2" /> Franchise Details
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'DOCUMENTS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DOCUMENTS')}
                      >
                        <FaFolderOpen className="me-2" /> Uploaded Documents ({documentList.filter((d) => d.url).length}/6)
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="card-body p-4">
                  {/* TAB 1: FRANCHISE & PERSONAL DETAILS */}
                  {activeTab === 'DETAILS' && (
                    <div className="row g-4">
                      {/* Company Details */}
                      <div className="col-lg-6">
                        <div className="profile-section-card">
                          <h6 className="profile-section-title">
                            <FaBuilding className="text-primary" /> Company Details
                          </h6>
                          <table className="table table-borderless table-sm profile-info-table mb-0">
                            <tbody>
                              <tr>
                                <td className="text-muted fw-semibold width-140">Franchise Name:</td>
                                <td className="fw-bold text-dark">{profileData.franchiseName}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Franchise GST:</td>
                                <td className="fw-bold text-primary font-mono">{profileData.franchiseGst}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Company Address:</td>
                                <td className="text-secondary">{profileData.companyAddress}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Personal Details */}
                      <div className="col-lg-6">
                        <div className="profile-section-card">
                          <h6 className="profile-section-title">
                            <FaUserTie className="text-success" /> Personal Details
                          </h6>
                          <table className="table table-borderless table-sm profile-info-table mb-0">
                            <tbody>
                              <tr>
                                <td className="text-muted fw-semibold width-140">Full Name:</td>
                                <td className="fw-bold text-dark">{profileData.name}</td>
                              </tr>
                              <tr>
                                <td className="text-muted fw-semibold">Date of Birth (DOB):</td>
                                <td className="fw-semibold text-dark">
                                  {profileData.dob ? moment(profileData.dob).format('DD MMM YYYY') : 'Not Provided'}
                                </td>
                              </tr>

                              <tr>
                                <td className="text-muted fw-semibold">Joined Date:</td>
                                <td>{moment(profileData.joinedDate).format('DD MMM YYYY')}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="col-12">
                        <div className="profile-section-card">
                          <h6 className="profile-section-title">
                            <FaPhone className="text-info" /> Contact Details & Location
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-6 col-lg-3">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">Primary Email</span>
                                <span className="fw-bold text-primary font-size-13 d-block text-truncate" title={profileData.email}>
                                  {profileData.email}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">Secondary Email</span>
                                <span className="fw-semibold text-dark font-size-13 d-block text-truncate" title={profileData.secondaryEmail}>
                                  {profileData.secondaryEmail || 'N/A'}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">Primary Phone</span>
                                <span className="fw-bold text-dark font-size-13 d-block">{profileData.mobile}</span>
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">Secondary Phone</span>
                                <span className="fw-semibold text-dark font-size-13 d-block">{profileData.secondaryPhone || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">Country</span>
                                <span className="fw-semibold text-dark font-size-13 d-block">{profileData.country}</span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">State</span>
                                <span className="fw-semibold text-dark font-size-13 d-block">{profileData.state}</span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 border rounded-3 bg-light-subtle">
                                <span className="text-muted font-size-12 d-block mb-1">City</span>
                                <span className="fw-semibold text-dark font-size-13 d-block">{profileData.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                    </div>
                  )}

                  {/* TAB 2: UPLOADED DOCUMENTS */}
                  {activeTab === 'DOCUMENTS' && (
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                          <h6 className="fw-bold text-dark m-0">Uploaded Franchise Documents</h6>
                          <span className="text-muted font-size-13">View verification documents submitted during franchisee registration</span>
                        </div>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 font-size-13">
                          Total Uploaded: {documentList.filter((d) => d.url).length} of 6
                        </span>
                      </div>

                      <div className="row g-4">
                        {documentList.map((doc, idx) => (
                          <div className="col-md-6 col-lg-4" key={idx}>
                            <div className="doc-card">
                              <div>
                                <div className="d-flex align-items-start justify-content-between mb-3">
                                  <div className={`doc-icon-wrap ${doc.colorClass}`}>{doc.icon}</div>
                                  {doc.url ? (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1">
                                      <FaCheckCircle size={12} /> Uploaded
                                    </span>
                                  ) : (
                                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 d-inline-flex align-items-center gap-1">
                                      <FaExclamationTriangle size={12} /> Pending
                                    </span>
                                  )}
                                </div>

                                <h6 className="fw-bold text-dark mb-1">{doc.title}</h6>
                                <span className="text-muted font-size-12 d-block mb-3">{doc.category}</span>
                              </div>

                              <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                                <button
                                  className="btn btn-sm btn-outline-primary fw-semibold d-inline-flex align-items-center gap-1"
                                  onClick={() => handleOpenDocModal(doc.title, doc.url)}
                                >
                                  <FaEye size={13} /> View Document
                                </button>
                                {doc.url && (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-light fw-semibold text-secondary d-inline-flex align-items-center gap-1"
                                    download
                                  >
                                    <FaDownload size={12} /> Download
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}





                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* DOCUMENT PREVIEW MODAL */}
      <Modal show={showDocModal} onHide={() => setShowDocModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 fw-bold text-dark">
            <FaFolderOpen className="text-primary me-2" /> Document Preview: {selectedDoc?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          {selectedDoc?.url ? (
            <div>
              {selectedDoc.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  className="img-fluid rounded border shadow-sm style-max-h-500"
                />
              ) : (
                <iframe
                  src={selectedDoc.url}
                  title={selectedDoc.title}
                  className="w-100 border rounded style-h-400"
                />
              )}
            </div>
          ) : (
            <div className="py-5">
              <FaExclamationTriangle size={48} className="text-warning mb-3" />
              <h5 className="fw-bold text-dark">Document Not Uploaded</h5>
              <p className="text-muted font-size-14">
                This document has not been uploaded yet for this franchise admin.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          {selectedDoc?.url && (
            <a
              href={selectedDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary fw-semibold"
              download
            >
              <FaDownload className="me-2" /> Download File
            </a>
          )}
          <Button variant="secondary" onClick={() => setShowDocModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FranchiseAdminProfile;
