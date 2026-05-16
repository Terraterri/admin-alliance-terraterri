import React from 'react'



const LayoutView = () => {
  return (
    <div className="main-content">
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 homeBox">
           
               <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Layout View</li>
                  </ol>
                </div>
                {/* <div className="page-title-right">
                  <button className="btn btn-info">Add States</button>
                </div> */}
              </div>
            </div>
          </div>

        
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LayoutView