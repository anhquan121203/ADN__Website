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
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/appointment">
              <FaCog className="menu-icon" />
              <span className="menu-text">Appointment</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/service">
              <FaCreditCard className="menu-icon" />
              <span className="menu-text">Service</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/department">
              <FaInbox className="menu-icon" />
              <span className="menu-text">Department</span>
            </Link>
          </li>
          <li>
            <Link to="/staff/slot">
              <FaAddressBook className="menu-icon" />
              <span className="menu-text">Slot</span>
            </Link>
          </li>
          <li>
            <Link to="/projects">
              <FaProjectDiagram className="menu-icon" />
              <span className="menu-text">Projects</span>
            </Link>
          </li>
          <li>
            <Link to="/onboarding">
              <FaHandshake className="menu-icon" />
              <span className="menu-text">Onboarding</span>
            </Link>
          </li>
          <li>
            <Link to="/staff">
              <FaUser className="menu-icon" />
              <span className="menu-text">User Profile</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <ul>
          <li>
            <Link to="/help">
              <FaQuestionCircle className="menu-icon" />
              <span className="menu-text">Help</span>
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <FaSignOutAlt className="menu-icon" />
              <span className="menu-text">Logout</span>
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
