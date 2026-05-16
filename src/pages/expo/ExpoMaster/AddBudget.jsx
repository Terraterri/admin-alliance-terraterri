import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';



const AddBudget = () => {

    const [show, setShow] = useState(false);


  return (
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
               <li className="breadcrumb-item active">Add Budget</li>
             </ol>
           </div>
           <div className="page-title-right">
             <button  className="btn btn-info" onClick={()=>setShow(true)}>
             Add Budget
             </button>
           </div>
         </div>
       </div>
     </div>
       
       <div className="row justify-content-center">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Add Budget</h3>
            
           </div>
           <div className="card-body">
             <div className="table-responsive-md">
             <table className="table text-nowrap mb-0">
                 <thead>
                   <tr>
                     <th>Country Wise</th>
                     <th>Budget</th>
                    
                   </tr>
                 </thead>
                 <tbody>
                      
             <tr >
                       <td>India</td>   
                       <td>Less than 20L</td>   
                     
            </tr>
             <tr >
                       <td>India</td>   
                       <td> 20L to 50L</td>   
                     
            </tr>
             <tr >
                       <td>Dubai</td>   
                       <td> 20L to 50L</td>   
                     
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
             <h3 className="card-title">Create Package</h3>
           </div>
           <div className="card-body">
             <form className="custom-validation">
               <div className="mb-3">
               <div className="form-floating">
                   
                   <select className='form-select'>
                    
                     <option>
                       Select Country
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
                   
                   <select className='form-select'>
                    
                     <option>
                       Select Budget
                     </option>
                     <option>
                     Less than 20L       
                     </option>
                     <option>
                     20L to 50L
                     </option>
                     <option>
                     50L to 1Cr
                     </option>
                     <option>
                     1Cr to 2Cr
                     </option>
                     <option>
                     2Cr to 5Cr
                     </option>
                     <option>
                     5Cr to 10Cr
                     </option>
                    
                   </select>
                       
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
  )
}

export default AddBudget