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
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";

function Sidebar() {
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

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
                <MdOutlineDashboard /> Doanh số
              </Link>

              {/* Quản lý người dùng */}
              <div
                className={`nav-item dropdown-service ${
                  accountDropdownOpen ? "open" : ""
                }`}
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              >
                <div className="dropdown-left">
                  <LuListTodo />
                  <span>Quản lý tài khoản</span>
                </div>
                <IoIosArrowDown
                  className={`dropdown-icon ${
                    accountDropdownOpen ? "rotate" : ""
                  }`}
                />
              </div>

              {accountDropdownOpen && (
                <div className="submenu">
                  <Link to="/admin/manager-account" className="submenu-item">
                    Danh sách người dùng
                  </Link>
                  <Link
                    to="/admin/manager-staff-profile"
                    className="submenu-item"
                  >
                    Danh sách nhân viên
                  </Link>
                </div>
              )}

              {/*Quản lý thiết bị */}
              <div
                className={`nav-item dropdown-service ${
                  serviceDropdownOpen ? "open" : ""
                }`}
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              >
                <div className="dropdown-left">
                  <MdOutlineMiscellaneousServices />
                  <span>Quản lý dịch vụ</span>
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
                    Danh sách dịch vụ
                  </Link>
                  <Link
                    to="/admin/service-admin/device-b"
                    className="submenu-item"
                  >
                    Đặt lịch theo dịch vụ
                  </Link>
                </div>
              )}

              {/* Quản lý slot */}
              <Link to="/admin/slot-admin" className="nav-item">
                <CiCalendar  /> Lịch làm việc
              </Link>

              <Link to="/admin/department-admin" className="nav-item">
                <HiOutlineOfficeBuilding /> Quản lý phòng ban
              </Link>
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
