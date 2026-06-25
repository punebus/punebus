import React from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Provider from "./pages/Provider";
import Partner from "./pages/Partner";
import Register from "./pages/Register";
import PartnerRegister from "./pages/PartnerRegister";
import EnquiryForm from "./pages/EnquiryForm";
import Footer from "./pages/Footer";

const App = () => {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/register" || pathname === "/partner-register";

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/partner" element={<Partner />} />

          {/* ✅ Registration URLs */}
          <Route path="/register" element={<Register />} />
          <Route path="/partner-register" element={<PartnerRegister />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="/manager/*" element={<Navigate to="/" replace />} />
          <Route path="/executor/*" element={<Navigate to="/" replace />} />

          {/* ✅ Enquiry Form Route */}
          <Route path="/enquiry" element={<EnquiryForm />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
