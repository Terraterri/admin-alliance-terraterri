import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { authClient, expoAdminClient } from "../utils/httpClient";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { UserInfoContext } from "../utils/context";
import { toastError } from "../utils/toast";
import Otp from "./otp"
const Login = () => {
    const navigation = useNavigate();
    const [loginForm, setLoginForm] = useState({});
    const [formErr, setFormErr] = useState({});
    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState({});
    const [OtpPopUp, setOtpPopUp] = useState(false)
    const handleChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        localStorage.clear()
    }, [])
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        console.log(loginForm)
        if (!loginForm.mobile) {
            formIsValid = false;
            errors.mobile = "Please enter your number.";
        }
        setFormErr(errors);
        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (validateForm()) {
            const response = await expoAdminClient.post('/authLogin/loginalliance.php', loginForm);
            if (response.data.status) {
                setLoader(false);
                setOtpPopUp(true)
            } else {
                toastError(response?.data?.message)
            }
        }
        else {
            console.log('form is invalid');
        }
        setLoader(false);
    }

    const handleClose = () => {
        setOtpPopUp(false)
    }

    return (
        <>
            <UserInfoContext.Provider value={{ user }}>
                {loader && <Loader />}

                <div className="container-fluid authentication-bg overflow-hidden">
                    <div className="bg-overlay"></div>
                    <div className="row align-items-center justify-content-center min-vh-100">
                        <div className="col-10 col-md-6 col-lg-6 col-xxl-4 px-4">
                            <div className="card otp_out mb-0">
                                <div className="card-body">
                                    <div className="text-left mb-4">
                                        <a className="logo-dark">
                                            <img
                                                src="assets/images/logo.png"
                                                alt=""
                                                width="100"
                                                className="auth-logo logo-dark mx-auto"
                                            />
                                        </a>
                                    </div>

                                    <div className="otp_boxes">
                                        {!OtpPopUp &&
                                            <form>
                                                <label>Kindly input your WhatsApp number, and you will be sent a 6 Digit-Passcode for verification.</label>
                                                <div className="input-group auth-form-group-custom mb-3">
                                                    <span
                                                        className="input-group-text bg-primary bg-opacity-10 fs-16 "
                                                        id="basic-addon1"
                                                    >
                                                        {/* <i className="mdi mdi-account-outline auti-custom-input-icon"></i> */}
                                                        <FaUserAlt />

                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Mobile Number"
                                                        aria-label="Username"
                                                        aria-describedby="basic-addon1"
                                                        name="mobile"
                                                        onChange={handleChange}
                                                    />

                                                </div>
                                                <div>
                                                    {formErr.mobile && <p className="err">{formErr.mobile}</p>}
                                                    {!formErr.username && <p className="err">{formErr.username}</p>}
                                                </div>

                                                {/* <div className="input-group auth-form-group-custom mb-3">
                                                <span
                                                    className="input-group-text bg-primary bg-opacity-10 fs-16"
                                                    id="basic-addon2"
                                                >
                                                    <i className="mdi mdi-lock-outline auti-custom-input-icon"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="userpassword"
                                                    placeholder="Enter password"
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                    name="password"
                                                    onChange={handleChange}
                                                />

                                            </div> */}
                                                {/* <div>
                                                {formErr.password && <p class="err">{formErr.password}</p>}
                                            </div> */}
                                                {/* <p>Kindly input your WhatsApp number, and you will be sent a passcode for verification.</p> */}
                                                <div className="pt-3 text-center">
                                                    <button
                                                        className="btn btn-primary w-xl waves-effect waves-light"
                                                        type="button"
                                                        onClick={handleSubmit}
                                                    >
                                                        Continue
                                                    </button>
                                                </div>

                                                <div>
                                                </div>
                                            </form>}
                                        {OtpPopUp && <Otp loginDetails={loginForm} handleClose={handleClose} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </UserInfoContext.Provider>
        </>
    );
};

export default Login;
