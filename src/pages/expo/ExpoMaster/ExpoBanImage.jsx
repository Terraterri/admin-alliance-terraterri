import React, { useState, useEffect, useRef } from 'react';
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getCountries, getCities, getExpoType } from '../../../utils/HOC';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
import axios from 'axios';
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';
import Pagenation from '../../../utils/Pagenation';

const ExpoBannerImage = () => {
  const [show, setShow] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [countrys, setCountry] = useState([]);
  const [cities, setCities] = useState([]);
  const [hostCities, setHostCities] = useState([]);
  const [expoTypes, setExpoType] = useState([]);
  const [form, setForm] = useState({});
  const [banners, setBanners] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loader, setLoader] = useState(true);
  const [formErr, setFormErr] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selExpoType, setSelExpoType] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExpoType, setSelectedExpoType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);


  const [search, setSearch] = useState('')

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month];
    const year = date.getFullYear();
    const lastTwoDigitsOfYear = year.toString().substr(-2);
    return `${day}${monthName.slice(0, 3)}${lastTwoDigitsOfYear}`;
  };

  useEffect(() => {
    allBanners();
  }, [currentPage, search])


  const allBanners = async () => {
    try {
      setLoader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      };
      const res = await expoAdminClient.get(`expoBannerImage/get.php?${search}limit=${itemsPerPage}&skip=${(currentPage - 1)}`, config);

      if (res?.data?.status) {
        setBanners(res.data.data || []);
        setFilteredData(res.data.data || []);
        setTotalPages(Math.ceil(res.data.count / itemsPerPage));
      }
    } catch (err) {
      toastError('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    allBanners();
    getCountry();
    getExpoTypeData();
  }, []);

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

  const getIntCities = async (countryCode) => {
    if (!countryCode) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const response = await expoAdminClient.get(
        `/cityMaster/get.php/?country=${countryCode}`,
        config
      );
      if (response?.status) {
        setHostCities(response?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message || 'Error loading cities');
    } finally {
      setLoading(false);
    }
  };

  const getExpoTypeData = async () => {
    try {
      const res = await getExpoType();
      setExpoType(res);
    } catch (error) { }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'country') {
      getCitiesData(value);
    }

    if (name === 'guestCountry') {
      getIntCities(value);
    }

    if (name === 'expoType') {
      setSelExpoType(value);
      let expoCode = form.country?.slice(0, 2) + form.city?.slice(0, 3) +
        formatDate(new Date(form.toDate || new Date())).toUpperCase() + '-' +
        value.slice(0, 1).toUpperCase();

      if (value === 'International') {
        expoCode += '-' + value.slice(0, 1).toUpperCase() +
          (form.guestCountry?.slice(0, 2) || '') +
          (form.guestCity?.slice(0, 3) || '');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'filterCountry') {
      setSelectedCountry(value);
      setSelectedCity('');
      setSelectedExpoType('');
    } else if (name === 'filterCity') {
      setSelectedCity(value);
    } else if (name === 'filterExpoType') {
      setSelectedExpoType(value);
    }
  };

  const applyFilters = () => {
    let search = '';

    if (selectedCountry) {
      search += `country=${selectedCountry}&`
    }

    if (selectedCity) {
      search += `city=${selectedCity}&`
    }

    if (selectedExpoType) {
      search += `expoType=${selectedExpoType}&`
    }
    setSearch(search)
  };

  const validate = () => {
    let error = true;
    let allErr = {};

    if (!form.country) {
      error = false;
      allErr.country = 'Country is mandatory';
    }
    if (!form.city) {
      error = false;
      allErr.city = 'City is mandatory';
    }
    if (!form.expoType) {
      error = false;
      allErr.expoType = 'Expo Type is mandatory';
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
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        };

        if (update) {
          let payload = {
            name: form.expoType,
            newPckId: form.newPckId,
            code: form.expoType
          };
          res = await expoAdminClient.post('expoBannerImage/update.php', payload, config);
        } else {
          res = await expoAdminClient.post('expoBannerImage/create.php', form, config);
        }

        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          setShow(false);
          setForm({});
          setFormErr({});
          setUpdate(false);
          allBanners();
        }
      } catch (e) {
        toastError('Error creating package');
      }
    } else {
      toastError('Please check the mandatory fields');
    }
  };

  const handleImage = async (e) => {
    setLoader(true);
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      };
      const res = await expoAdminClient.post('imageConfig/upload_to_gcs.php', formData, config);
      setForm((prev) => ({ ...prev, image: res?.data?.url }));
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setLoader(false);
    }
  };

  const edit = async (data) => {
    setForm({
      ...data,
      country: data?.country,
      city: data?.city,
      expoType: data?.expoType,
      image: data?.bannerImg,
      newPckId: data?.newPckId,
      guestCountry: data?.guestCountry,
      guestCity: data?.guestCity
    });
    
    setUpdate(true);
    setShow(true);
  };

  const deleteType = async (newPckId) => {
    try {
      setLoader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      };
      const res = await expoAdminClient.put(`expoBannerImage/delete.php?newPckId=${newPckId}`, {}, config);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        allBanners();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoader(false);
    }
  };

  const viewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

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
                        <li className="breadcrumb-item active">Expo Banner Images</li>
                      </ol>
                    </div>
                    <div className="page-title-right">
                      <button className="btn btn-info" onClick={() => setShow(true)}>
                        Create Banner Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="row align-items-center w-100">
                        <div className="col-md-4">
                          <h3 className="card-title">Expo Banner Images</h3>
                        </div>
                        <div className="col-md-8">
                          <div className="mb-0 d-flex">
                            <select
                              className="form-select ml-2 p-0 ps-1"
                              name="filterCountry"
                              value={selectedCountry}
                              onChange={handleFilterChange}
                            >
                              <option value="">Select Country</option>
                              {[...new Set(banners.map(pkg => pkg.country))].map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                              ))}
                            </select>

                            <select
                              className="form-select ml-2 p-0 ps-1"
                              name="filterCity"
                              value={selectedCity}
                              onChange={handleFilterChange}
                              disabled={!selectedCountry}
                            >
                              <option value="">Select City</option>
                              {[...new Set(
                                banners
                                  .filter(pkg => selectedCountry ? pkg.country === selectedCountry : true)
                                  .map(pkg => pkg.city)
                              )].map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                              ))}
                            </select>

                            <select
                              className="form-select ml-2 p-0 ps-1"
                              name="filterExpoType"
                              value={selectedExpoType}
                              onChange={handleFilterChange}
                            >
                              <option value="">Select Expo Type</option>
                              {[...new Set(banners.map(pkg => pkg.expoType))].map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                              ))}
                            </select>

                            <button
                              onClick={applyFilters}
                              className="btn btn-primary ml-2 p-0 ps-1 pe-2"
                            >
                              Search
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-md">
                        <table className="table text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Country</th>
                              <th>City</th>
                              <th>Expo Type</th>
                              <th>Guest Country</th>
                              <th>Guest City</th>
                              <th>Image</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              filteredData.map((type, index) => (
                                <tr key={index}>
                                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                  <td>{type?.country}</td>
                                  <td>{type?.city}</td>
                                  <td>{type?.expoType}</td>
                                  <td>{type?.guestCountry || '-'}</td>
                                  <td>{type?.guestCity || '-'}</td>
                                  <td>
                                    <img
                                      src={type?.bannerImg}
                                      alt="Expo Image"
                                      width={100}
                                      height={60}
                                      style={{ objectFit: 'cover', cursor: 'pointer' }}
                                      onClick={() => viewImage(type?.bannerImg)}
                                    />
                                  </td>
                                  <td className="table-icons">
                                    <div className="d-flex icons">
                                      <FaRegEdit
                                        className='edit-ic me-2'
                                        onClick={() => edit(type)}
                                      />
                                      <MdDelete
                                        className='delete-ic'
                                        onClick={() => deleteType(type?.newPckId)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">No banner images found</td>
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

              {/* Image Preview Modal */}
              <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  />
                </Modal.Body>
              </Modal>

              {/* Create/Edit Offcanvas */}
              <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>{update ? 'Edit' : 'Create'} Banner Image</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <div className="card">
                    <div className="card-body">
                      <form className="custom-validation">
                        <div className="mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="country"
                              required
                              onChange={handleChange}
                              value={form.country || ''}>
                              <option value="">Select Country</option>
                              {countrys?.data?.length ? (
                                countrys?.data?.map((country, index) => (
                                  <option key={index} value={country.country}>
                                    {country.country}
                                  </option>
                                ))
                              ) : (
                                <option value="">Loading countries...</option>
                              )}
                            </select>
                            <label>Country</label>
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
                              value={form.city || ''}>
                              <option value="">Select City</option>
                              {cities?.data?.length ? (
                                cities?.data?.map((citie, index) => (
                                  <option key={index} value={citie.city}>
                                    {citie.city}
                                  </option>
                                ))
                              ) : (
                                <option value="">Select country first</option>
                              )}
                            </select>
                            <label>City</label>
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
                              value={form.expoType || ''}>
                              <option value="">Expo Type</option>
                              {expoTypes?.data?.length ? (
                                expoTypes?.data?.map((expoType, index) => (
                                  <option key={index} value={expoType.name}>
                                    {expoType.name}
                                  </option>
                                ))
                              ) : (
                                <option value="">Loading expo types...</option>
                              )}
                            </select>
                            <label>Expo Type</label>
                            {formErr.expoType && <p className="err">{formErr.expoType}</p>}
                          </div>
                        </div>

                        {selExpoType === 'International' && (
                          <div className="row mb-3">
                            <h6 className="addCityL">Add Guest City:</h6>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <select
                                  className="form-select"
                                  name="guestCountry"
                                  required
                                  onChange={handleChange}
                                  value={form.guestCountry || ''}>
                                  <option value="">Select Country</option>
                                  {countrys?.data?.length ? (
                                    countrys?.data?.map((country, index) => (
                                      <option key={index} value={country.country}>
                                        {country.country}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="">Loading countries...</option>
                                  )}
                                </select>
                                <label>Guest Country</label>
                                {formErr.guestCountry && <p className="err">{formErr.guestCountry}</p>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-floating">
                                <select
                                  className="form-select"
                                  name="guestCity"
                                  required
                                  onChange={handleChange}
                                  value={form.guestCity || ''}>
                                  <option value="">Select City</option>
                                  {hostCities?.data?.map((city, index) => (
                                    <option key={index} value={city.city}>
                                      {city.city}
                                    </option>
                                  ))}
                                </select>
                                <label>Guest City</label>
                                {formErr.guestCity && <p className="err">{formErr.guestCity}</p>}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-3">
                          <div className="form-floating">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerimage"
                              onChange={handleImage}
                              id="image"
                              ref={fileInputRef}
                            />
                            <label htmlFor="image">Banner Image</label>
                          </div>
                          {formErr.image && <p className="err">{formErr.image}</p>}
                          {(imagePreview || form.image) && (
                            <div className="mt-3 text-center">
                              <img
                                src={imagePreview || form.image}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="col-12">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={createExpoPackage}>
                            {update ? 'Update' : 'Save'}
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

export default ExpoBannerImage;