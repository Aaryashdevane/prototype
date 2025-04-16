import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import RegisterComplaint from "./pages/RegisterComplaint.jsx";
import ConservationTechniques from "./pages/ConservationTechniques.jsx";
import SocialPosts from "./components/SocialPosts.jsx";
import GovernmentSchemes from "./components/GovermentSchemes.jsx";
import MunicipalDashboard from "./pages/MunicipalDashboard.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";
import SubsidyPage from "./pages/Subsidy.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/ChatBot.jsx";
import InstaPosts from "./components/InstaPosts.jsx";
import TwitterPosts from "./components/TwitterPosts.jsx";
import useAuthStore from "./store/authStore";

const App = () => {
  const loadUser = useAuthStore((state) => state.loadUser);
  const { user } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  console.log("User",user);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={ !user ? <Signin/> : <Home/>} />
        <Route path="/signup" element={ !user ? <Signup /> : <Home/>} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        <Route path="/techniques" element={<ConservationTechniques />}>
          <Route index element={<Navigate to="/techniques/social/twitter" replace />} />
          <Route path="/techniques/social" element={<SocialPosts />}>
            <Route index element={<Navigate to="/techniques/social/twitter" replace />} />
            <Route path="insta" element={<InstaPosts />} />
            <Route path="twitter" element={<TwitterPosts />} />
          </Route>
          <Route path="schemes" element={<GovernmentSchemes />} />
        </Route>
        <Route path="/subsidy" element={<SubsidyPage />} />

        {/* Protected Routes */}
        <Route
          path="/municipal-dashboard"
          element={
            user && user.role==="municipal" && <MunicipalDashboard />
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            user && user.role==="ngo" && <NgoDashboard />
            
          }
        />

        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;