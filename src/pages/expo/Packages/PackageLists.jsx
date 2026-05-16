import React,{useState,useEffect} from 'react';
import Loader from '../../../components/Loader';
import { IoSearch } from "react-icons/io5";

const PackageLists = () => {
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
                  <li className="breadcrumb-item active">Package Lists</li>
                </ol>
              </div>

            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Package List</h3>
                <div className="mb-0 srch-cls">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Country, State, City"
                  />
                  <IoSearch />
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive-md">
                  <table className="table text-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City </th>
                        <th>Expo Type</th>
                        <th>Stall Type</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td> </td>
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
    </div>
  </div>
  )
}

export default PackageLists