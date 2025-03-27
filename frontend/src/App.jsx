import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import RegisterComplaint from "./pages/RegisterComplaint.jsx";
// import ReportComplaint from "./pages/ComplaintForm.jsx";
import ConservationTechniques from "./pages/ConservationTechniques.jsx";
import MunicipalDashboard from "./pages/MunicipalDashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
// import AuthContext from "./context/AuthContext.jsx"
import NgoDashboard from "./pages/NgoDashboard.jsx";
import SubsidyPage from "./pages/Subsidy.jsx";


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        {/* {<Route path="/report-complaint" element={<ReportComplaint />} /> */}
        <Route path="/techniques" element={<ConservationTechniques />} />
        <Route path="/subsidy" element={<SubsidyPage/>} />
        <Route
          path="/municipal-dashboard"
          element={
            <ProtectedRoute roleRequired="municipal">
              <MunicipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute roleRequired="ngo">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />


      </Routes>
    </>
  );
};

export default App;
