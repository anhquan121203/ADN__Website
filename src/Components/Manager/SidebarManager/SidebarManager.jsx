import React, { useEffect, useState } from "react";
import "./SidebarManger.css";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaUser,
  FaCog,
  FaAddressBook,
  FaUserTie,
  FaProjectDiagram,
  FaHandshake,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaUsersCog,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "../../../Contexts/SidebarContext";

function SidebarManager() {
  const location = useLocation();
  const { pathname } = location;
  const { sidebarCollapsed } = useSidebar();

  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);

  useEffect(() => {
    setAppointmentDropdownOpen(
      pathname.startsWith("/manager/appointments")
    );
  }, [pathname]);

  // Close dropdowns when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setAppointmentDropdownOpen(false);
    }
  }, [sidebarCollapsed]);

  return (
    <div>
      <aside className={`sidebar-manager ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          <div className="top-manager">
            <div className="top-manager__icon">
              <FaUserTie />
            </div>
            {!sidebarCollapsed && <span className="title-name">Manager Dashboard</span>}
          </div>
          <nav className="nav-manager">
            <div className="nav-group">
              {/* Dashboard */}
              <Link
                to="/manager"
                className={`nav-item ${
                  pathname === "/manager" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Hồ sơ cá nhân" : ""}
              >
                <FaUser /> {!sidebarCollapsed && "Hồ sơ cá nhân"}
              </Link>

              {/* Quản lý đặt lịch */}
              {!sidebarCollapsed ? (
                <div
                  className={`nav-item dropdown-service ${
                    appointmentDropdownOpen ? "open" : ""
                  }`}
                  onClick={() => setAppointmentDropdownOpen(!appointmentDropdownOpen)}
                >
                  <div className="dropdown-left">
                    <FaCog />
                    <span>Quản lý đặt lịch</span>
                  </div>
                  <IoIosArrowDown
                    className={`dropdown-icon ${
                      appointmentDropdownOpen ? "rotate" : ""
                    }`}
                  />
                </div>
              ) : (
                <div className="nav-item" title="Quản lý đặt lịch">
                  <FaCog />
                </div>
              )}
              {appointmentDropdownOpen && !sidebarCollapsed && (
                <div className="submenu">
                  <Link
                    to="/manager/appointments"
                    className={`submenu-item ${
                      pathname === "/manager/appointments" ? "active" : ""
                    }`}
                  >
                    Danh sách đặt lịch
                  </Link>
                </div>
              )}

              {/* Phòng ban */}
              <Link
                to="/manager/department-manager"
                className={`nav-item ${
                  pathname === "/manager/department-manager" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Phòng ban" : ""}
              >
                <FaAddressBook /> {!sidebarCollapsed && "Phòng ban"}
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SidebarManager;
