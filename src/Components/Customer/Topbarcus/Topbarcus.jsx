import React, { useState } from "react";
import "./Topbarcus.css";
import { FaBars } from "react-icons/fa";
import { CiLogout, CiSearch, CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline, IoMdArrowDropdown } from "react-icons/io";
import useAuth from "../../../Hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../../Feartures/user/authSlice";
import { useNavigate } from "react-router-dom";
import { FcManager } from "react-icons/fc";

function Topbarcus() {
  const { firstName, lastName, email, avatar } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        <button className="topbar-icon__menu">
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
                  <span>
                    <FcManager />
                  </span>{" "}
                  Hồ sơ
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
export default Topbarcus;


