// filepath: e:\Ky_Summer_2025\WDP301\ADN__Website\src\Components\Manager\TopbarManager\TopbarManager.jsx
import React, { useState } from "react";
import "./TopbarManager.css";
import { FaBars } from "react-icons/fa";
import { CiLogout, CiSettings } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import useAuth from "../../../Hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../../Feartures/user/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useSidebar } from "../../../Contexts/SidebarContext";

function TopbarManager() {
  const { firstName, lastName, email } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar, sidebarCollapsed } = useSidebar();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <button
          className={`topbar-icon__menu ${sidebarCollapsed ? 'collapsed' : ''}`}
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
      </div>

      <div className="topbar-right">
        <div
          className="topbar-profile-wrapper"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="topbar-profile">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5B_Pc5VMtw8ze74lJ0QYcdSif6a3qMQ-kg&s"
              alt="Profile"
            />
            <span>
              {firstName} {lastName}
            </span>
            <IoMdArrowDropdown />
          </div>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <div className="topbar-dropdown__header">
                <strong>
                  {firstName} {lastName}
                </strong>
                <p>{email}</p>
              </div>
              <ul className="topbar-dropdown__menu">
                <li>
                  <Link to="/manager" className="profile-link">
                    <span>
                      <FaUser style={{ marginRight: 10 }} />
                    </span>{" "}
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <span>
                    <CiSettings />
                  </span>{" "}
                  Cài đặt
                </li>
                <hr />
                <li onClick={handleLogout}>
                  <span>
                    <CiLogout />
                  </span>{" "}
                  Sign out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopbarManager;