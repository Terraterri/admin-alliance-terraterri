import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { GoEye } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";

const SponcerManagement = () => {

    const [show, setShow] = useState(false);

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
               <li className="breadcrumb-item active">Sponcer Management</li>
             </ol>
           </div>
           <div className="page-title-right">
             <button  className="btn btn-info" onClick={()=>setShow(true)}>
             Add Sponcer
             </button>
           </div>
         </div>
       </div>
     </div>
       
       <div className="row justify-content-center">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Sponcer Management</h3>
             
           </div>
           <div className="card-body">
             <div className="table-responsive-md">
             <table className="table text-nowrap mb-0">
                 <thead>
                   <tr>
                     <th>S.No</th>
                     <th>Company Name</th>
                     <th>Sponcer Type</th>
                     <th>Logo</th>
                   
                   
                   </tr>
                 </thead>
                 <tbody>
                      
             <tr >
                       <td>1</td>   
                       <td>INHYDJAN08-2024</td>   
                       <td>Residential</td>   
                       <td>Hyderabad</td>   
                      
           </tr>
            
        
                    
           
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>

     <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
       <Offcanvas.Header closeButton></Offcanvas.Header>
       <Offcanvas.Body>
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Add Sponcer</h3>
           </div>
           <div className="card-body">
             <form className="custom-validation">
               <div className="mb-3">
               <div className="form-floating">
               <div className="mb-3">
                 <div className="form-floating">
                     <input
                       type="text"
                     
                       className="form-control"
                       name="amount"
                           placeholder="Amount "
                    
                     />
                     <label for="project-type" className="fw-normal">
                       Name
                         </label>
                         
                   </div>
                 </div>
                   <select className='form-select'>
                    
                     <option>
                       Select Sponcer Type
                     </option>
                     <option>
                       India
                     </option>
                     <option>
                       Dubai 
                     </option>
                     <option>
                       Australia 
                     </option>
                     <option>
                       England 
                     </option>
                   </select>
                       
                 </div>
               </div>
               <div className="mb-3">
              
               <div className="form-floating">
               <div className="mb-3">
                 <div className="form-floating">
                     <input
                       type="file"
                     
                       className="form-control"
                       name="amount"
                           placeholder="Amount "
                    
                     />
                     <label for="project-type" className="fw-normal">
                       Upload Logo
                         </label>
                         
                   </div>
                 </div>
                   
                 </div>
                 
               </div>
             
               
               <div className="col-12">
                 <button className="btn btn-primary" type="button" >
                   Submit
                 </button>
               </div>
             </form>
           </div>
         </div>
       </Offcanvas.Body>
     </Offcanvas>
    
     </div>
   </div>
 </div>
   </>
  )
}

export default SponcerManagement