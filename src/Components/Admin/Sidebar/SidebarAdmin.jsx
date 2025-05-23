import React from "react";
import "./SidebarAdmin.css";
import { MdOutlineDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <aside className="sidebar-admin">
        <div>
          <div className="brand-admin">
            <div className="brand-admin__icon">
              <RiAdminLine />
            </div>
            <span className="brand-name">Admin Dashboard</span>
          </div>
          <nav className="nav">
            <div className="nav-group">
              <Link to="/admin/dashboard-admin" className="nav-item active">
                <MdOutlineDashboard /> Dashboard
              </Link>

              <Link to="/admin/manager-account" className="nav-item">
                <FaUserAlt /> Quản lý người dùng
              </Link>

              <Link to="/admin/service-admin" className="nav-item">
                <FaUserAlt /> Quản lý thiết bị
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
