import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import { Link, useParams } from 'react-router-dom';
import { expoAdminClient, expoClient } from '../../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../../utils/toast';
import moment from 'moment';
import axios from 'axios';

const ExpoSingleview = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(true);
  const [expoData, setExpoData] = useState(null);
  const { expoId } = useParams();
  const [expos, setExpos] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0); // State for length count

  useEffect(() => {
    const fetchExpoData = async () => {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      };

      try {
        const res = await expoAdminClient.get(
          `NewExpo/get.php?type=future&limit=40&skip=0&expoId=${expoId}`,
          config
        );

        if (res?.data?.status) {
          const data = res.data.data.find((expo) => expo.newExpoId == expoId);
          setExpoData(data || null);

          if (data?.expoUnqCode) {
            const ress = await axios.get(
              `http://localhost/tt-expo-admin-be/newExpoUsers/getExpoUsers.php?limit=40&skip=0&expoId=${data.expoUnqCode}`,
              config
            );

            if (ress?.data?.status) {
              setExpos(ress.data.status)
              setVisitorCount(ress.data.data.length || 0); // Count the number of records
            }
          }
        }
      } catch (error) {
        console.error("Error fetching expo details:", error.response?.data || error.message);
        toastError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchExpoData();
  }, [expoId]);



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
                      <li className="breadcrumb-item active">View Details</li>
                    </ol>
                  </div>
                  {/* <div className="page-title-right">
                   <button className="btn btn-info">Add States</button>
                 </div> */}
                </div>
              </div>
            </div>
            {/*            
          
         */}
            <div className="cardd">

              <div className="row">
                <div className="col-md-6">
                  <div className='details_ot details_ot1'>
                    <ul>
                      <li><span>ID</span> : {expoData?.newExpoId}</li>
                      <li><span>Expo Code </span> : {expoData?.expoUnqCode}</li>
                      <li><span>City </span> : {expoData?.expoCity}</li>
                      <li><span>Date From </span> : {moment(expoData?.fromDate).format("DD MMMM YYYY")}</li>
                      <li><span>Date To	 </span> : {moment(expoData?.toDate).format("DD MMMM YYYY")}	</li>
                      <li><span>Expo Type	</span> : {expoData?.expoType} </li>
                    </ul>

                  </div>
                </div>
                <div className="col-md-6">
                  <div className='details_ot details_ot2'>
                    <ul>
                      <li><span>No of Visitors</span>	 : <Link to="/visitors-summary">1560</Link></li>
                      <li><span>Total Visitor Registrations</span> :<Link to={`/visitors-by-expo/${expoData?.expoUnqCode}`}> {visitorCount}</Link> </li>
                      <li><span>No of Builder Participation</span>	 : <Link to="/builderparticipate">21</Link></li>
                      <li><span>Sponcers Management</span>	 : <Link to="/sponcermanagement">21</Link></li>
                      <li><span>Lead Generation Source</span>	 : <Link to="/addleadgen">21</Link></li>

                    </ul>

                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>


      </div>

    </>
  )
}

export default ExpoSingleview