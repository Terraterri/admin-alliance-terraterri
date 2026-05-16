import React, { useState, useEffect, useRef } from 'react';
import Loader from '../../components/Loader';
import { expoAdminClient } from '../../utils/httpClient';
import { toastError } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setExpo, clearExpo } from '../../store/slices/ExpoSlice';
import { useParams } from 'react-router-dom';

const Expo = ({ validateStep, title }) => {
  const { expoUnqCode } = useParams();
  const dispatchFormData = useDispatch();
  const formState = useSelector((state) => state.expo);
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [expoCode, setExpoCode] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hostCities, setHostCities] = useState([])
  const [formData, setFormData] = useState({});
  const [expoType, setExpoType] = useState([]);
  const [formErr, setFormErr] = useState({});
  const [expos, setExpos] = useState([]);
  const [selExpoType, setSelExpoType] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const monthName = monthNames[month];
    const year = date.getFullYear();
    return `${year}${monthName.slice(0, 3)}${day}`;
  };

  useEffect(() => {
    getCountries();
    getTypes();
    if (formState['expo'].expoCountry) getCities(formState['expo'].expoCountry);
    if (formState['expo'].expoCountry) getIntCities(formState['expo'].expoCountry);

  }, [formData]);

  useEffect(() => {
    if (!expoUnqCode) {
      dispatchFormData(clearExpo());
      return;
    }
    if (formState['expo'].expoCountry) getCities(formState['expo'].expoCountry);
    if (formState['expo'].expoCountry) getIntCities(formState['expo'].expoCountry);

  }, [expoUnqCode]);


  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     dispatchFormData(setExpo({ companyLogo: file.name }));
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   const fileUrl = URL.createObjectURL(file);
  //   setImagePreview(URL.createObjectURL(file));
  //   dispatch(setExpo({ companyLogo: fileUrl }));
  // };

  const getCountries = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const response = await expoAdminClient.get('/countryMaster/get.php', config);
      if (response?.data?.status) {
        setAllCountries(response?.data?.data);
        setAllCountries(response?.data?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getCities = async (countryCode) => {
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
      if (response?.data?.status) {
        setCities(response?.data?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getIntCities = async (countryCode) => {
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
      if (response?.data?.status) {
        setHostCities(response?.data?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypes = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const response = await expoAdminClient.get(`expoTypes/get.php`, config);
      if (response?.data?.status) {
        setExpoType(response?.data?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    dispatchFormData(setExpo({ [name]: value }));
    if (name === 'expoCountry') {
      getCities(value);
    }
    if (name === 'intCountry') {
      getIntCities(value);
    }
    if (name === 'toDate') {
      setDateValue(value);
    }
    if (name === 'expoType') {
      setSelExpoType(value);

      let expoCode = 'TT' +
        formState['expo'].expoCountry.slice(0, 2) +
        formState['expo'].expoCity.slice(0, 3) +
        formatDate(new Date(formState['expo'].toDate || dateValue)).toUpperCase() +
        '-' +
        value.slice(0, 1).toUpperCase();

      // Add international country and city codes if 'expoType' is 'International'
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input field
      }
      dispatchFormData(setExpo({ expoUnqCode: expoCode }));
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  const validate = () => {
    let isvalid = true;
    let errors = {};

    if (!formState['expo'].country_code) {
      isvalid = false;
      errors.country_code = 'Country is mandatory field'

    }

    if (!formState['expo'].state_code) {
      isvalid = false;
      errors.state_code = 'state is mandatory field'

    }
    if (!formState['expo'].city_code) {
      isvalid = false;
      errors.city_code = 'City is mandatory field'

    }
    if (!formState['expo'].start_date) {
      isvalid = false;
      errors.start_date = 'From date is mandatory field'

    }
    if (!formState['expo'].end_date) {
      isvalid = false;
      errors.end_date = 'End date is mandatory field'

    }
    if (!formState['expo'].type) {
      isvalid = false;
      errors.type = 'Expo type is mandatory field'

    }
    setFormErr(errors);

    return isvalid
  }


  return (
    <>
      {loading && <Loader />}
      <form>
        <h6 className="createHead mb-4">Create Expo : </h6>
        <h3 className='subti'>"In which country or city would you like to conduct the expo?"</h3>
        <div className="row">
          <div className="col-md-4">
            <label className="BuildName">Country</label>
            <select
              className="form-select"
              name="expoCountry"
              required
              onChange={handleChange}
              value={formState['expo'].expoCountry || ''}>
              <option value="default">Select Country</option>
              {allCountries?.length ? (
                allCountries?.map((country, index) => (
                  <option key={index} value={country.country}>
                    {country.country}
                  </option>
                ))
              ) : (
                <option value={null}>{'Select country'}</option>
              )}
            </select>
            {formErr.expoCountry && <p className="err">{formErr.expoCountry}</p>}
          </div>

          <div className="col-md-4">
            <label className="BuildName">City</label>
            <select
              className="form-select"
              name="expoCity"
              required
              onChange={handleChange}
              value={formState['expo'].expoCity || ''}>
              <option value="default">Select City</option>
              {cities?.map((city, index) => (
                <option key={index} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
            {formErr.expoCity && <p className="err">{formErr.expoCity}</p>}
          </div>
        </div>

        <div className="row fromTo">
          <div className="col-md-4">
            <label className="BuildName">From Date</label>
            <input
              type="date"
              name="fromDate"
              className="form-control"
              onChange={handleChange}
              min={minDate}
              value={formState['expo'].fromDate || ''}
            />
            {formErr.fromDate && <p className="err">{formErr.fromDate}</p>}
          </div>

          <div className="col-md-4">
            <label className="BuildName mt-1">To Date</label>
            <input
              type="date"
              onChange={handleChange}
              name="toDate"
              className="form-control"
              min={minDate}
              value={formState['expo'].toDate || ''}
            />
            {formErr.toDate && <p className="err">{formErr.toDate}</p>}
          </div>

          <div className="col-md-4">
            <label className="BuildName">Expo Type</label>
            <select
              className="form-select"
              aria-placeholder="Select Expo Type"
              name="expoType"
              onChange={handleChange}
              value={formState['expo'].expoType || ''}>
              <option value="">select</option>
              {expoType?.map((types, index) => (
                <option key={index} value={types?.name}>
                  {types?.name}
                </option>
              ))}
            </select>
            {formErr.type && <p className="err">{formErr.type}</p>}
          </div>


          {selExpoType === 'International' &&
            <div className="col-md-7 mt-5">
              <div className="row mb-3">
                <h3 className='subti'>"Which country / city's properties would you like to exhibit?"<span>(uest)</span></h3>
                <div className="col-md-6">
                  <label className="BuildName pt-0">Country</label>
                  <select
                    className="form-select"
                    name="intCountry"
                    required
                    onChange={handleChange}
                    value={formState['expo'].intCountry || ''}>
                    <option value="default">Select Country</option>
                    {allCountries?.length ? (
                      allCountries?.map((country, index) => (
                        <option key={index} value={country.country} selected={country.country == formState?.country}>
                          {country.country}
                        </option>
                      ))
                    ) : (
                      <option value={null}>{'Select country'}</option>
                    )}
                  </select>
                  {formErr.intCountry && <p className="err">{formErr.intCountry}</p>}
                </div>

                <div className="col-md-6">
                  <label className="BuildName pt-0">City</label>
                  <select
                    className="form-select"
                    name="intCity"
                    required
                    onChange={handleChange}
                    value={formState['expo'].intCity || ''}>
                    <option value="default">Select City</option>
                    {hostCities?.map((city, index) => (
                      <option key={index} value={city.city}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                  {formErr.intCity && <p className="err">{formErr.intCity}</p>}
                </div>

              </div>
            </div>
          }
        </div>

        <div className="row">
          <div className="BuildName col-md-6 mt-4 mb-5 mr-10 d-flex">
            <div className="mr-10">
              <label>Expo Code/Id :</label>
            </div>
            <div>
              <p className="expoUnqCode">{formState['expo'].expoUnqCode || ''}</p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Expo;
