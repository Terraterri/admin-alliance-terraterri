import { useState, useEffect, useContext } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LazyLoad from './routes/LazyLoad';
import Loader from './components/Loader';
import { authClient, expoAdminClient } from './utils/httpClient';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInfoContext, IpInfoContext } from './utils/context';
import { Provider } from 'react-redux';
import Store from './store/Store';
import { useLocation } from 'react-router-dom';
function App() {
  const navigate = useNavigate();
  const location = useLocation()
  const [loader, setLoader] = useState(true);
  const [ipInfo, setIpInfo] = useState({});
  const [user, setUser] = useState({});

  /////////////////// Validating Existing Token   ///////////////////////

  const token = localStorage.getItem('adminToken');
  // console.log("Existing Admin Token:", token);
  const ValidateToken = async () => {
    try {
      const response = await expoAdminClient.post('/authLogin/verifyAdmin.php');
      if (response.data.status) {
        if (location.pathname == '/') {
          navigate('/dashboard');
        } else {
          navigate(location.pathname)
        }
      } else {
        // navigate('/');
        // localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.log(err);
      navigate('/');
    } finally {
      setLoader(false);
    }
  };

  const getIpInfo = async () => {
    try {
      const response = await expoAdminClient.get('http://ip-api.com/json');
      if (response.data) {
        setIpInfo(response?.data?.query);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      setLoader(true);
      ValidateToken();
      getIpInfo();
    }
    setLoader(false);
  }, []);

  return (
    <>
      <Provider store={Store}>
        <IpInfoContext.Provider value={{ ipInfo }}>
          <div id="layout-wrapper">
            <ToastContainer />
            {loader && <Loader />}
            {token != null && !loader && <Header />}
            {token != null && !loader && <Sidebar />}
            <LazyLoad />
            {token != null && !loader && <Footer />}
          </div>
        </IpInfoContext.Provider>
      </Provider>
    </>
  );
}

export default App;
