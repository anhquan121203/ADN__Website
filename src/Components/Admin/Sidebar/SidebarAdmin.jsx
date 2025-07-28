import React, { useEffect, useState } from "react";
import "./SidebarAdmin.css";
import {
  MdOutlineDashboard,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDown, IoIosMedkit } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import { IoDocumentAttachOutline } from "react-icons/io5";

function SidebarAdmin() {
  const location = useLocation();
  const { pathname } = location;

  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    setServiceDropdownOpen(
      pathname.startsWith("/admin/service") ||
        pathname.startsWith("/admin/appointment")
    );
    setAccountDropdownOpen(pathname.startsWith("/admin/manager"));
    setBlogDropdownOpen(pathname.startsWith("/admin/blog"));

    setAdminDropdownOpen(pathname.startsWith("/admin/administrative-case"));
  }, [pathname]);

  return (
    <div>
      <aside className="sidebar-admin">
        <div>
          <div className="top-admin">
            <div className="top-admin__icon">
              <Link to="/">
              <RiAdminLine />
              </Link>
            </div>
            <span className="title-name">Admin Dashboard</span>
          </div>
          <nav className="nav-admin">
            <div className="nav-group">
              {/* Dashboard */}
              <Link
                to="/admin/dashboard-admin"
                className={`nav-item ${
                  pathname === "/admin/dashboard-admin" ? "active" : ""
                }`}
              >
                <MdOutlineDashboard /> Doanh số
              </Link>

              {/* Quản lý tài khoản */}
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
                  <Link
                    to="/admin/manager-account"
                    className={`submenu-item ${
                      pathname === "/admin/manager-account" ? "active" : ""
                    }`}
                  >
                    Danh sách người dùng
                  </Link>
                  <Link
                    to="/admin/admin-staff-profile"
                    className={`submenu-item ${
                      pathname === "/admin/admin-staff-profile" ? "active" : ""
                    }`}
                  >
                    Danh sách nhân viên
                  </Link>
                </div>
              )}

              {/* Quản lý dịch vụ */}
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
                  <Link
                    to="/admin/service-admin"
                    className={`submenu-item ${
                      pathname === "/admin/service-admin" ? "active" : ""
                    }`}
                  >
                    Danh sách dịch vụ
                  </Link>
                  <Link
                    to="/admin/administrative-case"
                    className={`submenu-item ${
                      pathname === "/admin/administrative-case" ? "active" : ""
                    }`}
                  >
                    Dịch vụ pháp lý
                  </Link>
                </div>
              )}

              {/* Dịch vụ hành chính=================================================================
              <div
                className={`nav-item dropdown-service ${
                  adminDropdownOpen ? "open" : ""
                }`}
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
              >
                <div className="dropdown-left">
                  <RiAdminLine />
                  <span>Dịch vụ hành chính</span>
                </div>
                <IoIosArrowDown
                  className={`dropdown-icon ${
                    adminDropdownOpen ? "rotate" : ""
                  }`}
                />
              </div>
              {adminDropdownOpen && (
                <div className="submenu">
                  <Link
                    to="/admin/administrative-case"
                    className={`submenu-item ${
                      pathname === "/admin/administrative-case" ? "active" : ""
                    }`}
                  >
                    Dịch vụ pháp lý
                  </Link>
                  <Link
                    to="/admin/appointment-admin"
                    className={`submenu-item ${
                      pathname === "/admin/appointment-admin" ? "active" : ""
                    }`}
                  >
                    Lịch hẹn xét nghiệm
                  </Link>
                </div>
              )} */}

              {/* Lịch làm việc */}
              <Link
                to="/admin/slot-admin"
                className={`nav-item ${
                  pathname === "/admin/slot-admin" ? "active" : ""
                }`}
              >
                <CiCalendar /> Lịch làm việc
              </Link>

              {/* Quản lý phòng ban */}
              <Link
                to="/admin/department-admin"
                className={`nav-item ${
                  pathname === "/admin/department-admin" ? "active" : ""
                }`}
              >
                <HiOutlineOfficeBuilding /> Quản lý phòng ban
              </Link>

              {/* Dụng cụ y tế */}
              <Link
                to="/admin/kit-admin"
                className={`nav-item ${
                  pathname === "/admin/kit-admin" ? "active" : ""
                }`}
              >
                <IoIosMedkit /> Quản lý dụng cụ Y tế
              </Link>

              {/* Quản lý blogger */}
              <div
                className={`nav-item dropdown-service ${
                  blogDropdownOpen ? "open" : ""
                }`}
                onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
              >
                <div className="dropdown-left">
                  <IoDocumentAttachOutline />
                  <span>Quản lý blogger</span>
                </div>
                <IoIosArrowDown
                  className={`dropdown-icon ${
                    blogDropdownOpen ? "rotate" : ""
                  }`}
                />
              </div>
              {blogDropdownOpen && (
                <div className="submenu">
                  <Link
                    to="/admin/blog"
                    className={`submenu-item ${
                      pathname === "/admin/blog" ? "active" : ""
                    }`}
                  >
                    Danh sách các blog
                  </Link>
                  <Link
                    to="/admin/blog-category"
                    className={`submenu-item ${
                      pathname === "/admin/blog-category" ? "active" : ""
                    }`}
                  >
                    Danh mục các loại blog
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SidebarAdmin;
