import React, { useEffect, useState } from "react";
import "./SidebarLaboratoryTechnician.css";
import {
  FaVial,
  FaClipboardList,
  FaMicroscope,
  FaFileMedicalAlt,
  FaUser,
  FaFlask
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "../../../Contexts/SidebarContext";

function SidebarLaboratoryTechnician() {
  const location = useLocation();
  const { pathname } = location;
  const { sidebarCollapsed } = useSidebar();

  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);

  useEffect(() => {
    setSampleDropdownOpen(
      pathname.startsWith("/laboratory_technician/samples") ||
        pathname.startsWith("/laboratory_technician/results") ||
        pathname.startsWith("/laboratory_technician/view-samples")
    );
  }, [pathname]);

  // Close dropdowns when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setSampleDropdownOpen(false);
    }
  }, [sidebarCollapsed]);

  return (
    <div>
      <aside className={`sidebar-lab ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          <div className="top-lab">
            <div className="top-lab__icon">
              <FaFlask />
            </div>
            {!sidebarCollapsed && <span className="title-name">Lab Technician</span>}
          </div>
          <nav className="nav-lab">
            <div className="nav-group">
              {/* Quản lý mẫu xét nghiệm */}
             <Link
                to="/laboratory_technician/dashboard"
                className={`nav-item ${
                  pathname === "/laboratory_technician/dashboard" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Thống kê" : ""}
              >
                <FaMicroscope /> {!sidebarCollapsed && "Thống kê"}
              </Link>

              {!sidebarCollapsed ? (
                <div
                  className={`nav-item dropdown-service ${
                    sampleDropdownOpen ? "open" : ""
                  }`}
                  onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
                >
                  <div className="dropdown-left">
                    <FaVial />
                    <span>Quản lý mẫu xét nghiệm</span>
                  </div>
                  <IoIosArrowDown
                    className={`dropdown-icon ${
                      sampleDropdownOpen ? "rotate" : ""
                    }`}
                  />
                </div>
              ) : (
                <div className="nav-item" title="Quản lý mẫu xét nghiệm">
                  <FaVial />
                </div>
              )}
              {sampleDropdownOpen && !sidebarCollapsed && (
                <div className="submenu">
                  <Link
                    to="/laboratory_technician/samples"
                    className={`submenu-item ${
                      pathname === "/laboratory_technician/samples" ? "active" : ""
                    }`}
                  >
                    Xác nhận mẫu trước khi xét nghiệm
                  </Link>
                  <Link
                    to="/laboratory_technician/results"
                    className={`submenu-item ${
                      pathname === "/laboratory_technician/results" ? "active" : ""
                    }`}
                  >
                    Kết quả xét nghiệm
                  </Link>
                </div>
              )}

              {/* Thiết bị */}
              <Link
                to="/laboratory_technician/equipment"
                className={`nav-item ${
                  pathname === "/laboratory_technician/equipment" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Thiết bị" : ""}
              >
                <FaMicroscope /> {!sidebarCollapsed && "Thiết bị"}
              </Link>

              {/* Báo cáo */}
              <Link
                to="/laboratory_technician/reports"
                className={`nav-item ${
                  pathname === "/laboratory_technician/reports" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Báo cáo" : ""}
              >
                <FaFileMedicalAlt /> {!sidebarCollapsed && "Báo cáo"}
              </Link>

              {/* Hồ sơ cá nhân */}
              <Link
                to="/laboratory_technician"
                className={`nav-item ${
                  pathname === "/laboratory_technician" ? "active" : ""
                }`}
                title={sidebarCollapsed ? "Hồ sơ cá nhân" : ""}
              >
                <FaUser /> {!sidebarCollapsed && "Hồ sơ cá nhân"}
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SidebarLaboratoryTechnician;