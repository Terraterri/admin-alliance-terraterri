
import { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { MdWhatsapp } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { FaFileDownload } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { expoAdminClient } from '../../../utils/httpClient';
import { toastError } from '../../../utils/toast';
import Pagenation from '../../../utils/Pagenation';
const NoofVisitors = () => {

  const [show, setShow] = useState(false);
  const [WhatsappShow, setWhatsappShow] = useState(false);
  const [EnquiryShow, setEnquiryShow] = useState(false);
  const [CommentShow, setCommentShow] = useState(false);
  const [DropMessageShow, setDropMessageShow] = useState(false);

  const handleClose = () => { setShow(false); setWhatsappShow(false); setEnquiryShow(false); setCommentShow(false); setDropMessageShow(false); }

  const handleShow = () => setShow(true);
  const handleWhatsapp = () => setWhatsappShow(true);

  const [loading, setLoading] = useState(false);
  const [expoVisitors, setExpoVisitors] = useState([]);
  const { expoUnqCode } = useParams();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchExpoVisitors = async (overrideFilters = null) => {
    setLoading(true);
    const fDate = overrideFilters && 'fromDate' in overrideFilters ? overrideFilters.fromDate : fromDate;
    const tDate = overrideFilters && 'toDate' in overrideFilters ? overrideFilters.toDate : toDate;

    try {
      let url = `expoUserAnalytics/expo/get.php?expoId=${localStorage.getItem("expoCode")}&limit=${itemsPerPage}&skip=${currentPage - 1}`;
      if (fDate) {
        url += `&fromDate=${encodeURIComponent(fDate)}`;
      }
      if (tDate) {
        url += `&toDate=${encodeURIComponent(tDate)}`;
      }

      const res = await expoAdminClient.get(
        url,
        {
          headers: {
            "authorization": localStorage.getItem("adminToken")
          }
        }
      );

      if (res?.data?.status) {
        let visitors = res.data.data || [];

        // Fallback client-side filtering if backend returns unfiltered data
        if (fDate) {
          const from = new Date(fDate);
          from.setHours(0, 0, 0, 0);
          visitors = visitors.filter(item => {
            const itemDateStr = item.created_at || item.date || item.joined_at;
            if (!itemDateStr) return true;
            const parsed = new Date(itemDateStr);
            return !isNaN(parsed) ? parsed >= from : true;
          });
        }
        if (tDate) {
          const to = new Date(tDate);
          to.setHours(23, 59, 59, 999);
          visitors = visitors.filter(item => {
            const itemDateStr = item.created_at || item.date || item.joined_at;
            if (!itemDateStr) return true;
            const parsed = new Date(itemDateStr);
            return !isNaN(parsed) ? parsed <= to : true;
          });
        }

        setExpoVisitors(visitors);
        setTotalPages(Math.ceil((res.data.count || visitors.length) / itemsPerPage) || 1);
      } else {
        setExpoVisitors([]);
        setTotalPages(1);
      }
    } catch (error) {
      setExpoVisitors([]);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpoVisitors();
  }, [expoUnqCode, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchExpoVisitors();
    }
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchExpoVisitors({ fromDate: '', toDate: '' });
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
                      <li className="breadcrumb-item active">No Of Visitors</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <form className="custom-validation mb-3" onSubmit={handleSearch}>
                <div className="row align-items-center">
                  <div className="col-md-3 mt-3">
                    <div className="">
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
                  </div>
                  <div className="col-md-3 mt-3">
                    <div className="">
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
                  </div>
                  <div className="col-md-3 mt-3 d-flex gap-2">
                    <button className="btn btn-primary" type="submit">Search</button>
                    <button className="btn btn-secondary" type="button" onClick={handleReset}>Reset</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">No of Visitors</h3>
                    {/* <h3 className="card-title">Day 1</h3> */}
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Visitor Name</th>
                            {/* <th>Source Name</th> */}
                            <th>Mobile Number</th>
                            <th>Email Id</th>
                            <th>Visited at</th>
                            {/* <th>Stall ID</th>
                            <th>Exhibitor Name</th> */}
                          </tr>
                        </thead>
                        <tbody>

                          {expoVisitors.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center">No visitors found.</td>
                            </tr>
                          ) : (
                            expoVisitors.map((ele, idx) => (
                              <tr key={idx}>
                                <td>{((currentPage - 1) * 10) + idx + 1}</td>
                                <td>{ele.name}</td>
                                {/* <td>N/A</td> */}
                                <td>{ele.number}</td>
                                <td>{ele.email}</td>
                                <td>{ele.joined_at}</td>
                                {/*  <td>
                                <span className='icons_list'>
                                    <Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload />
                                    </Button>
                                    <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp />
                                    </Button>
                                    <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote />
                                    </Button>
                                    <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill />
                                    </Button>
                                  </span> 
                                </td>
                                {/* <td>
                                  {ele.stallId ? (
                                    <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span>
                                  ) : (
                                    "N/A"
                                  )}
                                </td> */}
                              </tr>
                            )))
                          }
                        </tbody>
                      </table>

                      {expoVisitors.length > 0 && (

                        <Pagenation
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalPages={totalPages}
                        />)}
                    </div>
                  </div>
                </div>

                {/* <div className="card mt-4">
                  <div className="card-header">
                    <h3 className="card-title">No of Visitors</h3>
                    <h3 className="card-title">Day 2</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Visitor Name</th>
                            <th>Source Name</th>
                            <th>Mobile Number</th>
                            <th>Email Id</th>
                            <th>Time Spent</th>
                            <th>Activity</th>
                            <th>Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                            <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/*-------- Broucher-popup starts-------- */}


        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          </Modal.Header>
          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Ebroucher</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Ebroucher</th>
                            <th>Project Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Maa Srinivasan</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>


        {/*-------- Whatsapp-popup starts-------- */}

        <Modal show={WhatsappShow} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Whatsup Calls</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Executive</th>
                            <th>Name</th>
                            <th>Contacted Time</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>WE1</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/*-------- Enquiry-popup starts-------- */}


        <Modal show={EnquiryShow} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Enqiry
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Project Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Maa Srinivasan</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>


        {/*-------- drop-popup starts-------- */}

        <Modal show={DropMessageShow} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header justify-content-center">
                    <h3 className="card-title">Drop Message</h3>
                  </div>
                  <div className="card-body">
                    <div className='drop_text w-50 m-auto text-justify'>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien neque, euismod suscipit eleifend quis, mollis in ante. Donec imperdiet risus quis lorem lobortis, vel euismod justo dictum. Vestibulum congue mattis interdum. Praesent sit amet diam a velit consequat commodo quis placerat eros.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>



        {/*-------- Comment-popup starts-------- */}


        <Modal show={CommentShow} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header justify-content-center">
                    <h3 className="card-title">Comment Message</h3>
                  </div>
                  <div className="card-body">
                    <div className='drop_text w-50 m-auto text-justify'>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien neque, euismod suscipit eleifend quis, mollis in ante. Donec imperdiet risus quis lorem lobortis, vel euismod justo dictum. Vestibulum congue mattis interdum. Praesent sit amet diam a velit consequat commodo quis placerat eros.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default NoofVisitors