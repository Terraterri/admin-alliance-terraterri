import React, { useEffect, useState } from 'react';
// import { SiCountingworkspro } from 'react-icons/si';
// import { AiOutlineSchedule } from 'react-icons/ai';
// import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
// import { GoPeople } from 'react-icons/go';
// import { LuMapPin } from 'react-icons/lu';
// import { LiaSearchLocationSolid } from 'react-icons/lia';
// import { IoPersonCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { expoAdminClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
const ExpoDashboard = () => {
  const [allCount, setAllCount] = useState();
  const [loading, setLoading] = useState(true);

  const getAllCounts = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      const response = await expoAdminClient.get('/dashboard/getAllinfo.php', config);
      if (response?.data?.status) {
        setAllCount(response?.data);
      }
    } catch (err) {
      console.log('something went wrong ', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllCounts();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 homeBox">
                  <div className="row">
                    <div className="col-12">
                      <div className="page-title-box d-flex align-items-center justify-content-between">
                        <div className="page-title-right">
                          <ol className="breadcrumb m-0">
                            <li className="breadcrumb-item">
                              <a href="/">Home</a>
                            </li>
                            <li className="breadcrumb-item active">Expo DashBoard</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cardd">
                    <div className="ad-v2-hom-info">
                      <div className="ad-v2-hom-info-inn">
                        <ul className="Homesb1 p-0">
                          <div className="row justify-content-center">
                            <li className="col-md-4">
                              <div className="ad-hom-box ad-hom-box-1">
                                <span className="ad-hom-col-com ad-hom-col-1">
                                  <img src="/assets/images/ongoingexpo.svg" alt="" width={55} />
                                </span>
                                <div className="ad-hom-view-com">
                                  <Link to="/expo/ongoing">
                                    <p>OnGoing Expo</p>
                                  </Link>
                                  <h3>{allCount?.onGoingExpos}</h3>
                                </div>
                              </div>
                            </li>
                              <li className="col-md-4">
                            <div className="ad-hom-box ad-hom-box-1">
                              <span className="ad-hom-col-com ad-hom-col-1">
                                <img src="/assets/images/visitor.svg" alt="" width={50} />
                              </span>
                              <div className="ad-hom-view-com1">
                                <Link to="/visitors-summary">
                                  <p>Total No.of Visitors</p>
                                </Link>
                                <h3>{allCount?.visitorsCount}</h3>
                              </div>
                            </div>
                          </li>
                          <li className="col-md-4">
                            <div className="ad-hom-box ad-had-hom-box-1">
                              <span className="ad-hom-col-com ad-hom-col-1">
                                <img src="/assets/images/exibitors.svg" alt="" width={50} />
                              </span>
                              <div className="ad-hom-view-com1">
                                <Link to="/builderparticipate">
                                  <p>Total No.of Exhibitors</p>
                                </Link>
                                <h3>{allCount?.exhibitorsCount}</h3>
                              </div>
                            </div>
                          </li>
                          
                          </div>
                        </ul>
                      </div>
                    </div>
{/* 
                    <div className="ad-v2-hom-info-inn1">
                      <ul className="Homesb1 p-0">
                        <div className="row row justify-content-center">
                        
  <li className="col-md-3">
                              <div className="ad-hom-box ad-hom-box-1">
                                <span className="ad-hom-col-com ad-hom-col-1">
                                  <img src="/assets/images/future.svg" alt="" width={65} />
                                </span>
                                <div className="ad-hom-view-com">
                                  <Link to="/futureexpo">
                                    <p>Future Expo</p>
                                  </Link>
                                  <h3>{allCount?.futureExpos}</h3>
                                </div>
                              </div>
                            </li>
                            <li className="col-md-3">
                              <div className="ad-hom-box ad-hom-box-1">
                                <span className="ad-hom-col-com ad-hom-col-1">
                                  <img src="/assets/images/completedexpo.svg" alt="" width={50} />
                                </span>
                                <div className="ad-hom-view-com">
                                  <Link to="/completedexpo">
                                    <p>Completed Expo</p>
                                  </Link>
                                  <h3>{allCount?.completedExpos}</h3>
                                </div>
                              </div>
                            </li>
                          <li className="col-md-3">
                            <div className="ad-hom-box ad-had-hom-box-1">
                              <span className="ad-hom-col-com ad-hom-col-1">
                                <img src="/assets/images/country.svg" alt="" width={50} />
                              </span>
                              <div className="ad-hom-view-com1">
                                <Link to="/countrymaster">
                                  <p>Countries</p>
                                </Link>
                                <h3>{allCount?.countriesCount}</h3>
                              </div>
                            </div>
                          </li>
                          <li className="col-md-3">
                            <div className="ad-hom-box ad-had-hom-box-1">
                              <span className="ad-hom-col-com ad-hom-col-1">
                                <img src="/assets/images/city.svg" alt="" width={50} />
                              </span>
                              <div className="ad-hom-view-com1">
                                <Link to="/citymaster">
                                  <p className="cityCard">City</p>
                                </Link>
                                <h3 className="cityH">{allCount?.citiesCount}</h3>
                              </div>
                            </div>
                          </li>
                        </div>
                      </ul>
                    </div> */}
                    <div className="ad-v2-hom-info-inn1">
                      <ul className="Homesb1 p-0">
                        <div className="row row justify-content-center"></div>
                      </ul>
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

export default ExpoDashboard;
