import React from "react";
import "./SidebarCustomer.css";
import { MdOutlineDashboard } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
function SidebarCustomer() {
  return (
    <div className="customer-layout">
      <aside className="sidebar-customer">
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
            <span className="customer-brand-name">Quản lý hồ sơ</span>
          </div>
          <nav className="customer-nav">
            <div className="customer-nav-group">
              <Link to="/customer" className="customer-nav-item active">
                <MdOutlineDashboard /> Hồ sơ
              </Link>
              <Link to="/customer/history" className="customer-nav-item">
                <FaUserAlt /> Lịch sử giao dịch
              </Link>
              <Link to="/customer/services-used" className="customer-nav-item">
                <FaUserAlt /> Dịch vụ đã sử dụng
              </Link>
              <Link
                to="/customer/services-registered"
                className="customer-nav-item"
              >
                <FaUserAlt /> Dịch vụ đã đăng ký
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SidebarCustomer;
