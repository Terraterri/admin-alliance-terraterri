import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
                <img src="/assets/images/logo.png" alt="logos" width={100} />
              </Link>
            </span>
          </div>
          <div className='expo_out'>
            <h3>Alliance Admin</h3>
          </div>
          <div className="log_ot ">
         
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
