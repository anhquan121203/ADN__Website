import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Slide, ToastContainer } from "react-toastify";

// CUSTORMER PAGE
import CustomerLayout from "./Layouts/CustomerLayout";
import HomePage from "./Pages/CustomerPage/HomePage/HomePage";
import LoginPage from "./Pages/LoginRegister/Login/Login";
import Register from "./Pages/LoginRegister/Register/Register";
import VerifyEmail from "./Components/VerifyToken/VerifyToken";
import AdminLayout from "./Layouts/AdminLayout";
import DashboardAdmin from "./Pages/AdminPage/DashboardAdmin/DashboardAdmin";

// ADMIN PAGE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="/admin/dashboard-admin" element={<DashboardAdmin />} />
        </Route>
      </Routes>

      {/* ADMIN PAGE */}
      {/* <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="/dashbboard-admin" element={<DashboardAdmin />} />
        </Route>
      </Routes> */}

      {/* Setup toast */}
      <ToastContainer
        transition={Slide}
        autoClose={1000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
    </BrowserRouter>
  );
}

export default App;
