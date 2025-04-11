import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx"
import RegisterComplaint from "./pages/RegisterComplaint.jsx";
import ConservationTechniques from "./pages/ConservationTechniques.jsx";
import MunicipalDashboard from "./pages/MunicipalDashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";
import SubsidyPage from "./pages/Subsidy.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/ChatBot.jsx"; // ✅ Added Chatbot Page

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        {/* ✅ Commenting properly for clarity */}
        {/* <Route path="/report-complaint" element={<ReportComplaint />} /> */}
        <Route path="/techniques" element={<ConservationTechniques />} />
        <Route path="/subsidy" element={<SubsidyPage />} />

        {/* ✅ Municipal Dashboard - Protected */}
        <Route
          path="/municipal-dashboard"
          element={
            <ProtectedRoute roleRequired="municipal">
              <MunicipalDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ NGO Dashboard - Protected */}
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute roleRequired="ngo">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Chatbot Route Added */}
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default App;
