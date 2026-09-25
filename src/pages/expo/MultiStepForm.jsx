import React, { useEffect } from 'react';
import Recept from './Recept';
import Interiorbranding from './Interiorbranding';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setExpo } from '../../store/slices/ExpoSlice';
import { expoAdminClient } from '../../utils/httpClient';
import { useParams } from 'react-router-dom';
import { MdEmail, MdWhatsapp } from 'react-icons/md';

const MultiStepForm = () => {
  const { expoUnqCode: paramExpoCode } = useParams();
  const expoUnqCode = paramExpoCode || localStorage.getItem('expoCode');
  const savedExpoCode = useSelector((state) => state.expo?.expo?.expoUnqCode);
  const dispatch = useDispatch();
  const expoCode = savedExpoCode || expoUnqCode;
  const expoLink = expoCode
    ? `https://storage.googleapis.com/airpropx-expo-dev/index.html?expo=${encodeURIComponent(expoCode)}`
    : '';

  console.log("expoUnqCode", expoUnqCode);

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
                      {expoLink && (
                        <div className="border border-primary rounded p-3 mb-4 bg-light shadow-sm">
                          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="flex-grow-1">
                              <div className="fw-semibold text-primary mb-1">Your expo link</div>
                              <a href={expoLink} target="_blank" rel="noreferrer" className="text-break">
                                {expoLink}
                              </a>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <a
                                href={`mailto:?subject=${encodeURIComponent('Your expo link')}&body=${encodeURIComponent(expoLink)}`}
                                className="btn btn-light border text-danger"
                                aria-label="Share expo link by email"
                                title="Share by email"
                              >
                                <MdEmail size={20} />
                              </a>
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(expoLink)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-light border text-success"
                                aria-label="Share expo link on WhatsApp"
                                title="Share on WhatsApp"
                              >
                                <MdWhatsapp size={20} />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
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
