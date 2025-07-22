import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebarcus from "../Components/Customer/Sidebarcus/Sidebarcus";
import Topbarcus from "../Components/Customer/Topbarcus/Topbarcus";
import { SidebarProvider, useSidebar } from "../Contexts/SidebarContext";
import LoadingComponent from "../Components/Customer/LoadingComponent/LoadingComponent";

function CustomerSideBarLayoutContent() {
  const { sidebarCollapsed } = useSidebar();

  const layoutStyle = {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f8fafc",
  };

  const sidebarStyle = {
    width: sidebarCollapsed ? "80px" : "290px",
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
    marginLeft: sidebarCollapsed ? "80px" : "290px",
    width: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 290px)",
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
    left: sidebarCollapsed ? "80px" : "290px",
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

  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <Sidebarcus />
      </div>
      <div style={mainWrapperStyle}>
        <div style={topbarStyle}>
          <Topbarcus />
        </div>
        <div style={outletWrapperStyle}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function CustomerSideBarLayout() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <SidebarProvider>
      <CustomerSideBarLayoutContent />
    </SidebarProvider>
  );
}

export default CustomerSideBarLayout;
