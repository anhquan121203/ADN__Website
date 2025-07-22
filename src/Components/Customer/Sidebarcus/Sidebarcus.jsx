import React from "react";
import "./Sidebarcus.css";
import { MdOutlineDashboard } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaUserAlt, FaHistory, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { useSidebar } from "../../../Contexts/SidebarContext";

function Sidebarcus() {
  const { sidebarCollapsed } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <aside className={`sidebar-customer${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div>
          <div className="customer-logo">
            <Link to="/">
              <img src={logo} alt="ADN Logo" />
            </Link>
          </div>
          <div className="customer-brand">
            <div className="customer-brand__icon">
              <RiAdminLine />
            </div>
            {!sidebarCollapsed && <span className="customer-brand-name">Quản lý hồ sơ</span>}
          </div>
          <nav className="customer-nav">
            <div className="customer-nav-group">
              <Link
                to="/customer"
                className={`customer-nav-item${(pathname === '/customer' || pathname === '/customer/') ? ' active' : ''}`}
                title={sidebarCollapsed ? "Hồ sơ" : ""}
              >
                <MdOutlineDashboard /> {!sidebarCollapsed && "Hồ sơ"}
              </Link>
              {/* <Link
                to="/customer/history"
                className={`customer-nav-item${pathname.startsWith('/customer/history') ? ' active' : ''}`}
                title={sidebarCollapsed ? "Lịch sử giao dịch" : ""}
              >
                <FaHistory /> {!sidebarCollapsed && "Lịch sử giao dịch"}
              </Link>
              <Link
                to="/customer/services-used"
                className={`customer-nav-item${pathname.startsWith('/customer/services-used') ? ' active' : ''}`}
                title={sidebarCollapsed ? "Dịch vụ đã sử dụng" : ""}
              >
                <FaClipboardList /> {!sidebarCollapsed && "Dịch vụ đã sử dụng"}
              </Link>
              <Link
                to="/customer/services-registered"
                className={`customer-nav-item${pathname.startsWith('/customer/services-registered') ? ' active' : ''}`}
                title={sidebarCollapsed ? "Dịch vụ đã đăng ký" : ""}
              >
                <FaClipboardList /> {!sidebarCollapsed && "Dịch vụ đã đăng ký"}
              </Link> */}
              <Link
                to="/customer/appointment"
                className={`customer-nav-item${pathname === '/customer/appointment' ? ' active' : ''}`}
                title={sidebarCollapsed ? "Đặt lịch" : ""}
              >
                <FaCalendarAlt /> {!sidebarCollapsed && "Đặt lịch"}
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebarcus;
