import React, { useEffect, useState } from "react";
import "./SidebarStaff.css";
import {
  MdOutlineDashboard,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDown, IoIosMedkit } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import { FaUser, FaFlask } from "react-icons/fa";
import { useSidebar } from "../../Contexts/SidebarContext";

function SidebarStaff() {
  const location = useLocation();
  const { pathname } = location;
  const { sidebarCollapsed } = useSidebar();

  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [scheduleDropdownOpen, setScheduleDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    setServiceDropdownOpen(
      pathname.startsWith("/staff/service") ||
        pathname.startsWith("/staff/appointment")
    );
    setScheduleDropdownOpen(
      pathname.startsWith("/staff/slot") ||
        pathname.startsWith("/staff/confirm-slots")
    );
    setAdminDropdownOpen(
      pathname.startsWith("/staff/appointment-admin/case")
    );
  }, [pathname]);

  // Close dropdowns when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setServiceDropdownOpen(false);
      setScheduleDropdownOpen(false);
    }
  }, [sidebarCollapsed]);

  return (
    <div>
      <aside className={`sidebar-staff ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          <div className="top-staff">
            <div className="top-staff__icon">
              <FaUserTie />
            </div>
            {!sidebarCollapsed && <span className="title-name">Staff Dashboard</span>}
          </div>
          <nav className="nav-staff">
            <div className="nav-group">
              {/* Dashboard */}
              <Link
                to="/staff/dashboard"
                className={`nav-item ${
                  pathname === "/staff/dashboard" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Dashboard" : ""}
              >
                <MdOutlineDashboard /> {!sidebarCollapsed && "Dashboard"}
              </Link>
              {/* Hồ sơ cá nhân */}
              <Link
                to="/staff"
                className={`nav-item ${
                  pathname === "/staff" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Hồ sơ cá nhân" : ""}
              >
                <FaUser /> {!sidebarCollapsed && "Hồ sơ cá nhân"}
              </Link>

              {/* Quản lý dịch vụ */}
              {!sidebarCollapsed ? (
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
              ) : (
                <div className="nav-item" title="Quản lý dịch vụ">
                  <MdOutlineMiscellaneousServices />
                </div>
              )}
              {serviceDropdownOpen && !sidebarCollapsed && (
                <div className="submenu">
                  <Link
                    to="/staff/service"
                    className={`submenu-item ${
                      pathname === "/staff/service" ? "active" : ""
                    }`}
                  >
                    Danh sách dịch vụ
                  </Link>
                  <Link
                    to="/staff/appointment"
                    className={`submenu-item ${
                      pathname === "/staff/appointment" ? "active" : ""
                    }`}
                  >
                    Quản lý lịch hẹn
                  </Link>
                </div>
              )}

              {/* Quản lý lịch làm việc */}
              {!sidebarCollapsed ? (
                <div
                  className={`nav-item dropdown-service ${
                    scheduleDropdownOpen ? "open" : ""
                  }`}
                  onClick={() => setScheduleDropdownOpen(!scheduleDropdownOpen)}
                >
                  <div className="dropdown-left">
                    <CiCalendar />
                    <span>Lịch làm việc</span>
                  </div>
                  <IoIosArrowDown
                    className={`dropdown-icon ${
                      scheduleDropdownOpen ? "rotate" : ""
                    }`}
                  />
                </div>
              ) : (
                <div className="nav-item" title="Lịch làm việc">
                  <CiCalendar />
                </div>
              )}
              {scheduleDropdownOpen && !sidebarCollapsed && (
                <div className="submenu">
                  <Link
                    to="/staff/slot"
                    className={`submenu-item ${
                      pathname === "/staff/slot" ? "active" : ""
                    }`}
                  >
                    Ca làm việc
                  </Link>
                  <Link
                    to="/staff/confirm-slots"
                    className={`submenu-item ${
                      pathname === "/staff/confirm-slots" ? "active" : ""
                    }`}
                  >
                    Xác nhận lịch làm việc
                  </Link>
                </div>
              )}

              {/* Quản lý phòng ban */}
              <Link
                to="/staff/appointment-admin/case"
                className={`nav-item ${
                  pathname === "/staff/appointment-admin/case" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Đặt lịch hành chính" : ""}
              >
                <HiOutlineOfficeBuilding /> {!sidebarCollapsed && "Đặt lịch hành chính"}
              </Link>

              {/* Quản lý phòng ban */}
              <Link
                to="/staff/department"
                className={`nav-item ${
                  pathname === "/staff/department" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Quản lý phòng ban" : ""}
              >
                <HiOutlineOfficeBuilding /> {!sidebarCollapsed && "Quản lý phòng ban"}
              </Link>

              {/* Vật mẫu */}
              <Link
                to="/staff/sample"
                className={`nav-item ${
                  pathname === "/staff/sample" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Vật mẫu" : ""}
              >
                <FaFlask /> {!sidebarCollapsed && "Vật mẫu"}
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SidebarStaff;
