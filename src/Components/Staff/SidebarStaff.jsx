import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarStaff.css';
import logo from '../../assets/images/logo.png'; // Import the logo image
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
  FaChevronRight
} from 'react-icons/fa';

function SidebarStaff() {
  const [isCollapsed, setIsCollapsed] = useState(false); // Default to collapsed state

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar-staff ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {isCollapsed ? (
            <Link to= "/">
            <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          ) : (
            <Link to= "/">
            <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          )}
        </div>
      </div>
      
      <div className="sidebar-menu">
        <ul>
          <li className='active'>
            <Link to="/dashboard">
              <FaChartPie className="menu-icon" />
              <span className="menu-text">Bảng điều khiển</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/appointment">
              <FaCog className="menu-icon" />
              <span className="menu-text">Lịch hẹn</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/service">
              <FaCreditCard className="menu-icon" />
              <span className="menu-text">Dịch vụ</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/department">
              <FaInbox className="menu-icon" />
              <span className="menu-text">Phòng ban</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/slot">
              <FaAddressBook className="menu-icon" />
              <span className="menu-text">Ca làm việc</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/confirm-slots">
              <FaProjectDiagram className="menu-icon" />
              <span className="menu-text">Xác nhận lịch làm việc</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/sample">
              <FaHandshake className="menu-icon" />
              <span className="menu-text">Vật mẫu</span>
            </Link>
          </li>
          <li>
            <Link to="/staff">
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

export default SidebarStaff;
