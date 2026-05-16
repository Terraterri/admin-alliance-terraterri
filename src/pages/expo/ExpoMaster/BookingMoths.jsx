import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { toastError } from '../../../utils/toast';
import { expoAdminClient } from '../../../utils/httpClient';

const BookingMoths = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [percentages, setPercentages] = useState([]);
  const [loader, setloader] = useState(true);
  const getPercentages = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.get('percentages/get.php',config);
      if (res?.data?.status) {
        console.log(res?.data?.data);
        setPercentages(res?.data?.data);
      }
    } catch (err) {
      toastError('something error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPercentages();
  }, []);

  const deleteType = async (newPckId) => {
    try {
      setloader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.put(`packages/delete.php?newTypeId=${newPckId}`,config);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        allPackages();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setloader(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
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
                        <li className="breadcrumb-item active">Package Tenure</li>
                      </ol>
                    </div>
                    <div className="page-title-right">
                      
                      {/* <button className="btn btn-info" onClick={() => setShow(true)}>
                        Add Discount
                      </button> */}


                      <button className="btn btn-info" onClick={() => setShow(true)}>
                        Add Package Tenure
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Package Tenure</h3>
                      <div className="mb-0">
                        <input type="text" className="form-control" placeholder=" " />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Package Tenure</th>
                              <th>Discount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {percentages.map((each, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{each.months}</td>
                                <td>{each.percentage}</td>
                                <td>
                                  {' '}
                                  <td>
                                    <i className="fas fa-edit" onClick={() => edit(each)}></i>
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-trash"
                                      onClick={() => deleteType(each?.percentageId)}></i>
                                  </td>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Add Tenure</h3>
                    </div>
                    <div className="card-body">
                      <form className="custom-validation">
                        <div className="mb-3">
                          <div className="form-floating">
                            <select className="form-select">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                              <option>6</option>
                              <option>7</option>
                              <option>8</option>
                              <option>9</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary" type="button">
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingMoths;
