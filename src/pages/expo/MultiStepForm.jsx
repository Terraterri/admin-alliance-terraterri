import React, { useEffect } from 'react';
import Recept from './Recept';
import Interiorbranding from './Interiorbranding';
import { useDispatch } from 'react-redux';
import { setExpo } from '../../store/slices/ExpoSlice';
import { expoAdminClient } from '../../utils/httpClient';

const MultiStepForm = () => {
  const expoUnqCode = localStorage.getItem('expoCode');
  const dispatch = useDispatch();

  console.log("expoUnqCode", expoUnqCode)

  useEffect(() => {
    const fetchExpoByCode = async () => {
      try {
        const res = await expoAdminClient.get(`NewExpos/getByUnqCode.php?expoCode=${expoUnqCode}`);
        console.log("res", res.data.data);

        if (res.data.data) {
          dispatch(setExpo(res.data.data));
        }
      } catch (error) {
        console.error("Error fetching expo data:", error);
      }
    };

    if (expoUnqCode) {
      fetchExpoByCode();
    }
  }, [expoUnqCode, dispatch]);

  return (
    <>
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
                      <li className="breadcrumb-item active">Expo Configuration</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="cardd">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                          <span className="nav-link active fw-bold">Reception &amp; Expo Arena</span>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body p-4">
                      <Recept />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiStepForm;
