import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';

import { BsShop } from "react-icons/bs";

const GoldStall = () => {

    

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
               <li className="breadcrumb-item active">Add Gold Stall</li>
             </ol>
           </div>
       
         </div>
       </div>
     </div>
     <div className="cardd daimnd-stall">
      <h2 className='mb-0'>Gold Stall</h2>

<div className='stal-ent mb-5'>
      <div className="col-md-12">
          <h5>Stall Entrance</h5>
          </div>
     <div className="row mb-3">
 
          <div className="col-md-7">
           <div className='row'>
           <div className='col-md-6 mb-3'>
           <h6 className="BuildNameCom mb-2">Logo Upload</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
           </div>
           <div className='col-md-6 mb-3'>
           <h6 className="BuildNameCom mb-2">Builder Name</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
           </div>
           <div className="col-md-6 mb-3">
            <h6 className="BuildNameCom mb-2">Posters 1</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>

          <div className="col-md-6 mb-3">
            <h6 className="BuildNameCom mb-2">Posters 2</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-12">
            <h6 className="BuildNameCom mb-2">Videos</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          </div>
          <div className="col-md-5">
           
          </div>
</div>
 

        </div>
</div>

<div className='stall-gap'>
<div className='stal-ent'>
      <div className="col-md-12">
          <h5>Stall In Side</h5>
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
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
       
     <div className="row mb-3">
     <div className="col-md-12">
          <h5>Executives</h5>
          </div>
          <div className="col-md-12">
            <h4>Executive 1</h4>
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
   
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 2</h4>
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 3</h4>
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
   
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 4</h4>
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>


    <div className="row mb-3">
          <div className="col-md-12">
          <h5>Video Screens</h5>
          </div>

         
          <div className="col-md-4">
            <h6 className="BuildNameCom mb-2">Video 1</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4">
          <h6 className="BuildNameCom mb-2">Video 2</h6>
            <input
              type="file"
              className="form-control"
              placeholder="Enter Phone Number "
            />
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
              placeholder=" Name"
            />
          </div>
          <div className="col-md-4 mb-4">
          <h6 className="BuildNameCom mb-2">Banner 2</h6>
            <input
              type="file"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
          
          <div className="col-md-4 mb-4">
          <h6 className="BuildNameCom mb-2">Banner 3</h6>
            <input
              type="file"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>

          <div className="col-md-4">
          <h6 className="BuildNameCom mb-2">Banner 4</h6>
            <input
              type="file"
              className="form-control"
              placeholder="Enter Phone Number "
            />
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
    
            />
          </div>
          <div className="col-md-6 mb-6">
          
          </div>
          
        
    </div>

    </div>
        {/* <h2>Terraterri Reception Branding</h2>
     <div className="row mb-4">
          <div className="col-md-12">
            <h4>Receptionist 1</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Receptionist 2</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
     </div>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Terraterri Brand Video</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Brand Video</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
      
     </div>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Terraterri Sponcer Videos</h4>
          </div>
          <div className="col-md-2">
            <h6 className="BuildNameCom mb-2">Sponcer Videos 1</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-2">
          <h6 className="BuildNameCom mb-2">Sponcer Videos 2</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-2">
          <h6 className="BuildNameCom mb-2">Sponcer Videos 3</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-2">
          <h6 className="BuildNameCom mb-2">Sponcer Videos 4</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
      
          <div className="col-md-2">
          <h6 className="BuildNameCom mb-2">Sponcer Videos 5</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-2">
          <h6 className="BuildNameCom mb-2">Sponcer Videos 6</h6>
            <input
              type="file"
              className="form-control"
              placeholder=" Name"
            />
          </div>
     </div> */}



        {/* <h2>Gold Stall</h2>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 1</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
   
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 2</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>

     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 3</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
        
     <div className="row mb-5">
          <div className="col-md-12">
            <h4>Receptionist</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>


        <h2>Platinum Stall</h2>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 1</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
   
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 2</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Executive 3</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div>
   
   
     <div className="row mb-3">
          <div className="col-md-12">
            <h4>Receptionist</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div> */}
{/* 
                    <div className="row mt-4">
          <div className="col-md-12">
            <h4 className="mb-2">Executive 2</h4>
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Name :</h6>
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
            />
          </div>
          <div className="col-md-6">
            <h6 className="BuildNameCom mb-2">Phone Number :</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number "
            />
          </div>
        </div> */}
{/* 
         <div className="row mt-4">
          <div className="col-md-6">
          <div className="col-md-12">
            <h4 className="mb-2">Create Stall</h4>
          </div>
          <div className="col-md-12 mb-3">
            <h6 className="BuildNameCom mb-2">A, Center Video</h6>
            <input type="file" id="myFile" name="filename" />
          </div>
          <div className="col-md-12 mb-3">
            <h6 className="BuildNameCom mb-2">B, Facia</h6>
            <input
              type="text"
              className="form-control"
            />
          </div>
          <div className="col-md-12">
            <h6 className="BuildNameCom mb-2">C) Table Logo</h6>
            <input type="file" id="myFile" name="filename" />
          </div>
        </div>

        <div className="col-md-6">
        <div className="shop-icon"> <BsShop /> </div>
        </div>
        </div>  */}
                   



<div className="button-subb mt-4">
          <button type="submit" className="sub-btn1">
            Submit
          </button>
        </div>
                  </div>
   


    
     </div>
   </div>
 </div>
  )
}

export default GoldStall