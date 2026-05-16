import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError } from '../../../utils/toast';
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Pagenation from '../../../utils/Pagenation';

function name() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({});
  const [formErr, setFormErr] = useState({});
  const [types, setTypes] = useState([]);
  const [update, setUpdate] = useState(false);
  
  // Pagination state
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const validate = () => {
    let error = true;
    let allErr = {};

    if (!form.code) {
      error = false;
      allErr.code = 'Type code is mandatory';
    }

    if (!form.name) {
      error = false;
      allErr.name = 'Expo type is mandatory';
    }
    
    setFormErr(allErr);
    return error;
  };

  const submitExpoType = async () => {
    if (validate()) {
      try {
        let res = null;
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
          }
        };
        
        if (update) {
          res = await expoAdminClient.put(`expoTypes/update.php`, form, config);
        } else {
          res = await expoAdminClient.post(`expoTypes/create.php`, form, config);
        }
        
        if (res?.data?.status) {
          setShow(false);
          fetchExpoTypes();
          toastSuccess(res?.data?.message);
          setForm({});
          setFormErr({});
          setUpdate(false);
        }
      } catch (e) {
        toastError('Failed to save expo type');
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Please check the mandatory fields');
    }
  };

  const editType = (data) => {
    setForm({
      code: data?.code,
      name: data?.name,
      newTypeId: data?.newTypeId
    });
    setUpdate(true);
    setShow(true);
  };

  const fetchExpoTypes = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      
      const url = `expoTypes/get.php?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}&search=${searchTerm}`;
      const res = await expoAdminClient.get(url, config);
      
      if (res?.data?.status) {
        setTypes(res.data.data || []);
        setTotalPages(Math.ceil(res.data.count / itemsPerPage));
      }
    } catch (err) {
      toastError('Failed to fetch expo types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (newTypeId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      
      const res = await expoAdminClient.put(`expoTypes/delete.php?newTypeId=${newTypeId}`, {}, config);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        fetchExpoTypes();
      }
    } catch (e) {
      toastError('Failed to delete expo type');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpoTypes();
  }, [currentPage, searchTerm]);

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
                      <li className="breadcrumb-item active">Expo Types</li>
                    </ol>
                  </div>
                  <div className="page-title-right">
                    <button className="btn btn-info" onClick={() => setShow(true)}>
                      Add Expo Type
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Expo Types</h3>
                    <div className="mb-0 srch-cls">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Type Code or Name"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <IoSearch />
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Type Code</th>
                            <th>Type Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {types.length > 0 ? (
                            types.map((type, index) => (
                              <tr key={index}>
                                <td className="align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="align-middle">{type.code}</td>
                                <td className="align-middle">{type.name}</td>
                                <td className="table-icons">
                                  <div className="d-flex icons">
                                    <MdDelete 
                                      className='delete-ic' 
                                      onClick={() => deleteType(type.newTypeId)} 
                                    />
                                    <FaRegEdit 
                                      onClick={() => editType(type)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">No expo types found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <Pagenation
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalPages={totalPages}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit Expo Type Offcanvas */}
            <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{update ? 'Edit' : 'Add'} Expo Type</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className="card">
                  <div className="card-body">
                    <form className="custom-validation">
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${formErr.code ? 'is-invalid' : ''}`}
                            name="code"
                            placeholder="Type Code"
                            onChange={onChange}
                            value={form?.code || ''}
                          />
                          <label htmlFor="project-type" className="fw-normal">
                            Type Code
                          </label>
                          {formErr.code && <div className="invalid-feedback">{formErr.code}</div>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${formErr.name ? 'is-invalid' : ''}`}
                            name="name"
                            onChange={onChange}
                            value={form?.name || ''}
                            placeholder="Type Name"
                          />
                          <label htmlFor="project-type" className="fw-normal">
                            Expo Type Name
                          </label>
                          {formErr.name && <div className="invalid-feedback">{formErr.name}</div>}
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={submitExpoType}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Save'}
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
    </>
  );
}

export default name;