import React,{useState,useEffect} from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

const BuilderParticipati = () => {
 
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  
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
                       <li className="breadcrumb-item active">Builders Participated</li>
                     </ol>
                   </div>
                   {/* <div className="page-title-right">
                     <button className="btn btn-info">Add States</button>
                   </div> */}
                 </div>
               </div>
             </div>

<form className="custom-validation mb-3" action="#">
    <div className="row align-items-center">
        <div className="col-md-3 mt-3">
            <div className="">
                <div className="form-floating"><input type="date" id="from-date" className="form-control" name="fromdate" /><label
                        for="from-date" className="fw-normal">From Date</label></div>
            </div>
        </div>
        <div className="col-md-3 mt-3">
            <div className="">
                <div className="form-floating"><input type="date" id="to-date" className="form-control" name="todate" /><label
                        for="to-date" className="fw-normal">To Date</label></div>
            </div>
        </div>
        <div className="col-md-1 mt-3"><button className="btn btn-primary" type="submit">Search</button></div>
    </div>
</form>

             <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Builders Participated in Expo</h3>
               
              </div>
              <div className="card-body">
                <div className="table-responsive-md">
                  <table className="table text-nowrap mb-0">
                    <thead>
                      <tr>
                        
                        <th>Sponcers Stall</th>
                        <th>Builder Name</th>
                        <th>Stall Visitors</th>
                       

                      </tr>
                    </thead>
                    <tbody>
                   <tr>
                    <td>D1</td>
                    <td>Mohan Reddy</td>
                    <td><Button variant="primary" onClick={handleShow} className='listin_btn'>201</Button></td>
                   </tr>
                   <tr>
                    <td>P1</td>
                    <td>Mohan Reddy</td>
                    <td><Button variant="primary" onClick={handleShow} className='listin_btn'>201</Button></td>
                   </tr>
                   <tr>
          
                    <td>P2</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>G1</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>G2</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>G3</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>G4</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td><b>Standard Stall</b></td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>S1</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>S2</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>S3</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                   <tr>
                    <td>S4</td>
                    <td>Mohan Reddy</td>
                    <td>201</td>
                   </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

          
        
           </div>
         </div>
  
         <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Stall Visitors</h3>
                 
                </div>
                <div className="card-body">
                  <div className="table-responsive-md">
                    <table className="table text-nowrap mb-0">
                      <thead>
                        <tr>
                          
                          <th>S.no</th>
                          <th>Visitor Name</th>
                          <th>Mobile Number</th>
                          <th>Email Id</th>
                          <th>Excutive</th>
                          <th>Activity</th>
                         
  
                        </tr>
                      </thead>
                      <tbody>
                     <tr>
                      <td>1</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                     </tr>
                     <tr>
                      <td>2</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                     </tr>
                   
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

  </div>
        </Modal>
       </div>
    )
}

export default BuilderParticipati