import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SidebarManger.css";
import logo from "../../../assets/images/logo.png"; // Import the logo image
import {
  FaHome,
  FaChartPie,
  FaUser,
  FaCog,
  FaCreditCard,
  FaInbox,
  FaAddressBook,
  FaProjectDiagram,
  FaHandshake,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

function SidebarManager() {
  const [isCollapsed, setIsCollapsed] = useState(false); // Default to collapsed state

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar-manager ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          {isCollapsed ? (
            <Link to="/">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          ) : (
            <Link to="/">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          )}
        </div>
      </div>

      <div className="sidebar-menu">
        <ul>
          <li className="active">
            <Link to="/dashboard">
              <FaChartPie className="menu-icon" />
              <span className="menu-text">Bảng điều khiển</span>
            </Link>
          </li>
          <li>
            <Link to="/manager/appointments">
              <FaCog className="menu-icon" />
              <span className="menu-text">Quản lý đặt lịch</span>
            </Link>
          </li>
          <li>
            <Link to="/payments">
              <FaCreditCard className="menu-icon" />
              <span className="menu-text">Thanh toán</span>
            </Link>
          </li>
          <li>
            <Link to="/inbox">
              <FaInbox className="menu-icon" />
              <span className="menu-text">Hộp thư</span>
            </Link>
          </li>
          <li>
            <Link to="/manager/department-manager">
              <FaAddressBook className="menu-icon" />
              <span className="menu-text">Phòng ban</span>
            </Link>
          </li>
          <li>
            <Link to="/projects">
              <FaProjectDiagram className="menu-icon" />
              <span className="menu-text">Dự án</span>
            </Link>
          </li>
          <li>
            <Link to="/onboarding">
              <FaHandshake className="menu-icon" />
              <span className="menu-text">Hội nhập</span>
            </Link>
          </li>
          <li>
            <Link to="/manager">
              <FaUser className="menu-icon" />
              <span className="menu-text">Hồ sơ cá nhân</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <ul>
          <li>
            <Link to="/help">
              <FaQuestionCircle className="menu-icon" />
              <span className="menu-text">Trợ giúp</span>
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <FaSignOutAlt className="menu-icon" />
              <span className="menu-text">Đăng xuất</span>
            </Link>
          </li>
        </ul>
        <div className="collapse-button">
          <button onClick={toggleSidebar}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarManager;
