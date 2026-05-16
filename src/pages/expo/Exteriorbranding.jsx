import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { expoAdminClient, expoClient } from '../../utils/httpClient';
import { masterClient } from '../../utils/httpClient';
import { useDispatch, useSelector } from 'react-redux';
import { setExpo, setError } from '../../store/slices/ExpoSlice';
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

const Exteriorbranding = () => {
  const dispatchFormData = useDispatch();
  const formState = useSelector((state) => state.expo);
  const [formData, setFormData] = useState({});
  const [formErr, setFormErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileArray, setFileArray] = useState([]);
  const [imagesData, setImagesData] = useState({});
  const [show, setShow] = useState(false);
  const [imageValue,setImageValue]=useState()
  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    setImageValue(data)
    setShow(true)
  };

  useEffect(() => {
    console.log(formState, 'formStateformState');
  }, []);

  const handleImages3 = async (e) => {
    console.log('triggered', e);
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
      console.log('s3 res', res);
      if (res?.data) {
        handleImagesState(e, res?.data?.url);
      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      
    }
  };

  const handleImagesState = (e, url) => {
    setImagesData({
      ...imagesData,
      [e.target.name]: url
    })
    dispatchFormData(setExpo({ [e.target.name]: url }));
    console.log(imagesData);
    setLoading(false);
  };

  const handleChange = (e) => {
    dispatchFormData(setExpo({ [e.target.name]: e.target.value }));
    // setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const validate = () => {
    let isvalid = true;
    let errors = {};

    if (!formData.exterior_logo) {
      isvalid = false;
      errors.exterior_logo = 'Logo is mandatory field';
    }

    if (!formData.company_logo) {
      isvalid = false;
      errors.company_logo = 'Company logo is mandatory field';
    }
    if (!formData.hall_name) {
      isvalid = false;
      errors.hall_name = 'Hall name is mandatory field';
    }
    if (!formData.ex_standie1) {
      isvalid = false;
      errors.ex_standie1 = 'Standie 1 is mandatory field';
    }
    if (!formData.ex_standie2) {
      isvalid = false;
      errors.ex_standie2 = 'Standie 2 is mandatory field';
    }
    if (!formData.ex_standie3) {
      isvalid = false;
      errors.ex_standie3 = 'Standie 3 is mandatory field';
    }
    if (!formData.ex_standie4) {
      isvalid = false;
      errors.ex_standie4 = 'Standie 4 is mandatory field';
    }
    if (!formData.ex_standie5) {
      isvalid = false;
      errors.ex_standie5 = 'Standie 5 is mandatory field';
    }
    if (!formData.ex_standie6) {
      isvalid = false;
      errors.ex_standie6 = 'Standie 6 is mandatory field';
    }
    setFormErr(errors);

    return isvalid;
  };

  // const submitExterior = async  () => {
  //   if (validate()) {
  //     try {
  //       setLoading(true)
  //       let res;
  //       res = await expoClient.post(expo/create_expo.php,formData);
  //       if (res?.data?.status) {

  //         toastSuccess(res?.data?.message);

  //         setFormErr({});

  //       }

  //     }
  //     catch (e) {
  //       console.log(e);
  //     }
  //     finally {
  //       setLoading(false);
  //     }

  //   }
  //   else {

  //   }

  // }

  return (
    <>
      <form>
        <div className="row">
          <h6 className="createHead mb-4">Exterior Branding </h6>
          <div className="col-md-4 mb-4">
            {/* <label className="BuildName"></label> */}
            <div className="form-floating">
              <input
                type="file"
                className="form-control"
                name="airProxLogo"
                accept="image/*"
                onChange={handleImages3}
                // value={formState['expo'].airProxLogo || ''}
              />

              <label for="project-type" className="fw-normal">
                AirPropex Logo :{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> : <label onClick={()=>handleShow(imagesData?.airProxLogo)}>
                  <img src={`${imagesData?.airProxLogo?imagesData?.airProxLogo :"/assets/images/auth-bg.jpg"}`} alt="" width={55} />
                </label>}
              </span>
            </div>
            {formErr.airProxLogo && <p className="err">{formErr.airProxLogo}</p>}
          </div>
          <div className="col-md-4 mb-4">
            {/* <label className="BuildName"></label> */}
            <div className="form-floating">
              <input
                type="file"
                className="form-control"
                name="companyLogo"
                //value={formState['expo'].companyLogo || ''}
                onChange={handleImages3}
              />
              <label for="project-type" className="fw-normal">
                Company Logo{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> : <label onClick={()=>handleShow(imagesData?.companyLogo)}><img src={`${imagesData?.companyLogo?imagesData?.companyLogo :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.companyLogo && <p className="err">{formErr.companyLogo}</p>}
          </div>
          <div className="col-md-4">
            {/* <label className="BuildName"></label> */}
            <div className="form-floating">
              <input
                type="text"
                name="exhibitionHallName"
                className="form-control"
                value={formState['expo'].exhibitionHallName || ''}
                onChange={handleChange}
              />
              <label for="project-type" className="fw-normal">
                Exhibition Hall Name{' '}
              </label>
            </div>
            {formErr.exhibitionHallName && <p className="err">{formErr.exhibitionHallName}</p>}
          </div>
        </div>
        <div className="row">
          <h6 className="createHead mb-3">Exterior Banners</h6>
          <h5 className="mb-3 left_sde">Left Side</h5>

          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                placeholder="Name"
                name="exteriorBannersL1"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersL1 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 1:{' '}
              </label>
            </div>
            <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersL1)}><img src={`${imagesData?.exteriorBannersL1?imagesData?.exteriorBannersL1 :"/assets/images/auth-bg.jpg"}`}alt="" width={55} /></label>}
              </span>
            {formErr.exteriorBannersL1 && <p className="err">{formErr.exteriorBannersL1}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersL2"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersL2 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 2{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersL2)}><img src={`${imagesData?.exteriorBannersL2?imagesData?.exteriorBannersL2 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorBannersL2 && <p className="err">{formErr.exteriorBannersL2}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersL3"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersL3 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 3{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersL3)}><img src={`${imagesData?.exteriorBannersL3?imagesData?.exteriorBannersL3 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorBannersL3 && <p className="err">{formErr.exteriorBannersL3}</p>}
          </div>

          <div className="col-md-12">
            <h5 className="mb-3 left_sde">Right Side</h5>
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                placeholder="Name"
                name="exteriorBannersR1"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersR1 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 1:{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersR1)}><img src={`${imagesData?.exteriorBannersR1?imagesData?.exteriorBannersR1 :"/assets/images/auth-bg.jpg"}`}alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorBannersR1 && <p className="err">{formErr.exteriorBannersR1}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR2"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersR2 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 2{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersR2)}><img src={`${imagesData?.exteriorBannersR2?imagesData?.exteriorBannersR2 :"/assets/images/auth-bg.jpg"}`}alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorBannersR2 && <p className="err">{formErr.exteriorBannersR2}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorBannersR3"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorBannersR3 || ''}
              />
              <label for="project-type" className="fw-normal">
                Banner 3{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorBannersR3)}><img src={`${imagesData?.exteriorBannersR3?imagesData?.exteriorBannersR3 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorBannersR3 && <p className="err">{formErr.exteriorBannersR3}</p>}
          </div>

          {/* <div className="row">
            <div className="btn-subb mb-5">
              <button type="button" className="save" >
                Save
              </button>
            </div>
          </div> */}
        </div>

        <div className="row">
          <h6 className="createHead mb-3">Exterior Standies</h6>
          <h5 className="mb-3 left_sde">Left Side</h5>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                placeholder="Name"
                name="exteriorStandiesL1"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorStandiesL1 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 1:{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorStandiesL1)}><img src={`${imagesData?.exteriorStandiesL1?imagesData?.exteriorStandiesL1 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesL1 && <p className="err">{formErr.exteriorStandiesL1}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorStandiesL2"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorStandiesL2 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 2{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorStandiesL2)}><img src={`${imagesData?.exteriorStandiesL2?imagesData?.exteriorStandiesL2 :"/assets/images/auth-bg.jpg"}`}alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesL2 && <p className="err">{formErr.exteriorStandiesL2}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorStandiesL3"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorStandiesL3 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 3{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> : <label onClick={()=>handleShow(imagesData?.exteriorStandiesL3)}><img src={`${imagesData?.exteriorStandiesL3?imagesData?.exteriorStandiesL3 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesL3 && <p className="err">{formErr.exteriorStandiesL3}</p>}
          </div>

          <div className="col-md-12">
            <h5 className="mb-3 left_sde">Rght Side</h5>
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorStandiesR1"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorStandiesR1 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 1{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> : <label onClick={()=>handleShow(imagesData?.exteriorStandiesR1)}><img src={`${imagesData?.exteriorStandiesR1?imagesData?.exteriorStandiesR1 :"/assets/images/auth-bg.jpg"}`}alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesR1 && <p className="err">{formErr.exteriorStandiesR1}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorStandiesR2"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].ex_standie5 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 2{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> : <label onClick={()=>handleShow(imagesData?.exteriorStandiesR2)}><img src={`${imagesData?.exteriorStandiesR2?imagesData?.exteriorStandiesR2 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesR2 && <p className="err">{formErr.exteriorStandiesR2}</p>}
          </div>
          <div className="col-md-4 mb-4">
            <div className="form-floating">
              <input
                type="file"
                name="exteriorStandiesR3"
                className="form-control"
                onChange={handleImages3}
                accept="image/*"
                // value={formState['expo'].exteriorStandiesR3 || ''}
              />
              <label for="project-type" className="fw-normal">
                Standie 3{' '}
              </label>
              <span className="upld_img">
                 {/* <FaRegEdit /> */}
                {(loading) ? <Loader /> :<label onClick={()=>handleShow(imagesData?.exteriorStandiesR3)}><img src={`${imagesData?.exteriorStandiesR3?imagesData?.exteriorStandiesR3 :"/assets/images/auth-bg.jpg"}`} alt="" width={55} /></label>}
              </span>
            </div>
            {formErr.exteriorStandiesR3 && <p className="err">{formErr.exteriorStandiesR3}</p>}
          </div>

          {/* <div className="row">
            <div className="btn-subb mb-5">
              <button type="button" className="save" >
                Save
              </button>
            </div>
          </div> */}

          

    <Modal show={show} onHide={handleClose} className='popup_img'>
          <Modal.Header closeButton>
           
          </Modal.Header>
         
         <div>
         <img src={`${imageValue?imageValue :"/assets/images/auth-bg.jpg"}`} alt="" width={500} />
         </div>
       
        </Modal>
</div>
            
      </form>

      
    </>
  );
};

export default Exteriorbranding;
