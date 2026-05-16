import React, { useState,useEffect } from "react";
import axios from "axios";
import { fetchImages } from '../../../utils/httpClient';

const AddImage = () => {
    const [Image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [imagess, setImagess] = useState([]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Image) {
            setMessage('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', Image);

        try {
            const response = await axios.post('http://localhost/tt-expo-admin-be/expoBannerImage/imageUpload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Upload failed. Please try again.');
        }
    };

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetch('http://localhost/tt-expo-admin-be/expoBannerImage/list_uploads.php');
                const data = await response.json();
                console.log(data); // Check the format here
                setImagess(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        loadImages();
    }, []);


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
                                    <button className="btn btn-info" onClick={() => setShow(true)}>
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
                                                    {imagess.map((img, index) => (
                                                        <img key={index} src={`${img}`} alt={`Uploaded ${index}`} />
                                                    ))}
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


                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Create Package</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Upload Image:</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} />
                                </div>
                                <button type="submit">Submit</button>
                                <p>{message}</p>
                            </form>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    )
}
export default AddImage