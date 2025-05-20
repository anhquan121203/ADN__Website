import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";

const layoutStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f8fafc",
};

const sidebarStyle = {
  width: "290px",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e2e8f0",
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  overflowY: "auto",
  zIndex: 1000,
};

const mainContentStyle = {
  marginLeft: "300px",
  padding: "20px",
  flex: 1,
  overflowY: "auto",
};

function AdminLayout() {
  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <Sidebar />
      </div>
      <div style={mainContentStyle}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
