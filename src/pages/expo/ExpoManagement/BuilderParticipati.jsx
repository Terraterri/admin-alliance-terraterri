import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastError } from '../../../utils/toast';
import Pagenation from '../../../utils/Pagenation';

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

  // Modal state
  const [show, setShow] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallVisitors, setStallVisitors] = useState([]);

  const handleClose = () => {
    setShow(false);
    setSelectedStall(null);
    setStallVisitors([]);
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
      const res = await expoAdminClient.get(
        `tt-expo-builder-be/expoAnalytics/getStallCustomers.php?expoCode=${activeExpoCode}&stallId=${stallInfoId}`,
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
                            <th>Sponsor's Stall</th>
                            <th>Builder Name</th>
                            <th>Stall Visitors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {buildersData.length > 0 ? (
                            buildersData.map((data, index) => {
                              const stallCode = data.stallUnqCode || data.stall_unq_code || data.stallCode || '-';
                              const builderName = data.builderName || data.builder_name || data.builder?.name || data.name || '-';
                              const visitorCount = data.visitorCount ?? data.visitors_count ?? data.visitors?.length ?? 0;

                              return (
                                <tr key={data.id || index}>
                                  <td>{stallCode}</td>
                                  <td>{builderName}</td>
                                  <td>
                                    <Button
                                      variant="primary"
                                      onClick={() => handleShowVisitors(data)}
                                      className='listin_btn'
                                    >
                                      {visitorCount}
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

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Stall Visitors</Modal.Title>
          </Modal.Header>
          <div className='popup p-3'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      Visitors for {selectedStall?.builderName || selectedStall?.stallUnqCode || 'Stall'}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Visitor Name</th>
                            <th>Mobile Number</th>
                            <th>Email Id</th>
                            <th>Executive</th>
                            <th>Visited Date & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visitorLoading ? (
                            <tr>
                              <td colSpan="6" className="text-center">Loading visitors...</td>
                            </tr>
                          ) : stallVisitors.length > 0 ? (
                            stallVisitors.map((visitor, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{visitor.name || visitor.userName || visitor.visitor_name || '-'}</td>
                                <td>{visitor.number || visitor.mobile || visitor.userMobile || '-'}</td>
                                <td>{visitor.email || visitor.userEmail || '-'}</td>
                                <td>{visitor.executiveName || visitor.executive_name || visitor.executive || '-'}</td>
                                <td>
                                  {visitor.visitedDate && visitor.visitedTime
                                    ? `${visitor.visitedDate} ${visitor.visitedTime}`
                                    : visitor.visitedDate || visitor.joined_at || visitor.visited_at || '-'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">No visitors found for this stall.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default BuilderParticipati;