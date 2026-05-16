import React, { useState, useEffect } from 'react';
// import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import { expoClient, masterClient } from '../../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
//import {useApiMethods} from "../../../utils/useApiMethods"
import { getCountries } from '../../../utils/HOC';
import { expoAdminClient } from '../../../utils/httpClient';
import Loader from '../../../components/Loader';

const CountryMaster = () => {
  // const [loading, setloader] = useState(false);
  const [formErr, setFormErr] = useState({});
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getCountriesData();
  }, []);
  const getCountriesData = async () => {
    try {
      setLoading(true);
      const res = await getCountries();
      setCountries(res?.data);
    } catch (error) {}
    setLoading(false);
  };

  const edit = async (data) => {
    setForm({
      ...form,
      country: data?.country,
      newCountryId: data?.newCountryId
    });
    setUpdate(true);
    setShow(true);
  };

  const deleteCountry = async (newCountryId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      let res =  await expoAdminClient.post(`countryMaster/delete.php?newCountryId=${newCountryId}`, form, config);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        await getCountriesData();
      } else {
        toastError(res?.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  const validate = () => {
    let error = true;
    let allErr = {};
    if (!form.country) {
      error = false;
      allErr.country = 'Country is madatory';
    }
    setFormErr(allErr);
    return error;
  };
  const createCountyMaster = async () => {
    if (validate()) {
    try {
      setLoading(true);
      let res = null;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      if (update) {
        res = await expoAdminClient.post(`countryMaster/update.php`, form,config);
      } else {
        res = await expoAdminClient.post(`countryMaster/create.php`, form, config);
      }
      if (res?.data?.status) {
        setShow(false);
        toastSuccess(res?.data?.message);
        setForm({});
        setFormErr({});
        setUpdate(false);
        await getCountriesData();
      } else {
        toastError(res?.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }else {
    toastError('pls check the mandatory fields');
  }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      {loading && (
        <>
          <Loader />
        </>
      )}
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
                        <li className="breadcrumb-item active">Country Master</li>
                      </ol>
                    </div>
                    <div className="page-title-right">
                      <button className="btn btn-info" onClick={() => setShow(true)}>
                        Add Country
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Country Master </h3>
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
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {countries.map((each, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{each.country}</td>
                                <td>
                                  {' '}
                                  <td>
                                    <i className="fas fa-edit" onClick={() => edit(each)}></i>
                                  </td>
                                  <td>
                                    <i className="fa fa-trash" onClick={() => {deleteCountry(each.newCountryId)}}></i>
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
                      <h3 className="card-title">Add Country</h3>
                    </div>
                    <div className="card-body">
                      <form className="custom-validation">
                        <div className="mb-3">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              name="country"
                              required
                              onChange={handleChange}
                              value={form.country || ''}
                            />
                             {formErr.country && <p className="err">{formErr.country}</p>}
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={createCountyMaster}>
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

export default CountryMaster;
