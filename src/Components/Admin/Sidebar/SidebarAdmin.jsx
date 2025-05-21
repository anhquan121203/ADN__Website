import React from "react";
import "./SidebarAdmin.css";
import { MdOutlineDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

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
              <a href="#" className="nav-item active">
                <MdOutlineDashboard /> Dashboard
              </a>
            </div>

            <a href="/admin/manager-account" className="nav-item">
              <FaUserAlt /> Quản lý người dùng
            </a>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
