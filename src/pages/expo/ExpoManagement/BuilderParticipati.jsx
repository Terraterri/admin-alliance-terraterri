import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { expoAdminClient, expoApiClient } from '../../../utils/httpClient';
import { toastError } from '../../../utils/toast';
import Pagenation from '../../../utils/Pagenation';
import moment from 'moment';
import {
  FaSearch, FaSyncAlt, FaPhoneAlt, FaEnvelope,
  FaClock, FaRobot, FaUserTie, FaHandshake
} from 'react-icons/fa';

const BuilderParticipati = () => {
  const [loading, setLoading] = useState(false);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [expoCode, setExpoCode] = useState(localStorage.getItem('expoCode') || '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [buildersData, setBuildersData] = useState([]);

  // Pagination state
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Visitors Modal state
  const [show, setShow] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallVisitors, setStallVisitors] = useState([]);

  // Interactions Modal state
  const [showInteraction, setShowInteraction] = useState(false);
  const [interactionStall, setInteractionStall] = useState(null);
  const [stallCustomersData, setStallCustomersData] = useState([]);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionTotalRecords, setInteractionTotalRecords] = useState(0);
  const [interactionTotalPages, setInteractionTotalPages] = useState(1);
  const [interactionPage, setInteractionPage] = useState(1);
  const [interactionPerPage, setInteractionPerPage] = useState(10);
  const [interactionSearchQuery, setInteractionSearchQuery] = useState('');
  const [interactionFromDate, setInteractionFromDate] = useState('');
  const [interactionToDate, setInteractionToDate] = useState('');
  const [interactionTableFilter, setInteractionTableFilter] = useState('ALL');
  const [interactionStaffFilter, setInteractionStaffFilter] = useState('ALL');

  const handleClose = () => {
    setShow(false);
    setSelectedStall(null);
    setStallVisitors([]);
  };

  const handleCloseInteraction = () => {
    setShowInteraction(false);
    setInteractionStall(null);
    setStallCustomersData([]);
    setInteractionTotalRecords(0);
    setInteractionTotalPages(1);
    setInteractionPage(1);
    setInteractionSearchQuery('');
    setInteractionFromDate('');
    setInteractionToDate('');
    setInteractionTableFilter('ALL');
    setInteractionStaffFilter('ALL');
  };

  // Resolve single active expo code
  const getSingleExpoCode = async () => {
    const savedCode = localStorage.getItem('expoCode');
    if (savedCode) {
      setExpoCode(savedCode);
      return savedCode;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.get(`NewExpos/get.php?type=ongoing`, config);
      if (res?.data?.status && res.data.data?.length > 0) {
        const code = res.data.data[0].expoUnqCode;
        setExpoCode(code);
        return code;
      }
    } catch (err) {
      console.error('Error fetching ongoing expo:', err);
    }
    return '';
  };

  // Fetch Participating Builders / Stall Bookings from API
  const fetchBuildersData = async (overrideFilters = null) => {
    setLoading(true);
    const fDate = overrideFilters && 'fromDate' in overrideFilters ? overrideFilters.fromDate : fromDate;
    const tDate = overrideFilters && 'toDate' in overrideFilters ? overrideFilters.toDate : toDate;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      let activeExpoCode = expoCode || localStorage.getItem('expoCode');
      if (!activeExpoCode) {
        activeExpoCode = await getSingleExpoCode();
      }

      let url = `NewExpo/getExpoBookings.php?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`;
      if (activeExpoCode) {
        url += `&id=${activeExpoCode}`;
      }
      if (fDate) {
        url += `&fromDate=${encodeURIComponent(fDate)}`;
      }
      if (tDate) {
        url += `&toDate=${encodeURIComponent(tDate)}`;
      }

      const res = await expoAdminClient.get(url, config);

      if (res?.data?.status) {
        let data = res.data.data || [];

        if (fDate) {
          const from = new Date(fDate);
          from.setHours(0, 0, 0, 0);
          data = data.filter((item) => {
            const itemDateStr = item.created_at || item.date || item.joined_at;
            if (!itemDateStr) return true;
            const parsed = new Date(itemDateStr);
            return !isNaN(parsed) ? parsed >= from : true;
          });
        }
        if (tDate) {
          const to = new Date(tDate);
          to.setHours(23, 59, 59, 999);
          data = data.filter((item) => {
            const itemDateStr = item.created_at || item.date || item.joined_at;
            if (!itemDateStr) return true;
            const parsed = new Date(itemDateStr);
            return !isNaN(parsed) ? parsed <= to : true;
          });
        }

        setBuildersData(data);
        setTotalPages(Math.ceil((res.data.count || data.length) / itemsPerPage) || 1);
      } else {
        setBuildersData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching builders data:', error);
      toastError('Failed to load participating builders data');
      setBuildersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildersData();
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchBuildersData();
    }
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchBuildersData({ fromDate: '', toDate: '' });
    }
  };

  const extractVisitors = (data) => {
    let list = [];
    if (!data) return list;

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.users && Array.isArray(item.users)) {
          item.users.forEach((u) => {
            list.push({
              ...u,
              executiveName: item.executive_name || item.executiveName || item.executive || '-',
              visitedDate: item.date || item.joined_at || '-'
            });
          });
        } else {
          list.push(item);
        }
      });
      return list;
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([dateStr, execItems]) => {
        if (Array.isArray(execItems)) {
          execItems.forEach((execItem) => {
            const execName = execItem.executive_name || execItem.executiveName || execItem.executive || '-';
            if (Array.isArray(execItem.users)) {
              execItem.users.forEach((u) => {
                list.push({
                  ...u,
                  executiveName: execName,
                  visitedDate: dateStr,
                  visitedTime: u.joined_at || u.created_at || u.time || ''
                });
              });
            }
          });
        }
      });
    }

    return list;
  };

  const handleShowVisitors = async (stallItem) => {
    setSelectedStall(stallItem);
    setShow(true);
    setVisitorLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      const stallCode = stallItem.stallUnqCode || stallItem.stall_unq_code || stallItem.stallCode;
      const activeExpoCode = expoCode || localStorage.getItem('expoCode');
      const stallInfoId = stallItem.stallInfoId;
      const res = await expoApiClient.get(
        `expoAnalytics/getStallVisitors.php?expoId=${activeExpoCode}&stallCode=${stallCode}&page=1&limit=10`,
        config
      );

      if (res?.data?.success || res?.data?.status) {
        const parsedVisitors = extractVisitors(res.data.data);
        setStallVisitors(parsedVisitors);
      } else if (Array.isArray(stallItem.visitors)) {
        setStallVisitors(extractVisitors(stallItem.visitors));
      } else {
        setStallVisitors([]);
      }
    } catch (error) {
      console.error('Error fetching stall visitors:', error);
      if (Array.isArray(stallItem.visitors)) {
        setStallVisitors(extractVisitors(stallItem.visitors));
      } else {
        setStallVisitors([]);
      }
    } finally {
      setVisitorLoading(false);
    }
  };

  const parseCustomerData = (data, stall) => {
    let list = [];
    if (!data) return list;

    // Helper to resolve executive display name
    const resolveExecutiveName = (item, fallbackTableNo) => {
      if (item.executiveId === 'AI_BOT' || item.executiveId === 'AI' || item.isAi) {
        return 'AI Executive (AI Bot)';
      }
      if (item.executive_name && item.executive_name !== 'null') {
        return item.executive_name;
      }
      if (item.executiveName && item.executiveName !== 'null') {
        return item.executiveName;
      }
      if (item.executiveId && item.executiveId !== 'null') {
        return item.executiveId;
      }
      return `Executive ${fallbackTableNo}`;
    };

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const tableNum = Number(item.tableId) || (index % (stall?.tablesCount || 2)) + 1;
        const execName = resolveExecutiveName(item, tableNum);
        const isAi = item.executiveId === 'AI_BOT' || item.executiveId === '0' || !item.executiveId || execName.includes('AI');

        if (item.users && Array.isArray(item.users)) {
          item.users.forEach((u, uIdx) => {
            list.push({
              id: `${index}-${uIdx}`,
              userId: u.userId || u.id,
              name: u.name || u.userName || `Visitor ${uIdx + 1}`,
              phone: u.number || u.phone || u.mobile || '-',
              email: u.email || '-',
              visitedAt: u.joined_at ? `${item.date || ''} ${u.joined_at}`.trim() : (item.date || moment().format('YYYY-MM-DD HH:mm')),
              executiveName: execName,
              executiveId: item.executiveId,
              isAi,
              tableNo: tableNum,
              interactionType: isAi ? 'AI Executive Session' : (u.type || 'Meeting Room Call'),
              duration: u.duration || '3m 30s'
            });
          });
        } else {
          list.push({
            id: item.id || index,
            userId: item.userId || item.id,
            name: item.name || item.userName || `Visitor ${index + 1}`,
            phone: item.number || item.phone || item.mobile || '-',
            email: item.email || '-',
            visitedAt: item.joined_at || (item.join_date && item.joined_time ? `${item.join_date} ${item.joined_time}` : item.visited_at) || moment().format('YYYY-MM-DD HH:mm'),
            executiveName: execName,
            executiveId: item.executiveId,
            isAi,
            tableNo: tableNum,
            interactionType: isAi ? 'AI Executive Session' : (item.interactionType || 'Meeting Room Discussion'),
            duration: item.duration || '3m 15s'
          });
        }
      });
      return list;
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([dateStr, execItems], dIdx) => {
        if (Array.isArray(execItems)) {
          execItems.forEach((execItem, eIdx) => {
            const tableNum = Number(execItem.tableId) || (eIdx % (stall?.tablesCount || 2)) + 1;
            const execName = resolveExecutiveName(execItem, tableNum);
            const isAi = execItem.executiveId === 'AI_BOT' || execName.includes('AI');

            if (Array.isArray(execItem.users)) {
              execItem.users.forEach((u, uIdx) => {
                const timeString = u.joined_at ? `${dateStr} ${u.joined_at}` : dateStr;
                list.push({
                  id: `${dIdx}-${eIdx}-${uIdx}`,
                  userId: u.userId || u.id,
                  name: u.name || u.userName || `Visitor ${uIdx + 1}`,
                  phone: u.number || u.phone || '-',
                  email: u.email || '-',
                  visitedAt: timeString,
                  executiveName: execName,
                  executiveId: execItem.executiveId,
                  isAi,
                  tableNo: tableNum,
                  interactionType: isAi ? 'AI Executive Session' : 'Meeting Room Call',
                  duration: u.duration || '4m 15s'
                });
              });
            }
          });
        }
      });
    }

    return list;
  };

  const fetchStallInteractions = async (stallData, page = 1, limit = 10, search = '', fromDateVal = '', toDateVal = '', tableFilter = 'ALL', staffFilter = 'ALL') => {
    const activeExpoCode = stallData?.expoUnqCode || expoCode || localStorage.getItem('expoCode');
    const stallInfoId = stallData?.stallInfoId;
    const stallCodeVal = stallData?.stallCode;
    if (!activeExpoCode || !stallInfoId) return;

    setInteractionStall(stallData);
    setShowInteraction(true);
    setInteractionLoading(true);
    setStallCustomersData([]);

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null }
      };
      const params = new URLSearchParams({
        expoCode: activeExpoCode,
        stallId: String(stallInfoId),
        stallCode: stallCodeVal || '',
        page: String(page),
        limit: String(limit)
      });
      if (fromDateVal) params.append('fromDate', fromDateVal);
      if (toDateVal) params.append('toDate', toDateVal);
      if (tableFilter && tableFilter !== 'ALL') params.append('tableId', tableFilter);
      if (staffFilter && staffFilter !== 'ALL') {
        if (staffFilter === 'HUMAN') params.append('staffType', 'human');
        else if (staffFilter === 'AI') params.append('staffType', 'ai');
        else params.append('executiveId', staffFilter);
      }
      if (search && search.trim()) params.append('search', search.trim());

      const res = await expoApiClient.get(`expoAnalytics/getStallCustomers.php?${params.toString()}`, config);
      if (res?.data?.success || res?.data?.status) {
        const payload = res.data.logs || res.data.data || [];
        const parsed = parseCustomerData(payload, stallData);
        setStallCustomersData(parsed);
        setInteractionTotalRecords(res.data.totalRecords !== undefined ? Number(res.data.totalRecords) : parsed.length);
        setInteractionTotalPages(res.data.totalPages ? Number(res.data.totalPages) : Math.ceil((parsed.length || 1) / limit));
      } else {
        setStallCustomersData([]);
        setInteractionTotalRecords(0);
        setInteractionTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching stall interactions:', err);
      setStallCustomersData([]);
      setInteractionTotalRecords(0);
      setInteractionTotalPages(1);
    } finally {
      setInteractionLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li className="breadcrumb-item active">Builders Participated</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <form className="custom-validation mb-3" onSubmit={handleSearch}>
              <div className="row align-items-center">
                <div className="col-md-3 mt-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="from-date"
                      className="form-control"
                      name="fromdate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                    <label htmlFor="from-date" className="fw-normal">From Date</label>
                  </div>
                </div>
                <div className="col-md-3 mt-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="to-date"
                      className="form-control"
                      name="todate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                    <label htmlFor="to-date" className="fw-normal">To Date</label>
                  </div>
                </div>
                <div className="col-md-3 mt-3 d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Search</button>
                  <button className="btn btn-secondary" type="button" onClick={handleReset}>Reset</button>
                </div>
              </div>
            </form>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Builders Participated in Expo</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Stall Type</th>
                            <th>Builder Name</th>
                            <th>Stall Start Date</th>
                            <th>Stall End Date</th>
                            <th>Stall Visitors</th>
                            <th>Stall Interactions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {buildersData.length > 0 ? (
                            buildersData.map((data, index) => {
                              const stallCode = data.stallUnqCode || data.stall_unq_code || data.stallCode || '-';
                              const builderName = data.builderName || data.builder_name || data.builder?.name || data.name || '-';
                              const visitorCount = data.visitorCount ?? data.visitors_count ?? data.visitors?.length ?? 0;
                              const interactionCount = data.visitorTableCount ?? data.visitorTableCount ?? data.visitorTableCount ?? 0;

                              return (
                                <tr key={data.id || index}>
                                  <td>{stallCode}</td>
                                  <td>{builderName}</td>
                                  <td>{data.bookingStartDate}</td>
                                  <td>{data.bookingEndDate}</td>
                                  <td>
                                    <Button
                                      variant="primary"
                                      onClick={() => handleShowVisitors(data)}
                                      className='listin_btn'
                                    >
                                      {visitorCount}
                                    </Button>
                                  </td>

                                  <td>
                                    <Button
                                      variant="success"
                                      onClick={() => fetchStallInteractions(data)}
                                      className='listin_btn'
                                    >
                                      {interactionCount}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">No builders found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <Pagenation
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalPages={totalPages}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Stall Visitors Modal === */}
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Stall Visitors — {selectedStall?.builderName || selectedStall?.stallCode || 'Stall'}</Modal.Title>
          </Modal.Header>
          <div className='popup p-3'>
            <div className="table-responsive-md">
              <table className="table text-nowrap mb-0">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Visitor Name</th>
                    <th>Mobile Number</th>
                    <th>Email Id</th>

                    <th>Visited Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorLoading ? (
                    <tr><td colSpan="6" className="text-center">Loading visitors...</td></tr>
                  ) : stallVisitors.length > 0 ? (
                    stallVisitors.map((visitor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{visitor.name || visitor.userName || visitor.visitor_name || '-'}</td>
                        <td>{visitor.number || visitor.mobile || visitor.userMobile || '-'}</td>
                        <td>{visitor.email || visitor.userEmail || '-'}</td>
                        <td>
                          {visitor.visit_date && visitor.visit_time
                            ? `${visitor.visit_date} ${visitor.visit_time}`
                            : visitor.visit_date || visitor.joined_at || visitor.visited_at || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center">No visitors found for this stall.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* === Stall Interaction Logs Modal (Dashboard-style) === */}
        <Modal show={showInteraction} onHide={handleCloseInteraction} size="xl" backdrop="static">
          <Modal.Header
            closeButton
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff' }}
          >
            <Modal.Title style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaHandshake /> Meeting Room Interaction Logs —{' '}
              {interactionStall?.builderName || interactionStall?.stallCode || 'Stall'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {/* Filter Toolbar */}
            <div className="modal-filter-toolbar" style={{
              display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 10, padding: '14px 16px', marginBottom: 20
            }}>
              {/* Search */}
              <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, display: 'block' }}>Search Interaction</label>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13, pointerEvents: 'none', zIndex: 2 }} />
                  <Form.Control
                    type="text"
                    placeholder="Search visitor, phone, executive..."
                    value={interactionSearchQuery}
                    onChange={(e) => {
                      setInteractionSearchQuery(e.target.value);
                      setInteractionPage(1);
                    }}
                    style={{ paddingLeft: 32, fontSize: 13, borderRadius: 8 }}
                  />
                </div>
              </div>

              {/* From Date */}
              <div style={{ minWidth: 140 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, display: 'block' }}>From Date</label>
                <Form.Control type="date" value={interactionFromDate}
                  onChange={(e) => { setInteractionFromDate(e.target.value); setInteractionPage(1); }}
                  style={{ fontSize: 13, borderRadius: 8 }} />
              </div>

              {/* To Date */}
              <div style={{ minWidth: 140 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, display: 'block' }}>To Date</label>
                <Form.Control type="date" value={interactionToDate}
                  onChange={(e) => { setInteractionToDate(e.target.value); setInteractionPage(1); }}
                  style={{ fontSize: 13, borderRadius: 8 }} />
              </div>

              {/* Table / Room */}
              <div style={{ minWidth: 150 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, display: 'block' }}>Table / Room</label>
                <Form.Select value={interactionTableFilter}
                  onChange={(e) => { setInteractionTableFilter(e.target.value); setInteractionStaffFilter('ALL'); setInteractionPage(1); }}
                  style={{ fontSize: 13, borderRadius: 8 }}>
                  <option value="ALL">All Tables</option>
                  {Array.from({ length: interactionStall?.tablesCount || 2 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={String(num)}>Table {num}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Staff / Mode */}
              <div style={{ minWidth: 170 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, display: 'block' }}>Staff / Mode</label>
                <Form.Select value={interactionStaffFilter}
                  onChange={(e) => { setInteractionStaffFilter(e.target.value); setInteractionPage(1); }}
                  style={{ fontSize: 13, borderRadius: 8 }}>
                  <option value="ALL">All Staff &amp; AI</option>
                  <option value="HUMAN">Human Executives Only</option>
                  <option value="AI">AI Bot Standby Only</option>
                </Form.Select>
              </div>

              {/* Apply / Reset */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <button type="button" className="btn btn-primary btn-sm"
                  onClick={() => fetchStallInteractions(interactionStall, 1, interactionPerPage, interactionSearchQuery, interactionFromDate, interactionToDate, interactionTableFilter, interactionStaffFilter)}>
                  Apply
                </button>
                {(interactionSearchQuery || interactionFromDate || interactionToDate || interactionTableFilter !== 'ALL' || interactionStaffFilter !== 'ALL') && (
                  <button type="button" className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setInteractionSearchQuery('');
                      setInteractionFromDate('');
                      setInteractionToDate('');
                      setInteractionTableFilter('ALL');
                      setInteractionStaffFilter('ALL');
                      setInteractionPage(1);
                      fetchStallInteractions(interactionStall, 1, interactionPerPage, '', '', '', 'ALL', 'ALL');
                    }}>
                    <FaSyncAlt size={11} className="me-1" /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive position-relative">
              {interactionLoading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                  style={{ background: 'rgba(255,255,255,0.75)', zIndex: 5 }}>
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              )}
              <table className="custom-analytics-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Visitor Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Visited Time</th>
                    <th>Interacted Room / Executive</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {stallCustomersData.map((vis, idx) => {
                    const rowNumber = (interactionPage - 1) * interactionPerPage + idx + 1;
                    const isAiEntry = vis.isAi || vis.executiveId === 'AI_BOT';
                    return (
                      <tr key={vis.id || idx}>
                        <td>{rowNumber}</td>
                        <td><strong>{vis.name || '-'}</strong></td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FaPhoneAlt size={11} style={{ color: '#94a3b8' }} /> {vis.phone || '-'}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                            <FaEnvelope size={11} /> {vis.email || '-'}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                            <FaClock size={11} /> {vis.visitedAt ? moment(vis.visitedAt).format('DD MMM YYYY HH:mm') : '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isAiEntry ? 'bg-secondary' : 'bg-primary'} bg-opacity-10 text-${isAiEntry ? 'secondary' : 'primary'} border px-2 py-1`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {isAiEntry
                              ? <><FaRobot size={12} /> Table {vis.tableNo} - AI Bot (Standby)</>
                              : <><FaUserTie size={12} /> Table {vis.tableNo} - {vis.executiveName || '-'}</>
                            }
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success">
                            {vis.duration || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {stallCustomersData.length === 0 && !interactionLoading && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No meeting room interactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {interactionTotalRecords > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Showing {Math.min((interactionPage - 1) * interactionPerPage + 1, interactionTotalRecords)} to{' '}
                  {Math.min(interactionPage * interactionPerPage, interactionTotalRecords)} of {interactionTotalRecords} interactions
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Form.Select value={interactionPerPage} style={{ width: 'auto', fontSize: 13 }}
                    onChange={(e) => {
                      setInteractionPerPage(Number(e.target.value));
                      setInteractionPage(1);
                      fetchStallInteractions(interactionStall, 1, Number(e.target.value), interactionSearchQuery, interactionFromDate, interactionToDate, interactionTableFilter, interactionStaffFilter);
                    }}>
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                  </Form.Select>
                  <button className="btn btn-outline-secondary btn-sm"
                    disabled={interactionPage <= 1}
                    onClick={() => {
                      const p = interactionPage - 1;
                      setInteractionPage(p);
                      fetchStallInteractions(interactionStall, p, interactionPerPage, interactionSearchQuery, interactionFromDate, interactionToDate, interactionTableFilter, interactionStaffFilter);
                    }}>«</button>
                  <span style={{ fontSize: 13 }}>Page {interactionPage} / {interactionTotalPages}</span>
                  <button className="btn btn-outline-secondary btn-sm"
                    disabled={interactionPage >= interactionTotalPages}
                    onClick={() => {
                      const p = interactionPage + 1;
                      setInteractionPage(p);
                      fetchStallInteractions(interactionStall, p, interactionPerPage, interactionSearchQuery, interactionFromDate, interactionToDate, interactionTableFilter, interactionStaffFilter);
                    }}>»</button>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={handleCloseInteraction}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default BuilderParticipati;