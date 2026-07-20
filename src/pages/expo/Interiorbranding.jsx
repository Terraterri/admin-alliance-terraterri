import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { expoAdminClient, expoClient } from '../../utils/httpClient';
import { masterClient } from '../../utils/httpClient';
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setExpo, clearExpo, setError } from '../../store/slices/ExpoSlice';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';

function Interiorbranding() {
  const { expoUnqCode } = useParams();
  const dispatchFormData = useDispatch();
  const formState = useSelector((state) => state.expo);
  const [formData, setFormData] = useState({});
  const [formErr, setFormErr] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [fileArray, setFileArray] = useState([]);
  const [imagesData, setImagesData] = useState({});
  const [show, setShow] = useState(false);
  const [imageValue, setImageValue] = useState()
  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    setImageValue(data)
    setShow(true)
  };

  const [form, setForm] = useState({});

  useEffect(() => {
    console.log(formState, 'formStateformState');
  }, [formState]);



  const handleChange = (e) => {

    dispatchFormData(setExpo({ [e.target.name]: e.target.value }))
    // setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImages3 = async (e) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };
      let res = await expoAdminClient.post('imageConfig/upload_to_gcs.php', formData, config);
      console.log('s3 res', res);
      if (res?.data) {
        handleImagesState(e, res?.data?.url);
      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesState = (e, url) => {
    setImagesData({
      ...imagesData,
      [e.target.name]: url
    })
    dispatchFormData(setExpo({ [e.target.name]: url }));
  };

  const submitExpo = async () => {
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

      const payload = {
        ...formState['expo'],
        ...(code ? { expoUnqCode: code } : {})
      };

      if (code) {
        res = await expoAdminClient.post('NewExpo/update.php', payload, config);
      } else {
        res = await expoAdminClient.post('NewExpo/create.php', payload, config);
      }
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        dispatchFormData(clearExpo());
        navigate('/futureexpo');
        // setFormErr({});
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let isvalid = true;
    let errors = {};
    if (!formData.rec_tbl_center_img) {
      isvalid = false;
      errors.rec_tbl_center_img = 'Mandatory field';
    }

    if (!formData.rec_tbl_logo) {
      isvalid = false;
      errors.rec_tbl_logo = 'Mandatory field';
    }
    if (!formData.wallbanners_left_1) {
      isvalid = false;
      errors.wallbanners_left_1 = 'mandatory field';
    }
    if (!formData.wallbanners_left_2) {
      isvalid = false;
      errors.wallbanners_left_2 = 'Mandatory field';
    }
    if (!formData.wallbanners_left_3) {
      isvalid = false;
      errors.wallbanners_left_3 = 'Mandatory field';
    }
    if (!formData.wallbanners_left_4) {
      isvalid = false;
      errors.wallbanners_left_4 = 'Mandatory field';
    }
    if (!formData.wallbanners_right_1) {
      isvalid = false;
      errors.wallbanners_right_1 = 'Mandatory field';
    }
    if (!formData.wallbanners_right_2) {
      isvalid = false;
      errors.wallbanners_right_2 = 'Mandatory field';
    }
    if (!formData.wallbanners_right_3) {
      isvalid = false;
      errors.wallbanners_right_3 = 'Mandatory field';
    }
    if (!formData.wallbanners_right_4) {
      isvalid = false;
      errors.wallbanners_right_4 = 'Mandatory field';
    }
    if (!formData.audit_entrance_top_video) {
      isvalid = false;
      errors.audit_entrance_top_video = 'Mandatory field';
    }
    if (!formData.audit_ent_right_banner) {
      isvalid = false;
      errors.audit_ent_right_banner = 'Mandatory field';
    }
    if (!formData.audit_ent_left_banner1) {
      isvalid = false;
      errors.audit_ent_left_banner1 = 'Mandatory field';
    }
    if (!formData.audit_ent_left_banner2) {
      isvalid = false;
      errors.audit_ent_left_banner2 = 'Mandatory field';
    }
    if (!formData.audit_ent_left_banner3) {
      isvalid = false;
      errors.audit_ent_left_banner3 = 'Mandatory field';
    }
    if (!formData.audit_ent_left_banner4) {
      isvalid = false;
      errors.audit_ent_left_banner4 = 'Mandatory field';
    }
    if (!formData.expo_entr_topvideo) {
      isvalid = false;
      errors.expo_entr_topvideo = 'Mandatory field';
    }
    if (!formData.expo_entr_left_banner) {
      isvalid = false;
      errors.expo_entr_left_banner = 'Mandatory field';
    }
    if (!formData.expo_entr_right_banner1) {
      isvalid = false;
      errors.expo_entr_right_banner1 = 'Mandatory field';
    }
    if (!formData.expo_entr_right_banner2) {
      isvalid = false;
      errors.expo_entr_right_banner2 = 'Mandatory field';
    }
    if (!formData.expo_entr_right_banner3) {
      isvalid = false;
      errors.expo_entr_right_banner3 = 'Mandatory field';
    }
    if (!formData.expo_entr_right_banner4) {
      isvalid = false;
      errors.expo_entr_right_banner4 = 'Mandatory field';
    }
    if (!formData.tunnel_img1) {
      isvalid = false;
      errors.tunnel_img1 = 'Mandatory field';
    }
    if (!formData.tunnel_img2) {
      isvalid = false;
      errors.tunnel_img2 = 'Mandatory field';
    }
    if (!formData.tunnel_img3) {
      isvalid = false;
      errors.tunnel_img3 = 'Mandatory field';
    }
    if (!formData.tunnel_img4) {
      isvalid = false;
      errors.tunnel_img4 = 'Mandatory field';
    }
    if (!formData.tunnel_img5) {
      isvalid = false;
      errors.tunnel_img5 = 'Mandatory field';
    }
    if (!formData.tunnel_img6) {
      isvalid = false;
      errors.tunnel_img6 = 'Mandatory field';
    }
    setFormErr(errors);

    return isvalid;
  };

  return (
    <>
      <form className="receptForm">


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
                value={formState['expo']?.arena_manager1 || formState['expo']?.arena_manager1Name || ''}
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
                value={formState['expo']?.arena_manager1Number || formState['expo']?.arena_manager1Mobile || ''}
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
                value={formState['expo']?.arena_manager2 || formState['expo']?.arena_manager2Name || ''}
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
                value={formState['expo']?.arena_manager2Number || formState['expo']?.arena_manager2Mobile || ''}
              />
              <label htmlFor="arena_manager2Number" className="fw-normal">
                Mobile Number
              </label>
            </div>
          </div>
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
}

export default Interiorbranding;
