import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx"
import RegisterComplaint from "./pages/RegisterComplaint.jsx";
import ConservationTechniques from "./pages/ConservationTechniques.jsx";
import SocialPosts from "./components/SocialPosts.jsx";
import GovernmentSchemes from "./components/GovermentSchemes.jsx";
import MunicipalDashboard from "./pages/MunicipalDashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";
import SubsidyPage from "./pages/Subsidy.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/ChatBot.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        <Route path="/techniques" element={<ConservationTechniques />}>
          {/* Redirect default /techniques to /techniques/social */}
          <Route index element={<Navigate to="/techniques/social" replace />} />
          <Route path="social" element={<SocialPosts />} />
          <Route path="schemes" element={<GovernmentSchemes />} />
        </Route>
        <Route path="/subsidy" element={<SubsidyPage />} />

        {/* Municipal Dashboard - Protected */}
        <Route
          path="/municipal-dashboard"
          element={
            <ProtectedRoute roleRequired="municipal">
              <MunicipalDashboard />
            </ProtectedRoute>
          }
        />

        {/* NGO Dashboard - Protected */}
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute roleRequired="ngo">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        {/* Chatbot Route */}
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default App;