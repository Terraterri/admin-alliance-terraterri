import React, { useState, useEffect } from 'react';
// import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import { expoClient, masterClient } from '../../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
import { getCities, getCountries } from '../../../utils/HOC';
import Loader from '../../../components/Loader';
import { expoAdminClient } from '../../../utils/httpClient';

const CityMaster = () => {
  const [formErr, setFormErr] = useState({});
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countrys, setCountry] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({});
  const [loader, setloader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  
  useEffect(() => {
    getCountry();
    getCitiesData();
  }, []);

  const getCountry = async () => {
    try {
      const res = await getCountries();
      setCountry(res);
    } catch (error) {}
  };

  const getCitiesData = async () => {
    setLoading(true);
    try {
      const res = await getCities();
      setCities(res?.data);
    } catch (error) {}
    setLoading(false);
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
    setFormErr(allErr);
    return error;
  };

  const createCityMaster = async () => {
    if (validate()) {
      try {
        let res = null;
        setloader(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
          }
        };
        if (update) {
          res = await expoAdminClient.post(`cityMaster/update.php`, form, config);
        } else {
          res = await expoAdminClient.post(`cityMaster/create.php`, form, config);
        }
        if (res?.data?.status) {
          setShow(false);
          getCitiesData();
          toastSuccess(res?.data?.message);
          setForm({});
          setFormErr({});
          setUpdate(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setloader(false);
      }
    } else {
      toastError('pls check the mandatory fields');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const edit = async (data) => {
    setForm({
      ...form,
      country: data?.country,
      city: data?.city,
      expoCityId: data?.expoCityId
    });
    setUpdate(true);
    setShow(true);
  };

  const deleteType = async (expoCityId) => {
    try {
      //  setloader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const res = await expoAdminClient.put(
        `cityMaster/delete.php?expoCityId=${expoCityId}`,
        config
      );
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        getCitiesData();
      }
    } catch (e) {
      console.log(e);
    } finally {
      // setloader(false);
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

  return (
    <>
      {console.log(form, 'form')}
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
                        <li className="breadcrumb-item active">City Master</li>
                      </ol>
                    </div>
                    <div className="page-title-right">
                      <button className="btn btn-info" onClick={() => setShow(true)}>
                        Add City
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">All City </h3>
                      <div className="mb-0">
                        <input type="text" class="form-control" placeholder="Search City..." />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Country Name</th>
                              <th>City Name</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cities.map((each, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{each.country}</td>
                                <td>{each.city}</td>
                                <td>
                                  {' '}
                                  <td>
                                    <i className="fas fa-edit" onClick={() => edit(each)}></i>
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-trash"
                                      onClick={() => deleteType(each?.expoCityId)}></i>
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
                      <h3 className="card-title">Add City</h3>
                    </div>
                    <div className="card-body">
                      <form className="custom-validation">
                        <div className="mb-3">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="country"
                              required
                              onChange={handleChange}
                              value={form.country || ''}>
                              <option value="default">Select Country</option>
                              {countrys?.data?.length ? (
                                countrys?.data?.map((country, index) => (
                                  <option key={index} value={country.country} selected={country.country == form?.country}>
                                    {country.country}
                                  </option>
                                ))
                              ) : (
                                <option value={null}>{'Select Country'}</option>
                              )}
                            </select>
                            {formErr.country && <p className="err">{formErr.country}</p>}
                          </div>
                          <div className="form-floating">
                            {/* <select
                              className="form-select"
                              name="city"
                              required
                              onChange={handleChange}
                              value={form.city || ''}>
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
                            </select> */}
                            <div className="mb-3">
                              <div className="form-floating">
                                <input
                                  className="form-control"
                                  name="city"
                                  required
                                  onChange={handleChange}
                                  value={form.city || ''}
                                />
                                {formErr.city && <p className="err">{formErr.city}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={createCityMaster}>
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

export default CityMaster;
