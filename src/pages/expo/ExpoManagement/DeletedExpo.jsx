import { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import { expoAdminClient } from '../../../utils/httpClient';
import { toastSuccess, toastError } from '../../../utils/toast';
import { Link } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { IoReload } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import Pagenation from '../../../utils/Pagenation';

const DeletedExpo = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expos, setExpos] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedExpo, setSelectedExpo] = useState({});
    const [expoStallsDetails, setExpoStallDetails] = useState({});
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [expoStallBookings, setExpoStallBookings] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Pagination state
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const allStalls = [
        "D1",
        "P1", "P2",
        "G1", "G2", "G3", "G4",
        ...Array.from({ length: 20 }, (_, i) => `S${i + 1}`)
    ];

    const goToAddExecutive = (expoCode, stallCode, newStallId) => {
        navigate("/stall/create", {
            state: { expoCode: expoCode, stallCode: stallCode, newStallId: newStallId }
        });
    };


    const handleClose = () => setShow(false);

    const fetchExpos = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const url = `NewExpo/getDeleted.php?limit=${itemsPerPage}&skip=${(currentPage - 1)}`;
            const res = await expoAdminClient.get(url, config);

            if (res?.data?.status) {
                setExpos(res.data.data || []);
                setFilteredData(res.data.data || []);
                setTotalPages(Math.ceil(res.data.count / itemsPerPage));
            }
        } catch (err) {
            toastError('Failed to fetch expos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, [currentPage]);

    const deleteExpo = async (expoId) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
                }
            };

            const res = await expoAdminClient.delete(`NewExpo/delete.php?newExpoId=${expoId}`, config);
            if (res?.data?.status) {
                toastSuccess(res.data.message);
                fetchExpos();
            }
        } catch (e) {
            toastError('Failed to delete expo');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const selectExpo = async (expo) => {
        try {
            setLoading(true);
            setSelectedExpo(expo)
            setExpoStallBookings([]);
            const parsedStalls = JSON.parse(expo.stalls || "{}");
            setExpoStallDetails(parsedStalls);

            const res = await expoAdminClient.get(
                `NewExpo/getExpoBookings.php?id=${expo.expoUnqCode}&limit=${itemsPerPage}&skip=${currentPage - 1}`
            );

            if (res?.data?.status) {
                setExpoStallBookings(res.data.data || []);
            }
            setShow(true);
        } catch (e) {
            toastError('Failed to fetch stall bookings');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleExploreClick = () => {
        let filtered = [...expos];

        if (selectedCountry) {
            filtered = filtered.filter((expo) => expo.expoCountry === selectedCountry);
        }

        if (selectedCity) {
            filtered = filtered.filter((expo) => expo.expoCity === selectedCity);
        }

        if (selectedType) {
            filtered = filtered.filter((expo) => expo.expoType === selectedType);
        }

        setFilteredData(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page on new filter
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
                                            <li className="breadcrumb-item active">Deleted Expos</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row align-items-center w-100">
                                            <div className="col-md-4">
                                                <h3 className="card-title">Future Expo</h3>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="mb-0 d-flex">
                                                    <select
                                                        className="form-select ml-2 p-0 ps-1"
                                                        value={selectedCountry}
                                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                                    >
                                                        <option value="">Select Country</option>
                                                        {[...new Set(expos.map((expo) => expo.expoCountry))].map((country, index) => (
                                                            <option key={index} value={country}>{country}</option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        className="form-select ml-2 p-0 ps-1"
                                                        value={selectedCity}
                                                        onChange={(e) => setSelectedCity(e.target.value)}
                                                    >
                                                        <option value="">Select City</option>
                                                        {[...new Set(
                                                            expos.filter((expo) => expo.expoCountry === selectedCountry)
                                                                .map((expo) => expo.expoCity)
                                                        )].map((city, index) => (
                                                            <option key={index} value={city}>{city}</option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        className="form-select ml-2 p-0 ps-1"
                                                        value={selectedType}
                                                        onChange={(e) => setSelectedType(e.target.value)}
                                                    >
                                                        <option value="">Select Solution Type</option>
                                                        {[...new Set(expos.map((expo) => expo.expoType))].map((type, index) => (
                                                            <option key={index} value={type}>{type}</option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        onClick={handleExploreClick}
                                                        className="btn btn-primary ml-2 p-0 ps-1 pe-2"
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body expo_reg_out">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Expo Code</th>
                                                        <th>City</th>
                                                        <th>Date From</th>
                                                        <th>Date To</th>
                                                        <th>Expo Type</th>
                                                        <th>Availability</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredData.length > 0 ? (
                                                        filteredData.map((expo, index) => (
                                                            <tr key={index}>
                                                                <td className="align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                                <td className="align-middle">
                                                                    <span className='exp-cde'>{expo.expoUnqCode}</span>
                                                                    <ul className='d-flex'>
                                                                        <li><Link to={`/visitors-summary/${expo.expoUnqCode}`}>Visitors</Link></li>
                                                                        <li>
                                                                            <Link to={`/visitors-by-expo/${expo.expoUnqCode}`}>
                                                                                Visitor Registrations
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td className="align-middle">{expo.expoCity}</td>
                                                                <td className="align-middle">
                                                                    {moment(expo.fromDate).format("DD/MM/YYYY")}
                                                                </td>
                                                                <td className="align-middle">
                                                                    {moment(expo.toDate).format("DD/MM/YYYY")}
                                                                </td>
                                                                <td className="align-middle">{expo.expoType}</td>
                                                                <td className="align-middle">
                                                                    <a
                                                                        onClick={() => selectExpo(expo)}
                                                                        className='text-center primary'
                                                                    >
                                                                        View
                                                                    </a>
                                                                </td>
                                                                <td className="table-icons">
                                                                    <div className="d-flex icons">
                                                                        <IoReload />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className="text-center">No expos found</td>
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

                        {/* Stall Details Modal */}
                        <Modal show={show} onHide={handleClose} className="stall_popup">
                            <Modal.Header closeButton>
                                <div className='row w-100 '>
                                    <div className='col-md-6'>
                                        <h3>Expo Id: {selectedExpo?.expoUnqCode}</h3>
                                        <h5>Expo Date: {moment(selectedExpo.fromDate).format("DD/MM/YYYY")}</h5>
                                    </div>
                                    <div className='col-md-6 d-flex align-items-center'>
                                        <div className='paymet_bloo'>
                                            <h3>Stall Booking Details</h3>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Header>

                            <div className="py-3 px-5">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='text-center map_outt'>
                                            <img src="/assets/images/routemap.png" />
                                            <div className='d-stall'>
                                                <button
                                                    className={expoStallsDetails["D1"] ? "booked" : ""}
                                                >
                                                    D
                                                </button>
                                            </div>

                                            <div className='p-stall'>
                                                {['P1', 'P2'].map((stall, index) => (
                                                    <button
                                                        key={index}
                                                        className={`${stall.toLowerCase()} ${expoStallsDetails[stall] ? "booked cursor-notallowed" : ""}`}
                                                    >
                                                        {stall}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="g-stall">
                                                {["G1", "G2", "G3", "G4"].map((stall, index) => (
                                                    <button
                                                        key={index}
                                                        className={`${stall.toLowerCase()} ${expoStallsDetails[stall] ? "booked cursor-notallowed" : ""}`}
                                                    >
                                                        {stall}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="s-stall">
                                                {Array.from({ length: 20 }, (_, i) => {
                                                    const stallKey = `S${i + 1}`;
                                                    let className = `s${i + 1}`;
                                                    if (expoStallsDetails[stallKey]) {
                                                        className += " booked cursor-notallowed";
                                                    }
                                                    return (
                                                        <button
                                                            key={stallKey}
                                                            className={className}
                                                        >
                                                            {stallKey}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className='clr_bars row mt-2 align-items-center'>
                                            <div className='col-md-4'>
                                                <ul className='mb-0 p-0'>
                                                    <li><span className='avlb'></span> Available</li>
                                                    <li><span className='selt'></span> Selected</li>
                                                    <li><span className='bookd'></span> Booked</li>
                                                </ul>
                                            </div>
                                            <div className='col-md-4'>
                                                <ul className='mb-0 p-0'>
                                                    <li className='dimnr-clr'>
                                                        <me className='mr-3'>D1 </me> : Daimond Stall
                                                    </li>
                                                    <li className='pltnm-clr'> P1 & P2 : Platinum Stall</li>
                                                </ul>
                                            </div>
                                            <div className='col-md-4'>
                                                <ul className='mb-0 p-0'>
                                                    <li className='gld-clr'> G1 - G4 : Gold Stall</li>
                                                    <li className='stnd-clr'> S1 - S20 : Standard Stall</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='paymet_blo'>
                                            <div className='pay-card1 mb-2'>
                                                <ul className='mb-0 p-0 list-unstyled'>
                                                    {allStalls.length > 0 ?
                                                        allStalls?.map((stall, index) => {
                                                            const isBooked = expoStallsDetails[stall];
                                                            const booking = expoStallBookings.find(stl => stl.stallUnqCode === stall);
                                                            return (
                                                                <li
                                                                    key={index}
                                                                    className={`stall-box d-flex text-align-center ${stall.toLowerCase()} ${isBooked ? "booked cursor-notallowed" : ""}`}
                                                                >
                                                                    <span className="stal_ide">{stall}:</span>
                                                                    <div>
                                                                        <span>{booking?.builderName || "-"}</span>
                                                                        {isBooked && (
                                                                            booking?.stallInfoId ?
                                                                                <Link to={`/stall/${booking?.stallInfoId}`} className="edit_ot cursor-pointer" ><FaRegEye /></Link>
                                                                                :
                                                                                <span onClick={() => goToAddExecutive(selectedExpo?.expoUnqCode, stall, booking?.newStallId)} className="edit_ot cursor-pointer" ><FaRegEye /></span>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                        :
                                                        <li className='text-center'>No Stall Bookings</li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeletedExpo;