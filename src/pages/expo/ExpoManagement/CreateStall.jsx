import React, { useState, useEffect } from 'react';
import { expoApiClient, expoAdminClient } from '../../../utils/httpClient';
import { handleImageGcs, handleBrochureGcs } from '../../../utils/GcsHandler';
import Loader from '../../../components/Loader';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const CreateStall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expoCode, stallCode, newStallId } = location.state || {};

  const stallType = typeof stallCode === 'string'
    ? stallCode.startsWith('D') ? 'Diamond'
      : stallCode.startsWith('P') ? 'Platinum'
        : stallCode.startsWith('G') ? 'Gold'
          : 'Standard'
    : 'Standard';


  const NumberOfExecutives = typeof stallCode === 'string'
    ? stallCode.startsWith('D') ? 6
      : stallCode.startsWith('P') ? 5
        : stallCode.startsWith('G') ? 4
          : 3
    : 3;



  useEffect(() => {
    if (expoCode === undefined || stallCode === undefined || newStallId === undefined) {
      console.log(expoCode, stallCode, newStallId);
      navigate('/futureExpo');
    }
  }, []);


  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    expoUnqCode: expoCode,
    stallUnqCode: stallCode,
    newStallId: newStallId,
    builder: {},
    manager: {},
    executives: [],
    projects: [
      {
        project_title: "",
        brochure_url: "",
      }
    ]
  });


  const [formError, setFormError] = useState({});

  const handleForm = (e, index) => {
    const { name, value, id } = e.target;

    if (index !== undefined) {
      setForm((prev) => ({
        ...prev,
        projects: prev.projects.map((project, i) =>
          i == index
            ? { ...project, [name]: value }
            : project
        )
      }));
    } else {
      setForm((prev) => {
        const updatedForm = { ...prev };

        if (id === 'builder') {
          updatedForm.builder = {
            ...updatedForm.builder,
            [name]: value
          };
        } else if (id === 'manager') {
          updatedForm.manager = {
            ...updatedForm.manager,
            [name]: value
          };
        } else if (id.startsWith('executive')) {
          const index = parseInt(id.split('-')[1], 10) - 1;
          const tableNo = id.split('-')[1];
          const updatedExecutives = [...updatedForm.executives];

          updatedExecutives[index] = {
            ...updatedExecutives[index],
            [name]: value,
            tableNo: tableNo
          };

          updatedForm.executives = updatedExecutives;
        }

        return updatedForm;
      });
    }

  };


  const handleBrochure = async (e, index) => {
    setLoading(true)
    let resFromMiddleware = await handleBrochureGcs(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        setForm((prevState) => ({
          ...prevState,
          projects: prevState.projects.map((project, i) =>
            i == index
              ? {
                ...project,
                brochure_url: resFromMiddleware.data?.pdf_image_urls,
              }
              : project
          )
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  }

  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImageGcs(e);
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

  const validate = () => {
    let isValid = true;
    const errors = {};

    // Validate builder details
    if (!form.builder.name) {
      errors.builderName = "Builder Name is required";
      isValid = false;
    }
    if (!form.builder.phone) {
      errors.builderPhone = "Builder Phone is required";
      isValid = false;
    }

    // Validate manager details
    if (!form.manager.name) {
      errors.managerName = "Manager Name is required";
      isValid = false;
    }
    if (!form.manager.phone) {
      errors.managerPhone = "Manager Phone is required";
      isValid = false;
    }

    // Validate banners and videos
    const requiredFields = ["video1", "video2", "bannerOne", "bannerTwo", "bannerThree", "bannerFour", "bannerFive", "bannerSix", "logoVideo", "logo", "builderName", "posterOne", "posterTwo", "exteriorVideo1", "exteriorVideo2"];
    requiredFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // Validate projects
    errors.projects = form.projects.map((project, index) => {
      let projectErrors = {};

      if (!project.project_title) {
        projectErrors.project_title = "Project title is required";
        isValid = false;
      }
      if (!project.brochure_url) {
        projectErrors.brochure_url = "Brochure URL is required";
        isValid = false;
      }
      return projectErrors;
    });

    setFormError(errors);
    return isValid;
  }



  const handleSubmit = async () => {
    if (validate()) {
      let res;
      setLoading(true);
      try {
        res = await expoApiClient.post('createStall/create.php', form);
        if (res?.status) {
          toastSuccess('Stall Was Created')
          setForm({
            expoUnqCode: expoCode,
            stallUnqCode: stallCode,
            newStallId: newStallId,
            builder: {},
            manager: {},
            executives: [],
            projects: [
              {
                project_title: "",
                brochure_url: "",
              }
            ]
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Please Enter Mandatory fields');
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
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: res?.data?.url }
                : project
            )
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            [e.target.name]: res?.data?.url
          }));
        }

      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    if (form.projects.length < 6) {
      setForm((prevForm) => ({
        ...prevForm,
        projects: [...prevForm.projects, {
          brochure_url: "",
          project_title: "",
        }]
      }));
    } else {
      toastError("Projects Length exceeded")
    }
  }

  function removeProject(index) {
    setForm((prevForm) => ({
      ...prevForm,
      projects: prevForm.projects.filter((_, i) => i !== index)
    }));
  }

  useEffect(() => {
    console.log('form', form);

  }, [])

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
              {stallType &&
                <h2 className="mb-0">{stallType} Stall</h2>
              }
              <div className="stall-gap">
                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Stall In Side</h5>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Builders</h5>
                  </div>

                  <div className="col-md-4 pr-5">
                    <h6 className="BuildNameCom mb-2">Name :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      id="builder"
                      name="name"
                      value={form?.builder.name || ''}
                      onChange={handleForm}
                    />
                    {formError.builderName && <p className="err">{formError.builderName}</p>}
                  </div>
                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      id="builder"
                      name="phone"
                      value={form?.builder.phone || ''}
                      onChange={handleForm}
                    />
                    {formError.builderPhone && <p className="err">{formError.builderPhone}</p>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Manager</h5>
                  </div>
                  <div className="col-md-4 pr-5">
                    <h6 className="BuildNameCom mb-2">Name :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      id="manager"
                      name="name"
                      value={form?.manager.name || ''}
                      onChange={handleForm}
                    />
                    {formError.managerName && <p className="err">{formError.managerName}</p>}
                  </div>
                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number "
                      id="manager"
                      name="phone"
                      value={form?.manager.phone || ''}
                      onChange={handleForm}
                    />
                    {formError.managerPhone && <p className="err">{formError.managerPhone}</p>}
                  </div>
                </div>

                <div className="col-md-12">
                  <h5>Executives</h5>
                </div>

                {[...Array(NumberOfExecutives)].map((_, index) => (
                  <div className="row mb-3" key={index}>
                    <div className="col-md-12">
                      <h4>Executive {index + 1}</h4>
                    </div>
                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Name :</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Executive Name"
                        id={`executive-${index + 1}`}
                        name="name"
                        value={form.executives[index]?.name || ''}
                        onChange={handleForm}
                      />
                      {/* {executiveErrors[index]?.name && <p className="err">{executiveErrors[index].name}</p>} */}
                    </div>
                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Executive Phone Number"
                        id={`executive-${index + 1}`}
                        name="phone"
                        value={form.executives[index]?.phone || ''}
                        onChange={handleForm}
                      />
                      {/* {executiveError[index]?.phone && <p className="err">{executiveError[index].company_name}</p>} */}
                    </div>
                  </div>
                ))}

                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Stall Interior</h5>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className="mt-0">Video Screens</h5>
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Video 1</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="video1"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.video1 && <p className="err">{formError.video1}</p>}
                    {form.video1 != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.video1} type="video/mp4" />
                        <track src={form.video1} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Video 2</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="video2"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.video2 && <p className="err">{formError.video2}</p>}
                    {form.video2 != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.video2} type="video/mp4" />
                        <track src={form.video2} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Poster/Banners</h5>
                  </div>

                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 1</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerOne"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerOne && <p className="err">{formError.bannerOne}</p>}
                    {form.bannerOne !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerOne} />
                      </span>
                    )}
                  </div>
                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 2</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerTwo"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerTwo && <p className="err">{formError.bannerTwo}</p>}
                    {form.bannerTwo !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerTwo} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 3</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerThree"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerThree && <p className="err">{formError.bannerThree}</p>}
                    {form.bannerThree !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerThree} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 4</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerFour"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerFour && <p className="err">{formError.bannerFour}</p>}
                    {form.bannerFour !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerFour} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 5</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerFive"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerFive && <p className="err">{formError.bannerFive}</p>}
                    {form.bannerFive !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerFive} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 6</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerSix"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerSix && <p className="err">{formError.bannerSix}</p>}
                    {form.bannerSix !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerSix} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Logo Video </h5>
                  </div>
                  <div className="col-md-6 mb-6">
                    <h6 className="BuildNameCom mb-2">Video</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="logoVideo"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.logoVideo && <p className="err">{formError.logoVideo}</p>}
                    {form.logoVideo != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.logoVideo} type="video/mp4" />
                        <track src={form.logoVideo} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>
                  <div className="col-md-6 mb-6"></div>
                </div>
              </div>

              <div className="stal-ent mb-4">
                <div className="col-md-12">
                  <h5>Stall Entrance</h5>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Logo Upload</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="logo"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.logo && <p className="err">{formError.logo}</p>}
                      {form.logo !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.logo} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Builder Name</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="builderName"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.builderName && (
                        <p className="err">{formError.builderName}</p>
                      )}
                      {form.builderName !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.builderName} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Posters 1</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="posterOne"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.posterOne && <p className="err">{formError.posterOne}</p>}
                      {form.posterOne !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.posterOne} />
                        </span>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Posters 2</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="posterTwo"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.posterTwo && <p className="err">{formError.video1}</p>}
                      {form.posterTwo !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.posterTwo} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6 className="BuildNameCom mb-2">Videos</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="exteriorVideo1"
                        onChange={handleVideos3}
                        accept="video/*"
                      />
                      {formError.exteriorVideo1 && <p className="err">{formError.exteriorVideo1}</p>}
                      {form.exteriorVideo1 != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.exteriorVideo1} type="video/mp4" />
                          <track
                            src={form.exteriorVideo1}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6 className="BuildNameCom mb-2">Videos</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="exteriorVideo2"
                        onChange={handleVideos3}
                        accept="video/*"
                      />
                      {formError.exteriorVideo2 && <p className="err">{formError.exteriorVideo2}</p>}
                      {form.exteriorVideo2 != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.exteriorVideo2} type="video/mp4" />
                          <track
                            src={form.exteriorVideo2}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5"></div>
                </div>
              </div>
              <div className='add_pr_out'>
                <div className="stal-ent mb-4">
                  <div className="col-md-12">
                    <h5>Add Project</h5>
                    <button onClick={addProject}>Add Project</button>
                  </div>
                </div>
                {form.projects.map((project, i) => (
                  <div className="row mt-4" key={i}>
                    <div className="d-flex align-center">
                      <h2>Project {i + 1}</h2>
                      {form.projects.length > 1 && i > 0 && (
                        <a onClick={() => removeProject(i)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}>
                          Remove
                        </a>
                      )}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Project Name :</h6>
                      <input
                        type="text"
                        className="form-control"
                        name="project_title"
                        placeholder='Project Name'
                        value={project.project_title || ""}
                        onChange={(e) => handleForm(e, i)}
                      />
                      {formError.projects?.[i]?.project_title && <span className="text-danger">{formError.projects[i].project_title}</span>}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Get Brochure :</h6>
                      {!project.brochure_url ? (
                        <>
                          <input type="file" className="form-control" name="brochure_url" onChange={(e) => handleBrochure(e, i)} />
                          {formError.projects?.[i]?.brochure_url && <span className="text-danger">{formError.projects[i].brochure_url}</span>}
                        </>
                      ) : (
                        <span className="upld_img">
                          <button href={project.brochure_url} target="_blank"> </button>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-subb mt-4">
                <button name="submit" className="sub-btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateStall;
