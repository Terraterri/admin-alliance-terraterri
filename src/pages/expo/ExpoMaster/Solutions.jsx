import React, { useState } from 'react';
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toastSuccess, toastError } from '../../../utils/toast';
import axios from 'axios';

const Solutions = () => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: null,
    });
    const [formErr, setFormErr] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false); // Added loader state

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file upload
    const handleImage = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, image: file }));

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!form.title) errors.title = 'Title is required.';
        if (!form.description) errors.description = 'Description is required.';
        if (!form.image) errors.image = 'Image is required.';
        setFormErr(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        setLoading(true); // Show loader during API call
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('image', form.image);
    
            // Log formData content
            console.log('Form Data:');
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });
    
            await axios.post('http://localhost/tt-expo-admin-be/solutions/create.php', formData);
    
            toastSuccess('Banner created successfully!');
            setShow(false);
            setForm({ title: '', description: '', image: null });
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating banner:', error);
            toastError('Failed to create banner.');
        } finally {
            setLoading(false); // Hide loader
        }
    };
    

    return (
        <>
            {loading && <Loader />} {/* Loader display */}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        {/* Page Header */}
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item">
                                                <a href="/">Home</a>
                                            </li>
                                            <li className="breadcrumb-item active">Create Expo Banner Image</li>
                                        </ol>
                                    </div>
                                    <div className="page-title-right">
                                        <button className="btn btn-info" onClick={() => setShow(true)}>
                                            Create Banner Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Create Expo Banner Image</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>S.no</th>
                                                        <th>Country</th>
                                                        <th>City</th>
                                                        <th>Expo Type</th>
                                                        <th>Guest Country</th>
                                                        <th>Guest City</th>
                                                        <th>Image</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Dynamic Rows */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Offcanvas Form */}
                        <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                            <Offcanvas.Header closeButton></Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Create Banner Image</h3>
                                    </div>
                                    <div className="card-body">
                                        <form className="custom-validation" onSubmit={handleSubmit}>
                                            {/* Title Input */}
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    placeholder="Title"
                                                    onChange={handleChange}
                                                    value={form.title}
                                                />
                                                {formErr.title && <p className="err">{formErr.title}</p>}
                                            </div>

                                            {/* Description Editor */}
                                            <div className="mb-3">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={form.description}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setForm((prev) => ({ ...prev, description: data }));
                                                    }}
                                                />
                                                {formErr.description && <p className="err">{formErr.description}</p>}
                                            </div>

                                            {/* Image Upload */}
                                            <div className="mb-3">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="image"
                                                    onChange={handleImage}
                                                />
                                                {formErr.image && <p className="err">{formErr.image}</p>}
                                                {imagePreview && (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Selected"
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                    />
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button className="btn btn-primary" type="submit">
                                                Save
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Solutions;
