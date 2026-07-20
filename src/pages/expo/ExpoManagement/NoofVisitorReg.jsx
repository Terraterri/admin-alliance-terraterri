
import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useParams } from 'react-router-dom';
import { MdWhatsapp } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { FaFileDownload } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
import { expoAdminClient } from '../../../utils/httpClient';
import moment from 'moment';
import Pagenation from '../../../utils/Pagenation';
const NoofVisitorReg = () => {
  const [show, setShow] = useState(false);
  const [WhatsappShow, setWhatsappShow] = useState(false);
  const [EnquiryShow, setEnquiryShow] = useState(false);
  const [CommentShow, setCommentShow] = useState(false);
  const [DropMessageShow, setDropMessageShow] = useState(false);
  const handleClose = () => { setShow(false); setWhatsappShow(false); setEnquiryShow(false); setCommentShow(false); setDropMessageShow(false); }
  const handleShow = () => setShow(true);
  const handleWhatsapp = () => setWhatsappShow(true);
  const [loading, setLoading] = useState(true);
  const [expoData, setExpoData] = useState([]);
  const { expoUnqCode } = useParams();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tabType, setTabType] = useState("Registerd")


  const fetchExpoData = async (url) => {
    setLoading(true);
    console.log(localStorage.getItem("adminToken"))
    console.log(localStorage.getItem("expoCode"))
    try {
      const res = await expoAdminClient.get(
        `${url}?expoCode=${localStorage.getItem("expoCode")}&limit=${itemsPerPage}&skip=${currentPage - 1}`,
        {
          headers: {
            "authorization": localStorage.getItem("adminToken")
          }
        }
      );

      if (res?.data?.status) {
        setExpoData(res.data.data || []);
        setTotalPages(Math.ceil(res.data.count / itemsPerPage))
      } else {
        setExpoData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Failed to fetch visitor registrations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    let URL = `newExpoUsers/getExpoUsers.php`
    if (tabType === 'NonVerified') URL = `newExpoUsers/getNonVerifiedUsers.php`;
    if (tabType === 'verified') URL = `newExpoUsers/getVerifiedUsers.php`;

    await fetchExpoData(URL)
  }

  useEffect(() => {
    fetchUsersData();
  }, [currentPage, tabType]);


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
                      <li className="breadcrumb-item active">No Of Visitor Registrations</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>



            <div className='mb-3'>
              <ul class="nav justify-content-center">
                <li class="nav-item mx-2" onClick={() => setTabType("Registerd")}>
                  <a class="nav-link active" aria-current="page" href="#">Registerd</a>
                </li>
                <li class="nav-item mx-2" onClick={() => setTabType("verified")}>
                  <a class="nav-link active">Verified</a>
                </li>
                <li class="nav-item mx-2" onClick={() => setTabType("NonVerified")}>
                  <a class="nav-link active">Non - Verified</a>
                </li>
              </ul>
            </div>

            {tabType === 'Registerd' &&
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <form className="custom-validation mb-3 cutom_date" action="#">
                    <div className="row align-items-center">
                      <div className="col-md-3 mt-3">
                        <div className="">
                          <div className="form-floating"><input type="date" id="from-date" className="form-control" name="fromdate" /><label
                            for="from-date" className="fw-normal">From Date</label></div>
                        </div>
                      </div>
                      <div className="col-md-3 mt-3">
                        <div className="">
                          <div className="form-floating"><input type="date" id="to-date" className="form-control" name="todate" /><label
                            for="to-date" className="fw-normal">To Date</label></div>
                        </div>
                      </div>
                      <div className="col-md-1 mt-3"><button className="btn btn-primary" type="submit">Search</button></div>
                    </div>
                  </form>


                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">No Of Visitor Registrations</h3>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Name</th>
                              <th>Country</th>
                              <th>City</th>
                              <th>Number</th>
                              <th>Email</th>
                              <th>Property</th>
                              <th>Budget</th>
                              <th>Location</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expoData.length > 0 ?
                              expoData?.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{data?.name}</td>
                                  <td>{data?.country}</td>
                                  <td>{data?.city}</td>
                                  <td>{data?.number}</td>
                                  <td>{data?.email}</td>
                                  <td>{data?.property}</td>
                                  <td>{data?.budget}</td>
                                  <td>{data?.location}</td>
                                  <td className="table-icons">
                                    <div className="d-flex icons justify-content-center">
                                      <MdDelete className='delete-ic' />
                                    </div>
                                  </td>
                                </tr>
                              ))
                              :
                              <tr>
                                <td colSpan={10} className='text-center'><h5>No Users Found</h5></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <Pagenation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {tabType === 'verified' &&
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">No Of Visitor Registrations</h3>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Name</th>
                              <th>Number</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expoData.length > 0 ?
                              expoData?.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{data?.customer_name}</td>
                                  <td>{data?.phoneNumber}</td>
                                  <td className="table-icons">
                                    <div className="d-flex icons justify-content-center">
                                      <MdDelete className='delete-ic' />
                                    </div>
                                  </td>
                                </tr>
                              ))
                              :
                              <tr>
                                <td colSpan={10} className='text-center'><h5>No Users Found</h5></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <Pagenation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {tabType === 'NonVerified' &&
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">No Of Visitor Registrations</h3>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Name</th>
                              <th>Number</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expoData.length > 0 ?
                              expoData?.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{data?.customer_name}</td>
                                  <td>{data?.phoneNumber}</td>
                                  <td className="table-icons">
                                    <div className="d-flex icons justify-content-center">
                                      <MdDelete className='delete-ic' />
                                    </div>
                                  </td>
                                </tr>
                              ))
                              :
                              <tr>
                                <td colSpan={10} className='text-center'><h5>No Users Found</h5></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <Pagenation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }



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
          <Modal.Header closeButton>

          </Modal.Header>

          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Whatsup Calls

                    </h3>

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
          <Modal.Header closeButton>

          </Modal.Header>

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
          <Modal.Header closeButton>

          </Modal.Header>

          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header justify-content-center">
                    <h3 className="card-title">Drop Message

                    </h3>

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
          <Modal.Header closeButton>

          </Modal.Header>

          <div className='popup'>
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header justify-content-center">
                    <h3 className="card-title">Comment Message

                    </h3>

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

export default NoofVisitorReg