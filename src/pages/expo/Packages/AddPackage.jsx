import React, { useState, useEffect } from 'react';
// import Loader from '../../../components/Loader';

const AddPackage = () => {
  return (
    // {loading && <Loader/>}
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
                    <li className="breadcrumb-item active">Add Package</li>
                  </ol>
                </div>
                {/* <div className="page-title-right">
                    <button className="btn btn-info">Add States</button>
                  </div> */}
              </div>
            </div>
          </div>

          <div className="cardd">
          <h6 className="createHead mb-4">Create Package : </h6>
            <div className="row">
              <div className="col-md-12 ">
                <form>
                  {/* <h1>{formState.expo}</h1> */}
                  {/* <h6 className="createHead mb-4">Create Expo : </h6> */}
                  <div className="row">
                    <div class="col-md-4">
                      <label class="BuildName">Country</label>
                      <select class="form-select" name="country_code" required="">
                        <option value="default">Select Country</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="BuildName">State</label>
                      <select class="form-select" name="country_code" required="">
                        <option value="default">Select State</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="BuildName">Country</label>
                      <select class="form-select" name="country_code" required="">
                        <option value="default">Select City</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="BuildName">Expo Type</label>
                      <select class="form-select" name="country_code" required="">
                        <option value="default">Select Expo</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="BuildName">Stall Type</label>
                      <select class="form-select" name="country_code" required="">
                        <option value="default">Select Expo</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="BuildName">Amount</label>
                      <input type='text' name='amount' className='form-control' />
                    </div>
                    <div class="col-md-4 mt-4">
                      
                      <button >Submit</button>
                    </div>
                  </div>

                  {/* <div className="row">
  <div className="btn-subb mb-5">
    <button type="button" className="save" >
      Save
    </button>
  </div>
</div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
