import React, { useState } from "react";
import "./SidebarAdmin.css";
import {
  MdOutlineDashboard,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";

function Sidebar() {
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  return (
    <div>
      <aside className="sidebar-admin">
        <div>
          <div className="top-admin">
            <div className="top-admin__icon">
              <RiAdminLine />
            </div>
            <span className="title-name">Admin Dashboard</span>
          </div>
          <nav className="nav-admin">
            <div className="nav-group">
              <Link to="/admin/dashboard-admin" className="nav-item active">
                <MdOutlineDashboard /> Dashboard
              </Link>

              <Link to="/admin/manager-account" className="nav-item">
                <LuListTodo  /> Quản lý người dùng
              </Link>

              {/* Dropdown: Quản lý thiết bị */}
              <div
                className={`nav-item dropdown-service ${
                  serviceDropdownOpen ? "open" : ""
                }`}
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              >
                <div className="dropdown-left">
                  <MdOutlineMiscellaneousServices />
                  <span>Quản lý thiết bị</span>
                </div>
                <IoIosArrowDown
                  className={`dropdown-icon ${
                    serviceDropdownOpen ? "rotate" : ""
                  }`}
                />
              </div>

              {serviceDropdownOpen && (
                <div className="submenu">
                  <Link to="/admin/service-admin" className="submenu-item">
                    Danh sách thiết bị
                  </Link>
                  <Link
                    to="/admin/service-admin/device-b"
                    className="submenu-item"
                  >
                    Đặt lịch theo thiết bị
                  </Link>
                </div>
              )}

              <Link to="/admin/profile" className="nav-item">
                <FaUserAlt /> Hồ sơ
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
