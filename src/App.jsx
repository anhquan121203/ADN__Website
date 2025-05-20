import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

// CUSTORMER PAGE
import CustomerLayout from "./Layouts/CustomerLayout";
import HomePage from "./Pages/CustomerPage/HomePage/HomePage";
import LoginPage from "./Pages/LoginRegister/Login/Login";
import Register from "./Pages/LoginRegister/Register/Register";
import VerifyEmail from "./Components/VerifyToken/VerifyToken";
// ADMIN PAGE
import AdminLayout from "./Layouts/AdminLayout";
import DashboardAdmin from "./Pages/AdminPage/DashboardAdmin/DashboardAdmin";

// STAFF PAGE
import StaffLayout from "./Layouts/StaffLayout";

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  // Check user role from token
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role || "customer"; // Default to customer if no role
      
      // If user role is allowed, render the element
      if (allowedRoles.includes(userRole)) {
        return element;
      } else {
        // Redirect based on role
        if (userRole === "admin") {
          return <Navigate to="/admin" />;
        } else if (userRole === "staff") {
          return <Navigate to="/staff" />;
        } else {
          return <Navigate to="/" />;
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return <Navigate to="/login" />;
    }
  }
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<CustomerLayout />}>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>
        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          {/* Add more customer routes here */}
        </Route>

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute 
              element={<AdminLayout />} 
              allowedRoles={["admin"]} 
            />
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="/admin/dashboard-admin" element={<DashboardAdmin />} />
        </Route>

        {/* Staff routes (if needed) */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute 
              element={<StaffLayout />} 
              allowedRoles={["staff"]} 
            />
          }
        >
          {/* <Route index element={<StaffDashboard />} /> */}
        </Route>
      </Routes>

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
