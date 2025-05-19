import React from "react";
import "./Sidebar.css";
import { MdOutlineDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

function Sidebar() {
  return (
    <div>
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">
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
           
            <a href="#" className="nav-item">
              <FaUserAlt /> Hồ sơ
            </a>
            
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
