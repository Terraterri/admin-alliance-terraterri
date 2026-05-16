import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { expoAdminClient } from '../../utils/httpClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagenation from '../../utils/Pagenation';

const ConnectForm = () => {
  const [expos, setExpos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchResponse = async () => {
    try {
      setLoader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      };

      const res = await expoAdminClient.get(
        `connectForm/get.php?limit=${itemsPerPage}&skip=${(currentPage - 1)}`,
        config
      );
      if (res?.data?.status) {
        setExpos(res.data.data || []);
        setFilteredData(res.data.data || []);
        setTotalPages(Math.ceil(res.data.count / itemsPerPage));
      } else {
        toast.error('Failed to load data');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchResponse();
  }, [currentPage]);

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

  const deleteType = async (id) => {
    try {
      setLoader(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      };

      const res = await expoAdminClient.post(`connectForm/delete.php?id=${id}`, {}, config);

      if (res?.data?.status) {
        toast.success(res?.data?.message || 'Deleted successfully');
        fetchResponse();
      } else {
        toast.error(res?.data?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Something went wrong while deleting.');
    } finally {
      setLoader(false);
    }
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
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Connect With Us</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header row m-0">
                      <div className="col-md-4">
                        <h3 className="card-title">Connect With Us</h3>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-0 d-flex align-items-center ">
                          {/* <select className="form-select ml-2 p-0 ps-1" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
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
                          </select> */}

                          <select className="form-select ml-2 p-0 ps-1" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select Source</option>
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
                              <th>Source</th>
                              <th>Name</th>
                              <th>Number</th>
                              <th>Email</th>
                              <th>Country</th>
                              <th>City</th>
                              {/* <th>Message</th>
                              <th>Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              filteredData.map((data, index) => (
                                <tr key={data?.id || index}>
                                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                  <td>{data?.solution_type}</td>
                                  <td>{data?.name}</td>
                                  <td>{data?.number}</td>
                                  <td>{data?.email}</td>
                                  <td>{data?.country}</td>
                                  <td>{data?.city}</td>
                                  {/* <td>{data?.message}</td>
                                  <td>
                                    <i
                                      className="fa fa-trash"
                                      style={{ cursor: 'pointer', color: 'red' }}
                                      onClick={() => deleteType(data?.id)}
                                    ></i>
                                  </td> */}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="text-center mt-3">No responses found.</td>
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
        </div>
      )}
    </>
  );
};

export default ConnectForm;
