import React, { useState, useEffect, useCallback } from 'react'
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError } from '../../../utils/toast';
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Pagenation from '../../../utils/Pagenation';
const Source = () => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [form, setForm] = useState({});
    const [formErr, setFormErr] = useState({});
    const [sources, setSources] = useState([]);
    const [update, setUpdate] = useState(false);

    // Pagination state
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onChange = useCallback((e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    });

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    });

    const validate = () => {
        let error = true;
        let allErr = {};

        if (!form.code) {
            error = false;
            allErr.code = 'Type code is mandatory';
        }

        if (!form.name) {
            error = false;
            allErr.name = 'Expo type is mandatory';
        }

        setFormErr(allErr);
        return error;
    };

    const submitSource = async () => {
        if (validate()) {
            try {
                let res = null;
                setLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                    }
                };

                if (update) {
                    res = await expoAdminClient.put(`sources/update.php`, form, config);
                } else {
                    res = await expoAdminClient.post(`sources/create.php`, form, config);
                }

                if (res?.data?.status) {
                    setShow(false);
                    fetchSources();
                    toastSuccess(res?.data?.message);
                    setForm({});
                    setFormErr({});
                    setUpdate(false);
                }
            } catch (e) {
                toastError('Failed to save expo type');
                console.error(e);
            } finally {
                setLoading(false);
            }
        } else {
            toastError('Please check the mandatory fields');
        }
    };

    const editSource = (data) => {
        setForm({
            code: data?.code,
            name: data?.name,
            id: data?.newSourceId
        });
        setUpdate(true);
        setShow(true);
    };

    const fetchSources = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const url = `sources/get.php?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}&search=${searchTerm}`;
            const res = await expoAdminClient.get(url, config);

            if (res?.data?.status) {
                setSources(res.data.data || []);
                setTotalPages(Math.ceil(res.data.count / itemsPerPage));
            }
        } catch (err) {
            toastError('Failed to fetch expo types');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSources();
    }, [currentPage, searchTerm]);

    const deleteType = async (id) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const res = await expoAdminClient.post(`sources/delete.php?id=${id}`, {}, config);
            if (res?.data?.status) {
                toastSuccess(res?.data?.message);
                fetchSources();
            }
        } catch (e) {
            toastError('Failed to delete expo type');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && <Loader />}
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
                                            <li className="breadcrumb-item active">Sources</li>
                                        </ol>
                                    </div>
                                    <div className="page-title-right">
                                        <button className="btn btn-info" onClick={() => { setShow(true); setForm({}); setUpdate(false); setFormErr({}); }}>
                                            Add Source
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Sources</h3>
                                        <div className="mb-0 srch-cls">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by Type Code or Name"
                                                value={searchTerm}
                                                onChange={handleSearch}
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
                                                        <th>Source Code</th>
                                                        <th>Source Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sources.length > 0 ? (
                                                        sources.map((type, index) => (
                                                            <tr key={index}>
                                                                <td className="align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                                <td className="align-middle">{type.code}</td>
                                                                <td className="align-middle">{type.name}</td>
                                                                <td className="table-icons">
                                                                    <div className="d-flex icons">
                                                                        <MdDelete
                                                                            className='delete-ic'
                                                                            onClick={() => deleteType(type.newSourceId)}
                                                                        />
                                                                        <FaRegEdit
                                                                            onClick={() => editSource(type)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No Sources  found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <Pagenation
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalPages={totalPages}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add/Edit Expo Type Offcanvas */}
                        <Offcanvas show={show} onHide={() => { setShow(false); setForm({}); setUpdate(false); setFormErr({}); }} placement="end">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>{update ? 'Edit' : 'Add'} Source</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="card">
                                    <div className="card-body">
                                        <form className="custom-validation">
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErr.code ? 'is-invalid' : ''}`}
                                                        name="code"
                                                        placeholder="Type Code"
                                                        onChange={onChange}
                                                        value={form?.code || ''}
                                                    />
                                                    <label htmlFor="project-type" className="fw-normal">
                                                        Source Code
                                                    </label>
                                                    {formErr.code && <div className="invalid-feedback">{formErr.code}</div>}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErr.name ? 'is-invalid' : ''}`}
                                                        name="name"
                                                        onChange={onChange}
                                                        value={form?.name || ''}
                                                        placeholder="Type Name"
                                                    />
                                                    <label htmlFor="project-type" className="fw-normal">
                                                        Source Name
                                                    </label>
                                                    {formErr.name && <div className="invalid-feedback">{formErr.name}</div>}
                                                </div>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={submitSource}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Processing...' : 'Save'}
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

export default Source
