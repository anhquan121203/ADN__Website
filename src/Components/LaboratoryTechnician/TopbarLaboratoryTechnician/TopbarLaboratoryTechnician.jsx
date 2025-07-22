import React, { useState } from "react";
import "./TopbarLaboratoryTechnician.css";
import { FaBars } from "react-icons/fa";
import { CiLogout, CiSearch, CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline, IoMdArrowDropdown } from "react-icons/io";
import useAuth from "../../../Hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../../Feartures/user/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useSidebar } from "../../../Contexts/SidebarContext";

function TopbarLaboratoryTechnician() {
  const { firstName, lastName, email, avatar } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar, sidebarCollapsed } = useSidebar();

  const handleLogout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Logout API error:", error);
        toast.error("Đăng xuất thất bại, vui lòng thử lại!");
      } finally {
  
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
        navigate("/login");
        toast.success("Đăng xuất thành công!");
      }
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
              src={avatar || "https://via.placeholder.com/40"}
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
                  <Link to="/laboratory_technician" className="profile-link">
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

export default TopbarLaboratoryTechnician;
