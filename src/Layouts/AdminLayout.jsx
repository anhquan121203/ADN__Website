import { Outlet } from "react-router-dom";
import TopbarAdmin from "../Components/Admin/Topbar/TopbarAdmin";
import SidebarAdmin from "../Components/Admin/Sidebar/SidebarAdmin";
import { useEffect, useState } from "react";
import LoadingComponent from "../Components/Customer/LoadingComponent/LoadingComponent";

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

const mainWrapperStyle = {
  marginLeft: "290px",
  width: "calc(100% - 290px)",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

const topbarStyle = {
  height: "70px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  position: "fixed",
  top: 0,
  left: "290px",
  right: 0,
  zIndex: 4,
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
};

const outletWrapperStyle = {
  marginTop: "70px",
  padding: "20px",
  flex: 1,
  overflowY: "auto",
  backgroundColor: "#f9fafb",
  marginLeft: "30px",
  marginRight: "30px",
};

function AdminLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);



  return (
    <>
      {loading && <LoadingComponent />}
      <div style={layoutStyle}>
        <div style={sidebarStyle}>
          <SidebarAdmin />
        </div>

        <div style={mainWrapperStyle}>
          <div style={topbarStyle}>
            <TopbarAdmin />
          </div>
          <div style={outletWrapperStyle}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
