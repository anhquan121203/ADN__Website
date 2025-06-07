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
import ForgotPassword from "./Pages/LoginRegister/ForgotPassword/ForgotPassword";
import CustomerSideBarLayout from "./Layouts/CustomerSideBarLayout";
import CustomerProfile from "./Pages/CustomerPage/CustomerProfile/CustomerProfile";
import CustomerService from "./Pages/CustomerPage/ServicePage/ServicePage";
import ViewAppointment from "./Pages/CustomerPage/AppointmentPage/ViewAppointment";
// ADMIN PAGE
import AdminLayout from "./Layouts/AdminLayout";
import DashboardAdmin from "./Pages/AdminPage/DashboardAdmin/DashboardAdmin";
import ManagerUser from "./Pages/AdminPage/ManagerUser/ManagerUser";
import ProfileAdmin from "./Pages/AdminPage/ProfileAdmin/Profile";
import DepartmentAdmin from "./Pages/AdminPage/DepartmentAdmin/DepartmentAdmin";
import SlotAdmin from "./Pages/AdminPage/SlotAdmin/SlotAdmin";
import KitAdmin from "./Pages/AdminPage/KitAdmin/KitAdmin";
import BlogAdmin from "./Pages/AdminPage/BlogAdmin/BlogAdmin";

// STAFF PAGE
import StaffLayout from "./Layouts/StaffLayout";
import StaffProfile from "./Pages/StaffPage/StaffProfile/ViewProfile";
import ServiceAdmin from "./Pages/AdminPage/ServiceAdmin/ServiceAdmin";
import AppointmentStaff from "./Pages/StaffPage/StaffAppointments/View";
import StaffService from "./Pages/StaffPage/StaffService/View";
import StaffDepartment from "./Pages/StaffPage/StaffDepartments/View";
import StaffSlot from "./Pages/StaffPage/StaffSlot/View";

// MANAGER PAGE
import ManagerLayout from "./Layouts/ManagerLayout";
import ManagerProfile from "./Pages/ManagerPage/ProfileManager/ProfileManger";
import ManagerStaffProfile from "./Pages/AdminPage/ManagerStaffProfile/ManagerStaffProfile";
import DepartmentManager from "./Pages/ManagerPage/DepartmentManager/DepartmentManager";

// LABORATORY TECHNICIAN PAGE
import LaboratoryTechnicianLayout from "./Layouts/LaboratoryTechnicianLayout";
import LaboratoryTechnicianProfile from "./Pages/LaboratoryTechnicianPage/LaboratoryTechnicianProfile/ViewProfileLaboratoryTechnician";


// Protected route component
// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

//   // If not logged in, redirect to login
//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   // Check user role from token
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       const userRole = decoded.role || "customer"; // Default to customer if no role

//       // If user role is allowed, render the element
//       if (allowedRoles.includes(userRole)) {
//         return element;
//       } else {
//         // Redirect based on role
//         if (userRole === "admin") {
//           return <Navigate to="/admin" />;
//         } else if (userRole === "staff") {
//           return <Navigate to="/staff" />;
//         } else {
//           return <Navigate to="/" />;
//         }
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return <Navigate to="/login" />;
//     }
//   }

//   return <Navigate to="/login" />;
// };

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/service" element={<CustomerService />} />
        </Route>

        <Route path="/customer" element={<CustomerSideBarLayout />}>
          <Route index element={<CustomerProfile />} />
          <Route path="appointment" element={<ViewAppointment />} />
        </Route>

        {/* ADMIN ROUTES*********************************** */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard-admin" element={<DashboardAdmin />} />
          <Route path="manager-account" element={<ManagerUser />} />
          <Route path="service-admin" element={<ServiceAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="department-admin" element={<DepartmentAdmin />} />
          <Route path="slot-admin" element={<SlotAdmin />} />
          <Route path="manager-staff-profile" element={<ManagerStaffProfile />} />
          <Route path="kit-admin" element={<KitAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
        </Route>

        {/* STAFF ROUTES*********************************** */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffProfile />} />
          <Route path="appointment" element={<AppointmentStaff />} />
          <Route path="service" element={<StaffService />} />
          <Route path="department" element={<StaffDepartment />} />
          <Route path="slot" element={<StaffSlot />} />
        </Route>

        {/* MANAGER ROUTES*********************************** */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerProfile />} />
          <Route path="department-manager" element={<DepartmentManager />} />
        </Route>

        {/* LABORATORY TECHNICIAN ROUTES*********************************** */}
          <Route path="/laboratory_technician" element={<LaboratoryTechnicianLayout/>}>
          <Route index element={<LaboratoryTechnicianProfile />} />
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
    // <BrowserRouter>
    //   <Routes>
    //   <Route path="/" element={<CustomerLayout />}>

    //     {/* Public routes */}
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/verify-email/:token" element={<VerifyEmail />} />
    //     </Route>
    //     {/* Customer routes */}
    //     <Route path="/" element={<CustomerLayout />}>
    //       <Route index element={<HomePage />} />
    //       {/* Add more customer routes here */}
    //     </Route>

    //     {/* Admin routes */}
    //     <Route
    //       path="/admin"
    //       element={
    //         <ProtectedRoute
    //           element={<AdminLayout />}
    //           allowedRoles={["admin"]}
    //         />
    //       }
    //     >
    //       <Route index element={<DashboardAdmin />} />
    //       <Route path="/admin/dashboard-admin" element={<DashboardAdmin />} />
    //     </Route>

    //     {/* Staff routes (if needed) */}
    //     <Route
    //       path="/staff"
    //       element={
    //         <ProtectedRoute
    //           element={<StaffLayout />}
    //           allowedRoles={["staff"]}
    //         />
    //       }
    //     >
    //       {/* <Route index element={<StaffDashboard />} /> */}
    //     </Route>
    //   </Routes>

    //   {/* Setup toast */}
    //   <ToastContainer
    //     transition={Slide}
    //     autoClose={1000}
    //     newestOnTop={true}
    //     pauseOnHover={true}
    //     pauseOnFocusLoss={false}
    //     limit={5}
    //   />
    // </BrowserRouter>
  );
}

export default App;
