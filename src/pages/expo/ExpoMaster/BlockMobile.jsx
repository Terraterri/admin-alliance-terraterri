import React, { useState, useEffect, useCallback } from 'react'
import Loader from '../../../components/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError } from '../../../utils/toast';
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Pagenation from '../../../utils/Pagenation';

const BlockMobile = () => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [form, setForm] = useState({});
    const [formErr, setFormErr] = useState({});
    const [blockedNumbers, setBlockedNumbers] = useState([]);
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

    useEffect(() => {
        fetchBlockedNumbers()
    }, [])

    const validate = () => {
        let error = true;
        let allErr = {};

        if (!form.phoneNumber) {
            error = false;
            allErr.phoneNumber = 'Mobile number is mandatory';
        }

        setFormErr(allErr);
        return error;
    };

    const submitNumber = async () => {
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
                    res = await expoAdminClient.put(`expoUsersRestriction/update.php`, form, config);
                } else {
                    res = await expoAdminClient.post(`expoUsersRestriction/create.php`, form, config);
                }

                if (res?.data?.status) {
                    setShow(false);
                    fetchBlockedNumbers();
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
            phoneNumber: data?.number,
            id: data?.id
        });
        setUpdate(true);
        setShow(true);
    };

    const fetchBlockedNumbers = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const url = `expoUsersRestriction/get.php?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}&search=${searchTerm}`;
            const res = await expoAdminClient.get(url, config);

            if (res?.data?.status) {
                setBlockedNumbers(res.data.data || []);
                setTotalPages(Math.ceil(res.data.count / itemsPerPage));
            }
        } catch (err) {
            toastError('Failed to fetch expo types');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteNumber = async (id) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const res = await expoAdminClient.post(`expoUsersRestriction/delete.php?id=${id}`, {}, config);
            if (res?.data?.status) {
                toastSuccess(res?.data?.message);
                fetchBlockedNumbers();
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
                                            <li className="breadcrumb-item active">Blocked Numbers</li>
                                        </ol>
                                    </div>
                                    <div className="page-title-right">
                                        <button className="btn btn-info" onClick={() => setShow(true)}>
                                            Block Number
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Number</h3>
                                        <div className="mb-0 srch-cls">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by Number"
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
                                                        <th>S.no</th>
                                                        {/* <th>User Name</th> */}
                                                        <th>Phone Number</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {blockedNumbers.length > 0 ? (
                                                        blockedNumbers.map((type, index) => (
                                                            <tr key={index}>
                                                                <td className="align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                                <td className="align-middle">{type.number}</td>
                                                                <td className="table-icons">
                                                                    <div className="d-flex icons">
                                                                        <MdDelete
                                                                            className='delete-ic'
                                                                            onClick={() => deleteNumber(type.id)}
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
                                                            <td colSpan="4" className="text-center">No Blocked Numbers found</td>
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
                        <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>{update ? 'Edit' : 'Block'} Number</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="card">
                                    <div className="card-body">
                                        <form className="custom-validation">
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${formErr.phoneNumber ? 'is-invalid' : ''}`}
                                                        name="phoneNumber"
                                                        onChange={onChange}
                                                        value={form?.phoneNumber || ''}
                                                        placeholder="Type Number"
                                                    />
                                                    <label htmlFor="project-type" className="fw-normal">
                                                        Mobile Number
                                                    </label>
                                                    {formErr.phoneNumber && <div className="invalid-feedback">{formErr.phoneNumber}</div>}
                                                </div>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={submitNumber}
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

export default BlockMobile
