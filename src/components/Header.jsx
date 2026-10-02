import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="navbar-logo-box">
            <span className="logo-sm">
              <Link to="/dashboard">
                <img src="/assets/images/airpropx-logo.png" alt="logos" width={100} />
              </Link>
            </span>
          </div>
          <div className="expo_out">
            <h3>Expo Franchise Admin</h3>
          </div>
          <div className="log_ot d-flex align-items-center gap-2">
            <Link
              to="/profile"
              className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-1 text-white fw-semibold me-2"
              style={{ borderRadius: '20px', padding: '5px 14px', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}
            >
              <FaUserCircle size={16} />
              <span>Profile</span>
            </Link>
            <button onClick={logout}>
              Logout <AiOutlineLogout />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
