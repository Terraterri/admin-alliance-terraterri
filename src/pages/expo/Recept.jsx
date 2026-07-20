import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { expoClient, expoAdminClient } from '../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setExpo, clearExpo, setError } from '../../store/slices/ExpoSlice';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

const Recept = () => {
  const navigate = useNavigate();
  const { expoUnqCode } = useParams();
  const dispatchFormData = useDispatch();
  const formState = useSelector(state => state.expo);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const [formErr, setFormErr] = useState({});
  const [imagesData, setImagesData] = useState({});

  const [show, setShow] = useState(false);
  const [imageValue, setImageValue] = useState();

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    dispatchFormData(setExpo({ [e.target.name]: e.target.value }));
  };

  const handleImagesState = (e, url) => {
    setImagesData({
      ...imagesData,
      [e.target.name]: url
    });
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
      setLoading(false);
    }
  };

  const handleVideos3 = async (e) => {
    e.preventDefault();
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
      alert('error uploading Video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideos2 = handleVideos3;

  useEffect(() => {
    console.log('form =====>', formState);
  }, [formState]);

  const validate = () => {
    let isvalid = true;
    let errors = {};
    const currentExpo = formState['expo'] || {};

    const avatarOneName = currentExpo.avatarOneName ?? currentExpo.roles?.["Receptionist1"]?.[0]?.name;
    const avatarOneNumber = currentExpo.avatarOneNumber ?? currentExpo.roles?.["Receptionist1"]?.[0]?.mobile;
    const avatarTwoName = currentExpo.avatarTwoName ?? currentExpo.roles?.["Receptionist2"]?.[0]?.name;
    const avatarTwoNumber = currentExpo.avatarTwoNumber ?? currentExpo.roles?.["Receptionist2"]?.[0]?.mobile;

    if (!avatarOneName) {
      isvalid = false;
      errors.avatarOneName = 'Receptionist 1 name is a mandatory field';
    }
    if (!avatarOneNumber) {
      isvalid = false;
      errors.avatarOneNumber = 'Receptionist 1 mobile is a mandatory field';
    }
    if (!avatarTwoName) {
      isvalid = false;
      errors.avatarTwoName = 'Receptionist 2 name is a mandatory field';
    }
    if (!avatarTwoNumber) {
      isvalid = false;
      errors.avatarTwoNumber = 'Receptionist 2 mobile is a mandatory field';
    }

    setFormErr(errors);
    return isvalid;
  };

  const submitExpo = async () => {
    if (!validate()) {
      toastError('Please fill in all mandatory fields.');
      return;
    }

    const code = expoUnqCode || localStorage.getItem('expoCode') || formState['expo']?.expoUnqCode;
    try {
      setLoading(true);
      let res;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      const currentExpo = formState['expo'] || {};
      const avatarOneName = currentExpo.avatarOneName ?? currentExpo.roles?.["Receptionist1"]?.[0]?.name ?? '';
      const avatarOneNumber = currentExpo.avatarOneNumber ?? currentExpo.roles?.["Receptionist1"]?.[0]?.mobile ?? '';
      const avatarTwoName = currentExpo.avatarTwoName ?? currentExpo.roles?.["Receptionist2"]?.[0]?.name ?? '';
      const avatarTwoNumber = currentExpo.avatarTwoNumber ?? currentExpo.roles?.["Receptionist2"]?.[0]?.mobile ?? '';
      const arena_manager1 = currentExpo.arena_manager1 ?? currentExpo.arena_manager1Name ?? currentExpo.roles?.["Arena Manager1"]?.[0]?.name ?? '';
      const arena_manager1Number = currentExpo.arena_manager1Number ?? currentExpo.arena_manager1Mobile ?? currentExpo.roles?.["Arena Manager1"]?.[0]?.mobile ?? '';
      const arena_manager2 = currentExpo.arena_manager2 ?? currentExpo.arena_manager2Name ?? currentExpo.roles?.["Arena Manager2"]?.[0]?.name ?? '';
      const arena_manager2Number = currentExpo.arena_manager2Number ?? currentExpo.arena_manager2Mobile ?? currentExpo.roles?.["Arena Manager2"]?.[0]?.mobile ?? '';

      const roles = {
        Receptionist1: [{ name: avatarOneName, mobile: avatarOneNumber, role: 'Receptionist1', tableNo: '1' }],
        Receptionist2: [{ name: avatarTwoName, mobile: avatarTwoNumber, role: 'Receptionist2', tableNo: '2' }],
        'Arena Manager1': [{ name: arena_manager1, mobile: arena_manager1Number, role: 'Arena Manager1', tableNo: '3' }],
        'Arena Manager2': [{ name: arena_manager2, mobile: arena_manager2Number, role: 'Arena Manager2', tableNo: '4' }]
      };

      const managers = [
        { name: avatarOneName, mobile: avatarOneNumber, role: 'Receptionist1', tableNo: '1' },
        { name: avatarTwoName, mobile: avatarTwoNumber, role: 'Receptionist2', tableNo: '2' },
        { name: arena_manager1, mobile: arena_manager1Number, role: 'Arena Manager1', tableNo: '3' },
        { name: arena_manager2, mobile: arena_manager2Number, role: 'Arena Manager2', tableNo: '4' }
      ];

      const payload = {
        ...currentExpo,
        avatarOneName,
        avatarOneNumber,
        avatarTwoName,
        avatarTwoNumber,
        arena_manager1,
        arena_manager1Name: arena_manager1,
        arena_manager1Number,
        arena_manager1Mobile: arena_manager1Number,
        arena_manager2,
        arena_manager2Name: arena_manager2,
        arena_manager2Number,
        arena_manager2Mobile: arena_manager2Number,
        roles,
        managers,
        ...(code ? { expoUnqCode: code } : {})
      };

      if (code) {
        res = await expoAdminClient.post('NewExpo/update.php', payload, config);
      } else {
        res = await expoAdminClient.post('NewExpo/create.php', payload, config);
      }

      if (res?.data?.status) {
        toastSuccess(res?.data?.message || 'Expo saved successfully');
        dispatchFormData(clearExpo());

        //navigate(`/expo/create`);
      } else {
        toastError(res?.data?.message || 'Failed to save expo');
      }
    } catch (e) {
      console.error(e);
      toastError(e?.response?.data?.message || 'Failed to save expo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <form>
        <h6 className="createHead mb-4">Receptionists : </h6>

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
                value={formState['expo']?.avatarOneName ?? formState['expo']?.roles?.["Receptionist1"]?.[0]?.name ?? ''}
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
                value={formState['expo']?.avatarOneNumber ?? formState['expo']?.roles?.["Receptionist1"]?.[0]?.mobile ?? ''}
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
                value={formState['expo']?.avatarTwoName ?? formState['expo']?.roles?.["Receptionist2"]?.[0]?.name ?? ''}
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
                value={formState['expo']?.avatarTwoNumber ?? formState['expo']?.roles?.["Receptionist2"]?.[0]?.mobile ?? ''}
                className="form-control" />
              <label htmlFor="title" className="fw-normal">
                Mobile Number
              </label>
            </div>
            {formErr.avatarTwoNumber && <p className="err">{formErr.avatarTwoNumber}</p>}
          </div>
        </div>

        <div className="row">
          <h6 className="createHead mb-3">Arena Managers :</h6>

          <div className="row mb-4 col-md-11">
            <div className="col-md-2">
              <h6 className="BuildName">Arena Manager 1 :</h6>
            </div>
            <div className="col-md-5">
              <div className="form-floating">
                <input
                  type="text"
                  placeholder="Name"
                  name="arena_manager1"
                  className="form-control"
                  onChange={handleChange}
                  value={formState['expo']?.arena_manager1 ?? formState['expo']?.arena_manager1Name ?? formState['expo']?.roles?.["Arena Manager1"]?.[0]?.name ?? ''}
                />
                <label htmlFor="arena_manager1" className="fw-normal">
                  Name
                </label>
              </div>
            </div>

            <div className="col-md-5">
              <div className="form-floating">
                <input
                  type="number"
                  placeholder="Mobile Number"
                  name="arena_manager1Number"
                  className="form-control"
                  onChange={handleChange}
                  value={formState['expo']?.arena_manager1Number ?? formState['expo']?.arena_manager1Mobile ?? formState['expo']?.roles?.["Arena Manager1"]?.[0]?.mobile ?? ''}
                />
                <label htmlFor="arena_manager1Number" className="fw-normal">
                  Mobile Number
                </label>
              </div>
            </div>
          </div>

          <div className="row mb-4 col-md-11">
            <div className="col-md-2">
              <h6 className="BuildName">Arena Manager 2 :</h6>
            </div>
            <div className="col-md-5">
              <div className="form-floating">
                <input
                  type="text"
                  placeholder="Name"
                  name="arena_manager2"
                  className="form-control"
                  onChange={handleChange}
                  value={formState['expo']?.arena_manager2 ?? formState['expo']?.arena_manager2Name ?? formState['expo']?.roles?.["Arena Manager2"]?.[0]?.name ?? ''}
                />
                <label htmlFor="arena_manager2" className="fw-normal">
                  Name
                </label>
              </div>
            </div>

            <div className="col-md-5">
              <div className="form-floating">
                <input
                  type="number"
                  placeholder="Mobile Number"
                  name="arena_manager2Number"
                  className="form-control"
                  onChange={handleChange}
                  value={formState['expo']?.arena_manager2Number ?? formState['expo']?.arena_manager2Mobile ?? formState['expo']?.roles?.["Arena Manager2"]?.[0]?.mobile ?? ''}
                />
                <label htmlFor="arena_manager2Number" className="fw-normal">
                  Mobile Number
                </label>
              </div>
            </div>
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





        <div className="row mb-4 col-md-11">
          <div className="row mt-5">
            <div className="btn-subb mb-5">
              <button type="button" className="save" onClick={submitExpo}>
                Save
              </button>
            </div>
          </div>
        </div>

      </form>
    </>
  );
};

export default Recept;
