import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import Loader from '../../../components/Loader';
import { expoAdminClient, expoApiClient } from '../../../utils/httpClient';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toastError, toastSuccess } from '../../../utils/toast';
import { handleImages3 } from '../../../utils/S3Handler';
import { useNavigate } from 'react-router';
const ViewStallDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const userData = useSelector(state => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [isTeamEdiTable, setIsTeamEdiTable] = useState(false);
  const [isInteriorEdiTable, setIsInteriorEdiTable] = useState(false);
  const [isExteriorEditTable, setIsExteriorEditTable] = useState(false);
  const [form, setForm] = useState({
    Builder: {},
    Manager: {},
    Executive: [],
  });

  const handleTeamEdit = () => setIsTeamEdiTable(!isTeamEdiTable);
  const handleIntiriorEdit = () => setIsInteriorEdiTable(!isInteriorEdiTable);
  const handleExteriorEdit = () => setIsExteriorEditTable(!isExteriorEditTable);


  const getStallInfo = async () => {
    try {
      setLoading(true);
      const response = await expoApiClient.get(`/createStall/getStallInfo.php?id=${id}`);
      if (response?.data?.status) {
        setForm(response.data.data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getStallInfo() }, []);

  const handleForm = async (e) => {
    const { name, value, id } = e.target;


    setForm((prev) => {
      const updatedForm = { ...prev };
      if (id == 'Builder') {

        updatedForm.Builder = {
          ...updatedForm.Builder,
          [name]: value
        };
      } else if (id == 'Manager') {
        updatedForm.Manager = {
          ...updatedForm.Manager,
          [name]: value
        };
      } else if (id.startsWith('Executive')) {
        const index = parseInt(id.split('-')[1], 10) - 1;
        const tableNo = id.split('-')[1];
        const updatedExecutives = [...updatedForm.Executive];

        updatedExecutives[index] = {
          ...updatedExecutives[index],
          [name]: value,
          tableNo: tableNo
        };

        updatedForm.Executive = updatedExecutives;
      }

      return updatedForm;
    });
  }


  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        if (e.target.name === 'brochure_url') {
          setForm((prevState) => ({
            ...prevState,
            projects: prevState.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.url }
                : project
            )
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.url }
                : project
            )
          }));
        }
      } else {
        setForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.url
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  };

  const handleVideos3 = async (e, index) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('video', e.target.files[0]);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization:
            `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJudW1iZXIiOiI5MDYzNzU0MzIxIiwiaWF0IjoxNzMxNDc2MzYxLCJuYmYiOjE3MzE0NzYzNjEsImV4cCI6MTczMTU2Mjc2MX0.jfahNBh_28ap4VGQCVVu63QR0aJGxvAI9l391lqL82U` ||
            null,
          'Content-Type': 'multipart/form-data'
        }
      };
      let res = await expoAdminClient.post('videoConfig/upload_to_gcs.php', formData, config);
      if (res?.data) {

        if (index !== undefined) {
          console.log('from index', e.target.name, res?.data?.url);
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: res?.data?.url }
                : project
            )
          }));
        } else {
          console.log(e.target.name, res?.data?.url);
          setForm((prev) => ({
            ...prev,
            [e.target.name]: res?.data?.url
          }));
        }

      }
    } catch (error) {
      console.log(error);
      alert('error uploading Video');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await expoApiClient.post('/createStall/updateStall.php', form);
      if (response?.data?.status) {
        toastSuccess('Stall Updated Successfully');
        navigate('/future-expo');
      } else {
        toastError('Failed to update')
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
                      <li className="breadcrumb-item active">Add Executive</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>


            <div className="cardd daimnd-stall">
              <h2 className='mb-0'>Daimond Stall</h2>

              <div className='stall-gapp'>
                <div className='stal-ent'>
                  <div className="col-md-12">
                    <h5>Builder Team</h5>
                    <FaRegEdit onClick={handleTeamEdit} />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Builder</h5>
                  </div>
                  <div className="col-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=''
                        id="Builder"
                        name="name"
                        value={form.Builder.name || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      <label htmlFor="builder" className="fw-normal">
                        Name
                      </label>
                    </div>
                  </div>

                  <div className="col-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Builder"
                        name="phone"
                        value={form.Builder.phone || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      <label htmlFor="Builder" className="fw-normal">
                        Phone Number
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Manager</h5>
                  </div>
                  <div className="col-4 mb-3">
                    <div className='Editdata'>
                      <h4>Mohan Reddy</h4>
                    </div>
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Manager"
                        name="name"
                        value={form.Manager.name || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      <label htmlFor="Manager" className="fw-normal">Name</label>
                    </div>
                  </div>
                  <div className="col-4 mb-3">
                    <div className='Editdata'>
                      <h4>Mohan Reddy</h4>
                    </div>
                    <div className="form-floating">
                      <input
                        type="number"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Manager"
                        name="phone"
                        value={form.Manager.phone || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      <label htmlFor="total-no-of-floor-blocks" className="fw-normal">Phone Number</label>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Executives</h5>
                  </div>
                  {[...Array(form.Executive.length || 0)].map((_, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-md-12">
                        <h4>Executive {index + 1}</h4>
                      </div>
                      <div className="col-md-4">
                        <h6 className="BuildNameCom mb-2">Name :</h6>
                        <input
                          type="text"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          placeholder="Executive Name"
                          id={`Executive-${index + 1}`}
                          name="name"
                          value={form.Executive[index]?.name || ''}
                          onChange={handleForm}
                          disabled={!isTeamEdiTable}
                        />
                      </div>

                      <div className="col-md-4">
                        <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                        <input
                          type="text"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          placeholder="Executive Phone Number"
                          id={`executive-${index + 1}`}
                          name="phone"
                          value={form.Executive[index]?.phone || ''}
                          onChange={handleForm}
                          disabled={!isTeamEdiTable}
                        />
                      </div>
                    </div>
                  ))}


                  <div className="stal-ent">
                    <div className="col-md-12">
                      <h5>Stall Interior</h5>
                      <FaRegEdit onClick={handleIntiriorEdit} />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h5 className="mt-0">Video Screens</h5>
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Video 1</h6>
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          name="StallInteriorVideo1"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }

                      {form?.StallInteriorVideo1 !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form.StallInteriorVideo1} type="video/mp4" />
                          <track
                            src={form.StallInteriorVideo1}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Video 2</h6>
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className="form-control"
                          name="StallInteriorVideo2"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }

                      {form?.StallInteriorVideo2 !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form?.StallInteriorVideo2} type="video/mp4" />
                          <track
                            src={form?.StallInteriorVideo2}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h5 className="mt-0">Poster/Banners</h5>
                    </div>

                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 1</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerOne"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerOne !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerOne} />
                            </span>
                          </div>
                        }

                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 2</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerTwo"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerTwo !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerTwo} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 3</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerThree"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerThree !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerThree} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 4</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerFour"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerFour !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerFour} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 5</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerFive"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerFive !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerFive} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 6</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerSix"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {form.bannerSix !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerSix} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>

                  </div>

                  <div className="row mb-0">
                    <div className="col-md-12">
                      <h5 className="mt-0">Logo Video</h5>
                    </div>
                    <div className="col-md-4">
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className="form-control"
                          name="logoVideo"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }

                      {form.logoVideo !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form.logoVideo} />
                          <track
                            src={form.logoVideo}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>
                  </div>

                  <div className="stal-ent mb-4">
                    <div className="col-md-12">
                      <h5>Stall Entrance</h5>
                      <FaRegEdit onClick={handleExteriorEdit} />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Logo Upload</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="logo"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {form.logo !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.logo} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Builder Name</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="builderName"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {form.builderName !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.builderName} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Posters 1</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="posterOne"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {form.posterOne !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.posterOne} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Posters 2</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="posterTwo"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {form.posterTwo !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.posterTwo} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6">
                          <h6 className="BuildNameCom mb-2"> Exterior Video 1</h6>
                          {isExteriorEditTable &&
                            <input
                              type="file"
                              className="form-control"
                              name="exteriorVideo1"
                              accept="video/*"
                              onChange={handleVideos3}
                            />
                          }
                          {form.exteriorVideo1 !== undefined &&
                            <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                              <source src={form.exteriorVideo1} type="video/mp4" />
                              <track
                                src={form.exteriorVideo1}
                                kind="subtitles"
                                srcLang="en"
                                label="English"
                              />
                            </video>
                          }
                        </div>

                        <div className="col-md-6">
                          <h6 className="BuildNameCom mb-2">Exterior Video 2</h6>
                          {isExteriorEditTable &&
                            <input
                              type="file"
                              className="form-control"
                              name="exteriorVideo2"
                              accept="video/*"
                              onChange={handleVideos3}
                            />
                          }
                          {form.exteriorVideo2 !== undefined &&
                            <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                              <source src={form.exteriorVideo2} type="video/mp4" />
                              <track
                                src={form.exteriorVideo2}
                                kind="subtitles"
                                srcLang="en"
                                label="English"
                              />
                            </video>
                          }
                        </div>
                      </div>
                      <div className="col-md-5"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-subb mt-4">
                <button type="submit" className="sub-btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewStallDetails