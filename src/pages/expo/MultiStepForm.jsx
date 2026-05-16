import React from 'react';
import MultiStep from 'react-multistep';
import Recept from './Recept';
import Exteriorbranding from './Exteriorbranding';
import Interiorbranding from './Interiorbranding';
import Expo from './Expo';

const MultiStepForm = () => {
  const steps = [
    { title: 'Create Expo', component: <Expo /> },
    { title: 'Create Reception', component: <Recept /> },
    { title: 'Interior Branding', component: <Interiorbranding /> }
  ];

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
                      <li className="breadcrumb-item active">Create Expo</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="cardd">
              <div className="row">
                <div className="col-md-12 ">
                  <div className='multistep_out'>
                    <MultiStep
                      activeStep={0} prevButton={'Previous'} nextButton={'Next'} steps={steps}>
                      <Expo title="Create Expo" />
                      <Recept title="Reception" />
                      <Interiorbranding title="Expo Arena" />
                    </MultiStep>
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
