import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getCountries, getCities, getExpoType } from '../../../utils/HOC';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
import classNames from 'classnames';
import Pagenation from '../../../utils/Pagenation';

const CreatePackage = () => {
  const [show, setShow] = useState(false);
  const [countrys, setCountry] = useState([]);
  const [cities, setCities] = useState([]);
  const [expoTypes, setExpoType] = useState([]);
  const [form, setForm] = useState({});
  const [packages, setPackages] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loader, setloader] = useState(true);
  const [formErr, setFormErr] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expos, setExpos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const stallTypeList = [
    { label: "Standard", value: "Standard" },
    { label: "Diamond", value: "Diamond" },
    { label: "Gold", value: "Gold" },
    { label: "Platinum", value: "Platinum" }
  ];

  useEffect(() => {
    allPackages();
    getCountry();
    getExpoTypeData();
  }, []);

  useEffect(() => {
    allPackages();
  }, [currentPage]);

  const getDynamicClass = (expoType) => {
    const classMap = {
      Residential: 'Residential',
      Commercial: 'Commercial',
      Banking: 'Banking',
      International: 'International',
      Interior: 'Interior',
    };
    return classMap[expoType] || 'default-class';
  };

  const allPackages = async () => {
    try {
      setloader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.get(`packages/get.php?limit=${itemsPerPage}&skip=${(currentPage - 1)}`, config);
      
      if (res?.data?.status) {
        setExpos(res?.data.data);
        setPackages(res?.data?.data);
        setFilteredData(res.data.data || []);
        setTotalPages(Math.ceil(res?.data?.count / itemsPerPage));
      }
    } catch (err) {
      toastError('something error');
    } finally {
      setloader(false);
    }
  };

  const getCountry = async () => {
    try {
      const res = await getCountries();
      setCountry(res);
    } catch (error) { }
  };

  const getCitiesData = async (country) => {
    try {
      const res = await getCities(country);
      setCities(res);
    } catch (error) { }
  };

  const getExpoTypeData = async () => {
    try {
      const res = await getExpoType();
      setExpoType(res);
    } catch (error) { }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'country') {
      getCitiesData(e.target.value);
    }
  };

  const validate = () => {
    let error = true;
    let allErr = {};

    if (!form.country) {
      error = false;
      allErr.country = 'Country is madatory';
    }
    if (!form.city) {
      error = false;
      allErr.city = 'City is madatory';
    }
    if (!form.expoType) {
      error = false;
      allErr.expoType = 'Expo Type is madatory';
    }
    if (!form.stallType) {
      error = false;
      allErr.stallType = 'Stall Type is madatory';
    }
    if (!form.amount) {
      error = false;
      allErr.amount = 'Amount is madatory';
    }
    setFormErr(allErr);
    return error;
  };

  const createExpoPackage = async () => {
    if (validate()) {
      try {
        let res;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
          }
        };
        if (update) {
          let payload = {
            name: form.expoType,
            newPckId: form.newPckId,
            code: form.expoType
          }
          res = await expoAdminClient.post(`packages/update.php`, form, config);
        } else {
          res = await expoAdminClient.post(`packages/create.php`, form, config);
        }
        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          setShow(false);
          setForm({});
          setFormErr({});
          setUpdate(false);
          allPackages();
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      toastError('pls check the mandatory fields');
    }
  };

  const edit = async (data) => {
    if (data?.country) {
      getCitiesData(data.country);
    }
    setForm({
      ...form,
      country: data?.country,
      city: data?.city,
      expoType: data?.expoType,
      stallType: data?.stallType,
      amount: data?.amount,
      newPckId: data?.newPckId,
    });
    setUpdate(true);
    setShow(true);
  };

  const deleteType = async (newPckId) => {
    try {
      setloader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.put(`packages/delete.php?newPckId=${newPckId}`, config);
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

  const handleExploreClick = () => {
    let filtered = [...expos];

    if (selectedCountry) {
      filtered = filtered.filter((expo) => expo.country === selectedCountry);
    }

    if (selectedCity) {
      filtered = filtered.filter((expo) => expo.city === selectedCity);
    }

    if (selectedType) {
      filtered = filtered.filter((expo) => expo.solution_type === selectedType);
    }

    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page on new filter
  };

  // const displayData = filteredData.length > 0 ? filteredData : packages;

  return (
    <>
      {loader && <Loader />}
      {!loader && (
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
                        <li className="breadcrumb-item active">Create Package</li>
                      </ol>
                    </div>
                    <div className="page-title-right">
                      <button className="btn btn-info" onClick={() => { setShow(true); setForm({}); setUpdate(false); setFormErr({}); }}>
                        Create Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header row m-0">
                      <div className="col-md-4">
                        <h3 className="card-title">Create Package</h3>
                      </div>
                      <div className="col-md-8">
                        <div className="mb-0 d-flex align-items-center ">
                          <select className="form-select ml-2 p-0 ps-1" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                            <option value="">Select Country</option>
                            {[...new Set(expos.map((expo) => expo.country))].map((country, index) => (
                              <option key={index} value={country}>{country}</option>
                            ))}
                          </select>

                          <select className="form-select ml-2 p-0 ps-1" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="">Select City</option>
                            {[...new Set(
                              expos.filter((expo) => expo.country === selectedCountry).map((expo) => expo.city)
                            )].map((city, index) => (
                              <option key={index} value={city}>{city}</option>
                            ))}
                          </select>

                          <select className="form-select ml-2 p-0 ps-1" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select Solution Type</option>
                            {[...new Set(expos.map((expo) => expo.solution_type))].map((type, index) => (
                              <option key={index} value={type}>{type}</option>
                            ))}
                          </select>

                          <button onClick={handleExploreClick} className="btn btn-primary ml-2 p-0 ps-1 pe-2">Search</button>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Expo Type</th>
                              <th>Stall Type</th>
                              <th>City</th>
                              <th>Country</th>
                              <th>Amount</th>
                              <th>Edit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              filteredData.map((item, index) => (
                                <tr className={getDynamicClass(item.expoType)} key={item.newPckId || index}>
                                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                  <td>{item?.expoType}</td>
                                  <td>{item?.stallType}</td>
                                  <td>{item?.city}</td>
                                  <td>{item?.country}</td>
                                  <td>{item?.amount}</td>
                                  <td>
                                    <i
                                      className="fa fa-edit mr-2"
                                      style={{ cursor: 'pointer', color: 'blue' }}
                                      onClick={() => edit(item)}
                                    ></i>
                                    <i
                                      className="fa fa-trash"
                                      style={{ cursor: 'pointer', color: 'red' }}
                                      onClick={() => deleteType(item?.newPckId)}
                                    ></i>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center mt-3">No packages found.</td>
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

              <Offcanvas show={show} onHide={() => { setShow(false); setForm({}); setUpdate(false); setFormErr({}); }} placement="end">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>{update ? 'Edit' : 'Create'} Package</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">{update ? 'Edit' : 'Create'} Package</h3>
                    </div>
                    <div className="card-body">
                      <form className="custom-validation">
                        <div className="mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="country"
                              required
                              onChange={handleChange}
                              value={form.country || ''}
                            >
                              <option value="default">Select Country</option>
                              {countrys?.data?.length ? (
                                countrys?.data?.map((country, index) => (
                                  <option key={index} value={country.country}>
                                    {country.country}
                                  </option>
                                ))
                              ) : (
                                <option value={null}>{'Select country'}</option>
                              )}
                            </select>
                            {formErr.country && <p className="err">{formErr.country}</p>}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="city"
                              required
                              onChange={handleChange}
                              value={form.city || ''}
                              disabled={!form.country}
                            >
                              <option value="default">Select City</option>
                              {cities?.data?.length ? (
                                cities?.data?.map((citie, index) => (
                                  <option key={index} value={citie.city}>
                                    {citie.city}
                                  </option>
                                ))
                              ) : (
                                <option value={null}>{'Select city'}</option>
                              )}
                            </select>
                            {formErr.city && <p className="err">{formErr.city}</p>}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="expoType"
                              required
                              onChange={handleChange}
                              value={form.expoType || ''}
                            >
                              <option value="default">Expo Type</option>
                              {expoTypes?.data?.length ? (
                                expoTypes?.data?.map((expoType, index) => (
                                  <option key={index} value={expoType.name}>
                                    {expoType.name}
                                  </option>
                                ))
                              ) : (
                                <option value={null}>{'Select Expo Type'}</option>
                              )}
                            </select>
                            {formErr.expoType && <p className="err">{formErr.expoType}</p>}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-floating">
                            <select
                              className='form-select'
                              name="stallType"
                              required
                              onChange={handleChange}
                              value={form.stallType || ''}
                            >
                              <option value="default">Stall Type</option>
                              {stallTypeList.length ? stallTypeList?.map((stallType, index) => (
                                <option key={index} value={stallType.value}>{stallType.value}</option>
                              )) : <option value={null}>{"Select Stall Type"}</option>}
                            </select>
                            {formErr.stallType && <p className="err">{formErr.stallType}</p>}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              name="amount"
                              placeholder="Amount"
                              onChange={handleChange}
                              value={form?.amount || ''}
                            />
                            <label htmlFor="amount" className="fw-normal">
                              Amount
                            </label>
                          </div>
                          {formErr.amount && <p className="err">{formErr.amount}</p>}
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={createExpoPackage}
                          >
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

export default CreatePackage;