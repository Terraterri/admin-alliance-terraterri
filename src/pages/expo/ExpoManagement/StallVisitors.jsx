
import { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { MdWhatsapp } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { FaFileDownload } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { expoAdminClient } from '../../../utils/httpClient';
import { toastError } from '../../../utils/toast';
import Pagenation from '../../../utils/Pagenation';
const StallVisitors = () => {

    const [show, setShow] = useState(false);
    const [WhatsappShow, setWhatsappShow] = useState(false);
    const [EnquiryShow, setEnquiryShow] = useState(false);
    const [CommentShow, setCommentShow] = useState(false);
    const [DropMessageShow, setDropMessageShow] = useState(false);

    const handleClose = () => { setShow(false); setWhatsappShow(false); setEnquiryShow(false); setCommentShow(false); setDropMessageShow(false); }

    const handleShow = () => setShow(true);
    const handleWhatsapp = () => setWhatsappShow(true);

    const [loading, setLoading] = useState(false);
    const [expoVisitors, setExpoVisitors] = useState([]);
    const { expoUnqCode } = useParams();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter states
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedStall, setSelectedStall] = useState('ALL');


    const [stallOptions, setStallOptions] = useState([]);

    useEffect(() => {
        const fetchStallOptions = async () => {
            try {
                const res = await expoAdminClient.get(
                    `newExpo/getExpoBookings.php?type=stall&limit=100&skip=0&id=${localStorage.getItem("expoCode")}`,
                    {
                        headers: {
                            "authorization": localStorage.getItem("adminToken")
                        }
                    }
                );
                if (res.data.status) {
                    setStallOptions(res.data.data);
                }

            } catch (err) {
                console.error("Failed to fetch stall options:", err);
            }
        };
        fetchStallOptions();
    }, []);

    const fetchExpoVisitors = async (overrideFilters = null) => {
        setLoading(true);
        const fDate = overrideFilters && 'fromDate' in overrideFilters ? overrideFilters.fromDate : fromDate;
        const tDate = overrideFilters && 'toDate' in overrideFilters ? overrideFilters.toDate : toDate;

        try {
            let url = `expoUserAnalytics/stall/stallvisitorslist.php?expoId=${localStorage.getItem("expoCode")}&stallCode=${selectedStall}&limit=${itemsPerPage}&skip=${currentPage - 1}`;
            if (fDate) {
                url += `&fromDate=${encodeURIComponent(fDate)}`;
            }
            if (tDate) {
                url += `&toDate=${encodeURIComponent(tDate)}`;
            }

            const res = await expoAdminClient.get(
                url,
                {
                    headers: {
                        "authorization": localStorage.getItem("adminToken")
                    }
                }
            );

            if (res?.data?.status) {
                let visitors = res.data.data || [];

                // Fallback client-side filtering if backend returns unfiltered data
                if (fDate) {
                    const from = new Date(fDate);
                    from.setHours(0, 0, 0, 0);
                    visitors = visitors.filter(item => {
                        const itemDateStr = item.created_at || item.date || item.joined_at;
                        if (!itemDateStr) return true;
                        const parsed = new Date(itemDateStr);
                        return !isNaN(parsed) ? parsed >= from : true;
                    });
                }
                if (tDate) {
                    const to = new Date(tDate);
                    to.setHours(23, 59, 59, 999);
                    visitors = visitors.filter(item => {
                        const itemDateStr = item.created_at || item.date || item.joined_at;
                        if (!itemDateStr) return true;
                        const parsed = new Date(itemDateStr);
                        return !isNaN(parsed) ? parsed <= to : true;
                    });
                }

                setExpoVisitors(visitors);
                setTotalPages(Math.ceil((res.data.count || visitors.length) / itemsPerPage) || 1);
            } else {
                setExpoVisitors([]);
                setTotalPages(1);
            }
        } catch (error) {
            setExpoVisitors([]);
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpoVisitors();
    }, [expoUnqCode, currentPage, selectedStall]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchExpoVisitors();
        }
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchExpoVisitors({ fromDate: '', toDate: '' });
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
                                            <li className="breadcrumb-item active">Stall Wise Visitors</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <form className="custom-validation mb-3" onSubmit={handleSearch}>
                                <div className="row align-items-center">
                                    <div className="col-md-3 mt-3">
                                        <div className="">
                                            <div className="form-floating">
                                                <input
                                                    type="date"
                                                    id="from-date"
                                                    className="form-control"
                                                    name="fromdate"
                                                    value={fromDate}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                />
                                                <label htmlFor="from-date" className="fw-normal">From Date</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-3">
                                        <div className="">
                                            <div className="form-floating">
                                                <input
                                                    type="date"
                                                    id="to-date"
                                                    className="form-control"
                                                    name="todate"
                                                    value={toDate}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                />
                                                <label htmlFor="to-date" className="fw-normal">To Date</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3 mt-3">
                                        <div className="">
                                            <div className="form-floating">
                                                <select
                                                    id="stall-select"
                                                    className="form-select"
                                                    value={selectedStall}
                                                    onChange={(e) => setSelectedStall(e.target.value)}
                                                >
                                                    <option value="ALL">All Stalls</option>
                                                    {stallOptions.map((stall) => (
                                                        <option key={stall.stallCode} value={stall.stallCode}>
                                                            {stall.stallType} ({stall.stallUnqCode})
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor="stall-select" className="fw-normal">Stall</label>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-3 mt-3 d-flex gap-2">
                                        <button className="btn btn-primary" type="submit">Search</button>
                                        <button className="btn btn-secondary" type="button" onClick={handleReset}>Reset</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">No of Visitors</h3>
                                        {/* <h3 className="card-title">Day 1</h3> */}
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>S.no</th>
                                                        <th>Stall ID</th>
                                                        <th>Visitor Name</th>
                                                        {/* <th>Source Name</th> */}
                                                        <th>Mobile Number</th>
                                                        <th>Email Id</th>
                                                        <th>Visited Date</th>
                                                        <th>Duration</th>

                                                        {/* <th>Exhibitor Name</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {expoVisitors.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={8} className="text-center">No visitors found.</td>
                                                        </tr>
                                                    ) : (
                                                        expoVisitors.map((ele, idx) => (
                                                            <tr key={idx}>
                                                                <td>{((currentPage - 1) * 10) + idx + 1}</td>
                                                                <td>{ele.stall_code}</td>
                                                                <td>{ele.name}</td>
                                                                <td>{ele.number}</td>
                                                                <td>{ele.email}</td>
                                                                <td>{ele.entered_at}</td>

                                                                <td>4 mins 5 Sec</td>
                                                            </tr>
                                                        )))
                                                    }
                                                </tbody>
                                            </table>

                                            {expoVisitors.length > 0 && (

                                                <Pagenation
                                                    currentPage={currentPage}
                                                    setCurrentPage={setCurrentPage}
                                                    totalPages={totalPages}
                                                />)}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </>
    )
}

export default StallVisitors