import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { expoClient, expoAdminClient } from '../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setExpo, setError } from '../../store/slices/ExpoSlice';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

const Recept = () => {

  const dispatchFormData = useDispatch();
  const formState = useSelector(state => state.expo);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const [formErr, setFormErr] = useState({});
  const [imagesData, setImagesData] = useState({});

  const [show, setShow] = useState(false);
  const [imageValue, setImageValue] = useState()

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    dispatchFormData(setExpo({ [e.target.name]: e.target.value }))
    // setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleImagesState = (e, url) => {
    setImagesData({
      ...imagesData,
      [e.target.name]: url
    })
    dispatchFormData(setExpo({ [e.target.name]: url }));
    setLoading(false);
  };

  const handleImages3 = async (e) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null,
          'Content-Type': 'multipart/form-data'
        },
      };
      let res = await expoAdminClient.post('imageConfig/upload_to_gcs.php', formData, config);
      if (res?.data) {
        handleImagesState(e, res?.data?.url);
      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      setLoading(false)
    }
  };


  const handleVideos3 = async (e) => {
    e.preventDefault()
    let formData = new FormData();
    formData.append('video', e.target.files[0]);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null,
          'Content-Type': 'multipart/form-data'
        },
      };
      let res = await expoAdminClient.post('videoConfig/upload_to_gcs.php', formData, config);
      if (res?.data) {
        dispatchFormData(setExpo({ [e.target.name]: res?.data?.url }));
      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      setLoading(false)
    } 
  }

  useEffect(() => {
    console.log('form =====>', formState);
  }, [formState])

  const validate = () => {
    let isvalid = true;
    let errors = {};

    if (!formState['expo'].rec1_name) {
      isvalid = false;
      errors.rec1_name = 'Avatar 1 name is mandatory field'

    }

    if (!formState['expo'].rec1_mobile) {
      isvalid = false;
      errors.rec1_mobile = 'Avatar 1 mobile is mandatory field'

    }
    if (!formState['expo'].rec1_login) {
      isvalid = false;
      errors.rec1_login = 'Avatar 1 login id is mandatory field'

    }
    if (!formState['expo'].rec1_password) {
      isvalid = false;
      errors.rec1_password = 'Avatar 1 password is mandatory field'

    }
    if (!formState['expo'].rec2_name) {
      isvalid = false;
      errors.rec2_name = 'Avatar 2 name is mandatory field'

    }
    if (!formState['expo'].rec2_mobile) {
      isvalid = false;
      errors.rec2_mobile = 'Avatar 2 mobile is mandatory field'
    }
    if (!formState['expo'].rec2_login) {
      isvalid = false;
      errors.rec2_login = 'Avatar 2 login is mandatory field'
    }
    if (!formState['expo'].rec2_password) {
      isvalid = false;
      errors.rec2_password = 'Avatar 2 password is mandatory field'
    }
    setFormErr(errors)
    return isvalid
  }

  return (
    <>
      {loading && <Loader />}
      <form>
        <h6 className="createHead mb-4">Create Receptionist : </h6>

        <div className="row mb-4">
          <div className="col-md-2">
            <h6 className="BuildName">Receptionist 1 :</h6>
          </div>
          <div className="col-md-5">
            <div className="form-floating">
              <input type="text" placeholder="Name"
                name="avatarOneName"
                className="form-control"
                onChange={handleChange}
                value={formState['expo'].avatarOneName || ''}
              />
              <label htmlFor="title" className="fw-normal">
                Name
              </label>
            </div>
            {formErr.avatarOneName && <p className="err">{formErr.avatarOneName}</p>}
          </div>
          <div className="col-md-5">
            <div className="form-floating">
              <input type="number" placeholder="Name"
                name="avatarOneNumber"
                className="form-control"
                onChange={handleChange}
                value={formState['expo'].avatarOneNumber || ''}
              />
              <label htmlFor="title" className="fw-normal">
                Mobile Number
              </label>
            </div>
            {formErr.avatarOneNumber && <p className="err">{formErr.avatarOneNumber}</p>}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-2">
            <h6 className="BuildName">Receptionist 2 :</h6>
          </div>
          <div className="col-md-5">
            <div className="form-floating">
              <input type="text" placeholder="Name" name="avatarTwoName"
                onChange={handleChange}
                value={formState['expo'].avatarTwoName || ''}
                className="form-control" />
              <label htmlFor="title" className="fw-normal">
                Name
              </label>
            </div>
            {formErr.avatarTwoName && <p className="err">{formErr.avatarTwoName}</p>}
          </div>
          <div className="col-md-5">
            <div className="form-floating">
              <input type="number"
                placeholder="Name"
                name="avatarTwoNumber"
                onChange={handleChange}
                value={formState['expo'].avatarTwoNumber || ''}
                className="form-control" />
              <label htmlFor="title" className="fw-normal">
                Mobile Number
              </label>
            </div>
            {formErr.avatarTwoNumber && <p className="err">{formErr.avatarTwoNumber}</p>}
          </div>
        </div>

        <div className="row">
          <h6 className="createHead mb-3">Reception Videos :</h6>
          <h5 className="mb-3 left_sde">Left Side</h5>

          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                placeholder="Name"
                name="exteriorBannersL1"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 1:{' '}
              </label>
            </div>

            {formErr.exteriorStandiesL1 && <p className="err">{formErr.exteriorStandiesL1}</p>}

            {formState['expo']?.exteriorBannersL1 !== undefined &&
              <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                <source src={formState['expo']?.exteriorBannersL1} type="video/mp4" />
                <track
                  src={formState['expo']?.exteriorBannersL1}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              </video>
            }
          </div>


          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersL2"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 2{' '}
              </label>
            </div>

            {formErr.exteriorStandiesL2 && <p className="err">{formErr.exteriorStandiesL2}</p>}

            {formState['expo']?.exteriorBannersL2 !== undefined &&
              <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                <source src={formState['expo']?.exteriorBannersL2} type="video/mp4" />
                <track
                  src={formState['expo']?.exteriorBannersL2}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              </video>
            }
          </div>

          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersL3"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 3{' '}
              </label>
            </div>
            {formErr.exteriorStandiesL3 && <p className="err">{formErr.exteriorStandiesL3}</p>}
            {formState['expo']?.exteriorBannersL3 !== undefined &&
              <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                <source src={formState['expo']?.exteriorBannersL3} type="video/mp4" />
                <track
                  src={formState['expo']?.exteriorBannersL3}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              </video>
            }
          </div>

          <div className="col-md-12">
            <h5 className="mb-3 left_sde">Right Side</h5>
          </div>
          <div className="col-md-3 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR1"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 1{' '}
              </label>
              {formState['expo']?.exteriorBannersR1 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.exteriorBannersR1} type="video/mp4" />
                  <track
                    src={formState['expo']?.exteriorBannersR1}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.exteriorStandiesR1 && <p className="err">{formErr.exteriorStandiesR1}</p>}
          </div>

          <div className="col-md-3 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR2"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 2{' '}
              </label>
            </div>
            {formErr.exteriorStandiesR2 && <p className="err">{formErr.exteriorStandiesR2}</p>}

            {formState['expo']?.exteriorBannersR2 !== undefined &&
              <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                <source src={formState['expo']?.exteriorBannersR2} type="video/mp4" />
                <track
                  src={formState['expo']?.exteriorBannersR2}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              </video>
            }
          </div>

          <div className="col-md-3 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR3"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 3{' '}
              </label>

              {formState['expo']?.exteriorBannersR3 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.exteriorBannersR3} type="video/mp4" />
                  <track
                    src={formState['expo']?.exteriorBannersR3}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.exteriorStandiesR3 && <p className="err">{formErr.exteriorStandiesR3}</p>}
          </div>

          <div className="col-md-3 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR4"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 4{' '}
              </label>
              {formState['expo']?.exteriorBannersR4 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.exteriorBannersR4} type="video/mp4" />
                  <track
                    src={formState['expo']?.exteriorBannersR4}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.exteriorBannersR4 && <p className="err">{formErr.exteriorBannersR4}</p>}
          </div>

          <div className="col-md-12">
            <h6 className="createHead mb-3">Expo Arena Hall</h6>
          </div>
          <div className="col-md-12">
            <h5 className="mb-3 left_sde">Left Side Wall</h5>
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                placeholder="Name"
                name="auditoriumEntranceL1"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 1{' '}
              </label>
              {formState['expo']?.auditoriumEntranceL1 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.auditoriumEntranceL1} type="video/mp4" />
                  <track
                    src={formState['expo']?.auditoriumEntranceL1}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.auditoriumEntranceL1 && <p className="err">{formErr.auditoriumEntranceL1}</p>}
          </div>

          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="auditoriumEntranceL2"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Video 2{' '}
              </label>
              {formState['expo']?.auditoriumEntranceL2 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.auditoriumEntranceL2} type="video/mp4" />
                  <track
                    src={formState['expo']?.auditoriumEntranceL2}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.exteriorStandiesL2 && <p className="err">{formErr.exteriorStandiesL2}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="auditoriumEntranceL3"
                className="form-control"
                onChange={handleVideos3}
                accept="video/*"
              />
              <label htmlFor="project-type" className="fw-normal">
                Image 3{' '}
              </label>
              {formState['expo']?.auditoriumEntranceL3 !== undefined &&
                <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                  <source src={formState['expo']?.auditoriumEntranceL3} type="video/mp4" />
                  <track
                    src={formState['expo']?.auditoriumEntranceL3}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                </video>
              }
            </div>
            {formErr.auditoriumEntranceL3 && <p className="err">{formErr.auditoriumEntranceL3}</p>}
          </div>

          <Modal show={show} onHide={handleClose} className='popup_img'>
            <Modal.Header closeButton>

            </Modal.Header>

            <div>
              <img src={`${imageValue ? imageValue : "/assets/images/auth-bg.jpg"}`} alt="" width={500} />
            </div>

          </Modal>
        </div>
      </form>
    </>
  );
};

export default Recept;
