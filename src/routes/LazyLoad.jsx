import React, { useEffect, useState } from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/Loader';
// import MultiStepForm from '../pages/expo/MultiStepForm';
import ProtectedRoute from './privateRouting';


const LazyLoad = () => {
  //////////////////////////////////// Masters    //////////////////////////////////////////

  const Login = lazy(() => import(`../pages/Login`));
  // const Dashboard = lazy(() => import(`../pages/Dashboard`));

  ////////////////////////////////expo dashboard ////////////////////////

  const Expodashboard = lazy(() => import(`../pages/expo/ExpoDashboard`));
  const MultiStepForm = lazy(() => import(`../pages/expo/MultiStepForm`));
  const OnGoingExpo = lazy(() => import(`../pages/expo/ExpoManagement/OnGoingExpo`));
  const FutureExpo = lazy(() => import(`../pages/expo/ExpoManagement/FutureExpo`));
  const CompletedExpo = lazy(() => import(`../pages/expo/ExpoManagement/CompletedExpo`));
  const DeletedExpo = lazy(() => import(`../pages/expo/ExpoManagement/DeletedExpo`));
  const Expotype = lazy(() => import(`../pages/expo/ExpoMaster/Expotype`));
  const BookingMoths = lazy(() => import(`../pages/expo/ExpoMaster/BookingMoths`));
  const AddPackage = lazy(() => import(`../pages/expo/Packages/AddPackage`));
  const Source = lazy(() => import(`../pages/expo/ExpoMaster/Source`));
  const PackageLists = lazy(() => import(`../pages/expo/Packages/PackageLists`));
  const ExpoSingleview = lazy(() => import(`../pages/expo/ExpoManagement/ExpoSingleview`));
  const BuilderParticipati = lazy(() => import(`../pages/expo/ExpoManagement/BuilderParticipati`));
  const NoofVisitors = lazy(() => import(`../pages/expo/ExpoManagement/NoofVisitors`));
  const NoofVisitorReg = lazy(() => import(`../pages/expo/ExpoManagement/NoofVisitorReg`));
  const CityMaster = lazy(() => import(`../pages/expo/ExpoMaster/CityMaster`));
  const CountryMaster = lazy(() => import(`../pages/expo/ExpoMaster/CountryMaster`));
  const LayoutView = lazy(() => import(`../pages/expo/ExpoMaster/LayoutView`));
  const CreatePackage = lazy(() => import(`../pages/expo/ExpoMaster/CreatePackage`));
  const AddBudget = lazy(() => import(`../pages/expo/ExpoMaster/AddBudget`));
  const AddLeadgen = lazy(() => import(`../pages/expo/ExpoManagement/AddLeadgen`));
  const SponcerManagement = lazy(() => import(`../pages/expo/ExpoManagement/SponcerManagement`));
  const DiamondStall = lazy(() => import(`../pages/expo/ExpoManagement/DaimondStall`));
  const GoldStall = lazy(() => import(`../pages/expo/ExpoManagement/GoldStall`));
  const PlatinumStall = lazy(() => import(`../pages/expo/ExpoManagement/PlatinumStall`));
  const StandardStall = lazy(() => import(`../pages/expo/ExpoManagement/StandardStall`));
  const ExpoBanImage = lazy(() => import(`../pages/expo/ExpoMaster/ExpoBanImage`));
  const Solutions = lazy(() => import(`../pages/expo/ExpoMaster/Solutions`));
  const AddImage = lazy(() => import(`../pages/expo/ExpoMaster/AddImage`));
  const ConnectForm = lazy(() => import(`../pages/expo/ConnectForm`))

  const ViewStallDetails = lazy(() => import(`../pages/expo/ExpoManagement/ViewStallDetails`))

  const CreateStall = lazy(() => import(`../pages/expo/ExpoManagement/CreateStall`))

  const BlockNumber = lazy(() => import(`../pages/expo/ExpoMaster/BlockMobile`));

  // const Expotype = lazy(() => import(`../pages/expo/Expotype`));
  // const Expotype = lazy(() => import(`../pages/expo/Expotype`));
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));
  //  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('adminToken')));

  //  useEffect(() => {
  //    const handleStorageChange = (event) => {
  //      if (event.storageArea === localStorage && !localStorage.getItem('adminToken')) {
  //        setIsAuthenticated(false);
  //      }
  //    };

  //    window.addEventListener('storage', handleStorageChange);

  //    setIsAuthenticated(Boolean(localStorage.getItem('adminToken')));

  //    return () => {
  //      window.removeEventListener('storage', handleStorageChange);
  //    };
  //  }, []);
  //
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* //////////////////////////////// Masters    /////////////////////////////// */}
        <Route path="/" element={<Login />} />
        {/* <PrivateRoute path="/expodashboard" element={<Expodashboard />} /> */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>

          <Route path="/dashboard" element={<Expodashboard />} />
          <Route path="/expo/type" element={<Expotype />} />
          <Route path="/masters/city" element={<CityMaster />} />
          <Route path="/masters/country" element={<CountryMaster />} />
          <Route path="/expo-banner" element={<ExpoBanImage />} />
          <Route path="/package/add" element={<CreatePackage />} />
          <Route path="/source" element={<Source />} />
          <Route path="/expo-configuration" element={<MultiStepForm />} />
          <Route path="/expo/create/:expoUnqCode" element={<MultiStepForm />} />
          <Route path="/expo/ongoing" element={<OnGoingExpo />} />
          <Route path="/expo/future" element={<FutureExpo />} />
          <Route path="/expo/completed" element={<CompletedExpo />} />
          <Route path="/expo/deleted" element={<DeletedExpo />} />

          <Route path="/bookingmonths" element={<BookingMoths />} />

          <Route path="/package/lists" element={<PackageLists />} />

          <Route path="/package/add" element={<AddPackage />} />

          <Route path="/expo/view/:expoId" element={<ExpoSingleview />} />

          <Route path="/builderparticipate" element={<BuilderParticipati />} />

          <Route path='/block-number' element={<BlockNumber />} />

          <Route path="/visitors-summary" element={<NoofVisitors />} />

          <Route path="/visitors-by-expo" element={<NoofVisitorReg />} />



          <Route path="/layoutview" element={<LayoutView />} />



          <Route path="/budget/add" element={<AddBudget />} />

          <Route path="/leadgen" element={<AddLeadgen />} />

          <Route path="/sponcermanagement" element={<SponcerManagement />} />

          <Route path="/stall/daimond" element={<DiamondStall />} />

          <Route path="/stall/gold" element={<GoldStall />} />

          <Route path="/stall/platinum" element={<PlatinumStall />} />

          <Route path="/stall/standard" element={<StandardStall />} />



          <Route path="/our-solutions" element={<Solutions />} />

          <Route path="/connect-inquiries" element={<ConnectForm />} />

          <Route path="/image/add" element={<AddImage />} />

          <Route path="/stall/:id" element={<ViewStallDetails />} />
          <Route path="/stall/create" element={<CreateStall />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyLoad;
