import React, { useEffect, useState } from "react";
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
import ViewSampleAppointment from "./Pages/CustomerPage/AppointmentPage/ViewSampleAppointment/ViewSampleAppointment";
import PaymentPage from "./Pages/CustomerPage/PaymentPage/PaymentPage";
import PayOSReturn from "./Pages/CustomerPage/PaymentPage/PayOSReturn";
import CreateAppointmentAdminComponent from "./Components/Customer/AppointmentAdmin/CreateAppointmentAdminComponent";
import AboutPage from "./Pages/CustomerPage/AboutPage/AboutPage";
import Blogger from "./Pages/CustomerPage/Blogger/Blogger";
import BlogDetail from "./Pages/CustomerPage/Blogger/BlogDetail/BlogDetail";

// ADMIN PAGE
import AdminLayout from "./Layouts/AdminLayout";
import DashboardAdmin from "./Pages/AdminPage/DashboardAdmin/DashboardAdmin";
import ManagerUser from "./Pages/AdminPage/ManagerUser/ManagerUser";
import ProfileAdmin from "./Pages/AdminPage/ProfileAdmin/Profile";
import DepartmentAdmin from "./Pages/AdminPage/DepartmentAdmin/DepartmentAdmin";
import SlotAdmin from "./Pages/AdminPage/SlotAdmin/SlotAdmin";
import KitAdmin from "./Pages/AdminPage/KitAdmin/KitAdmin";
import AdministrativeCaseAdmin from "./Pages/AdminPage/AdministrativeCaseAdmin/AdministrativeCaseAdmin";
import AppointmentAdmin from "./Pages/AdminPage/AppointmentAdmin/AppointmentAdmin";
import AdminStaffProfile from "./Pages/AdminPage/ManagerStaffProfile/AdminStaffProfile";
import BlogAdmin from "./Pages/AdminPage/BlogAdmin/BlogAdmin";
import BlogCategoriesAdmin from "./Pages/AdminPage/BlogCategoriesAdmin/BlogCategoriesAdmin";

// STAFF PAGE
import StaffLayout from "./Layouts/StaffLayout";
import StaffProfile from "./Pages/StaffPage/StaffProfile/ViewProfile";
import ServiceAdmin from "./Pages/AdminPage/ServiceAdmin/ServiceAdmin";
import AppointmentStaff from "./Pages/StaffPage/StaffAppointments/View";
import StaffService from "./Pages/StaffPage/StaffService/View";
import StaffDepartment from "./Pages/StaffPage/StaffDepartments/View";
import StaffSlot from "./Pages/StaffPage/StaffSlot/View";
import StaffConfirmSlots from "./Pages/StaffPage/StaffConfirmSlots/StaffConfirmSlots";
import AppointmentViewDetail from "./Pages/StaffPage/StaffConfirmSlots/AppointmentViewDetail";
import StaffSample from "./Pages/StaffPage/StaffSample/StaffSample";
import ViewSampleAppoinment from "./Pages/StaffPage/StaffSample/ViewSampleAppoinment/ViewSampleAppoinment";
import ViewSamplesByAppointment from "./Pages/StaffPage/StaffConfirmSlots/ViewSamplesByAppointment/ViewSamplesByAppointment";

// MANAGER PAGE
import ManagerLayout from "./Layouts/ManagerLayout";
import ManagerProfile from "./Pages/ManagerPage/ProfileManager/ProfileManger";
import DepartmentManager from "./Pages/ManagerPage/DepartmentManager/DepartmentManager";
import AppointmentManager from "./Pages/ManagerPage/AppointmentManager/AppointmentManager";
import AppointmentDetail from "./Pages/ManagerPage/AppointmentManager/AppointmentDetail";
import ServiceManager from "./Pages/ManagerPage/ServiceManager/ServiceManager";
import StaffProfileManager from "./Pages/ManagerPage/StaffProfileManager/StaffProfileManager";
import SlotManager from "./Pages/ManagerPage/SlotManager/SlotManager";

// LABORATORY TECHNICIAN PAGE
import LaboratoryTechnicianLayout from "./Layouts/LaboratoryTechnicianLayout";
import LaboratoryTechnicianProfile from "./Pages/LaboratoryTechnicianPage/LaboratoryTechnicianProfile/ViewProfileLaboratoryTechnician";
import LabTechAppointments from "./Pages/LaboratoryTechnicianPage/LabTechAppointments/LabTechAppointments";
import LabTechViewSamplesByAppointment from "./Pages/LaboratoryTechnicianPage/LabTechAppointments/LabTechViewSamplesByAppointment/LabTechViewSamplesByAppointment";
import ManageResult from "./Pages/LaboratoryTechnicianPage/ManageResult/ManageResult";
import ViewSamples from "./Pages/LaboratoryTechnicianPage/ViewSamples/ViewSamples";
import GuidePage from "./Pages/CustomerPage/GuidePage/GuidePage";
import KitManager from "./Pages/ManagerPage/KitManager/KitManager";



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
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/api/payments/payos-return" element={<PayOSReturn />} />
          <Route
            path="/create-appointment-admin"
            element={<CreateAppointmentAdminComponent />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<Blogger />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/guide" element={<GuidePage />} />
        </Route>

        <Route path="/customer" element={<CustomerSideBarLayout />}>
          <Route index element={<CustomerProfile />} />
          <Route path="appointment" element={<ViewAppointment />} />
          <Route
            path="appointment/sample/:appointmentId"
            element={<ViewSampleAppointment />}
          />
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
          <Route
            path="admin-staff-profile"
            element={<AdminStaffProfile />}
          />
          <Route path="kit-admin" element={<KitAdmin />} />
          <Route
            path="administrative-case"
            element={<AdministrativeCaseAdmin />}
          />
          <Route path="appointment-admin" element={<AppointmentAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="blog-category" element={<BlogCategoriesAdmin />} />
        </Route>

        {/* STAFF ROUTES*********************************** */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffProfile />} />
          <Route path="appointment" element={<AppointmentStaff />} />
          <Route path="service" element={<StaffService />} />
          <Route path="department" element={<StaffDepartment />} />
          <Route path="slot" element={<StaffSlot />} />
          <Route path="confirm-slots" element={<StaffConfirmSlots />} />
          <Route
            path="appointment/view/:id"
            element={<AppointmentViewDetail />}
          />
          <Route path="sample" element={<StaffSample />} />
          <Route
            path="samples/appointment/:appointmentId"
            element={<ViewSampleAppoinment />}
          />
          <Route
            path="appointment/samples/:appointmentId"
            element={<ViewSamplesByAppointment />}
          />
        </Route>

        {/* MANAGER ROUTES*********************************** */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerProfile />} />
          <Route path="department-manager" element={<DepartmentManager />} />
          <Route path="appointments" element={<AppointmentManager />} />
          <Route path="appointments/:id" element={<AppointmentDetail />} />
          <Route path="service-manager" element={<ServiceManager />} />
          <Route path="staff-profile-manager" element={<StaffProfileManager />} />
          <Route path="slot-manager" element={<SlotManager />} />
          <Route path="kit-manager" element={<KitManager />} />
        </Route>

        {/* LABORATORY TECHNICIAN ROUTES*********************************** */}
        <Route
          path="/laboratory_technician"
          element={<LaboratoryTechnicianLayout />}
        >
          <Route index element={<LaboratoryTechnicianProfile />} />
          <Route path="samples" element={<LabTechAppointments />} />
          <Route
            path="appointments/:appointmentId/samples"
            element={<LabTechViewSamplesByAppointment />}
          />
          <Route path="results" element={<ManageResult />} />
          <Route path="view-samples/:appointmentId" element={<ViewSamples />} />
          
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
