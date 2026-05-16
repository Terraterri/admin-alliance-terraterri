import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { authClient, expoAdminClient } from "../utils/httpClient";
import { FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
const Otp = (props) => {
    const { handleClose, loginDetails } = props;
    const navigation = useNavigate();
    const [otp, setOtp] = useState('');
    const handleSubmit = async () => {
        let payload =
        {
            mobile: loginDetails.mobile,
            OTP: otp
        }
        const response = await expoAdminClient.post('/authLogin/verifyOTP.php', payload);
        if (response.data.status) {
            localStorage.setItem('adminToken', response.data.token.token);
            navigation('/dashboard');
        }
    }
    console.log("Admin Token:", localStorage.getItem('adminToken'));
    return (
        <div className='opt_main'>
            <h4>Verify Your Number</h4>
            <h3>+91 9063754321  <button
                className="btn btn-primary w-xl waves-effect waves-light"
                type="button"
                onClick={handleClose}><FaRegEdit /></button></h3>
            <label clas>Please provide the 4-Digit  passcode to complete your registration</label>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                // renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
            />
            <p>Haven't received the passcode yet? <Link to="#">Resend Passcode</Link></p>
            <div className='otp_btns'>
                <button
                    className="btn btn-primary w-xl waves-effect waves-light"
                    type="button"
                    onClick={handleSubmit}
                >
                    Verify & Continue
                </button>

            </div>
        </div>
    )
}

export default Otp