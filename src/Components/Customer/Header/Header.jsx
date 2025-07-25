import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import {
  CiClock2,
  CiLocationOn,
  CiLogout,
  CiSettings,
  CiTwitter,
  CiUser,
} from "react-icons/ci";
import "./Header.css";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaFacebookF, FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Feartures/user/authSlice";
import { signOut } from "../../../Api/authApi";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../Hooks/useAuth";
import { FaCircleUser } from "react-icons/fa6";
import { FcManager } from "react-icons/fc";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isOpen, setIsOpen] = useState();
  const { role, firstName, lastName, avatar } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(role);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      navigate("/");
      toast.success("Đăng xuất thành công!");
    }
  };

  // Add this function to get avatar fallback
  const getAvatarContent = () => {
    if (avatar) {
      return (
        <img
          style={{
            width: "50px",
            marginRight: "20px",
            height: "50px",
            border: "2px solid  #22a8e7",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onClick={toggleDropdown}
          className="dropdown-button"
          src={avatar}
          alt=""
        />
      );
    }
    return (
      <div
        style={{
          width: "50px",
          marginRight: "20px",
          height: "50px",
          border: "2px solid #22a8e7",
          borderRadius: "50%",
          backgroundColor: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#4a5568",
          cursor: "pointer",
        }}
        onClick={toggleDropdown}
        className="dropdown-button"
      >
        {lastName ? lastName.charAt(0).toUpperCase() : <FaCircleUser />}
      </div>
    );
  };

  return (
    <div className={`header-container ${isScrolled ? "scrolled" : ""}`}>
      {/* HEADER TOP */}
      <div className="header-top">
        <div className="header__top-menu">
          <div className="top-menu">
            <div className="top--logo">
              <img src={logo} alt="ADN Logo" />
            </div>

            {/* INFOR MENU */}
            <div className="top--infor">
              <div className="top--infor__item">
                <CiClock2 className="header-icon" />
                <div>
                  <strong>Thứ 2 - Thứ 6 08:00-19:00</strong>
                  <br />
                  <span>Thứ 7 và Chủ nhật - Đóng cửa</span>
                </div>
              </div>

              <div className="top--infor__item">
                <CiLocationOn className="header-icon" />
                <div>
                  <strong>Địa chỉ</strong>
                  <br />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>

              <div className="top--infor__item">
                <IoPhonePortraitOutline className="header-icon" />
                <div>
                  <strong>Điện thoại</strong>
                  <br />
                  <span>+84 123 456 789</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navBar-menu">
        <div className="nav-content">
          <ul>
            <li>
              <Link
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/service"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Xét nghiệm DNA
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/guide"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Hướng dẫn xét nghiệm
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Về chúng tôi
              </Link>
            </li>
          </ul>

          <div className="navBar-menu__login">
            <ul>
              <li>
                <CiTwitter className="navBar-menu__icon" />
              </li>
              <li>
                <FaFacebookF className="navBar-menu__icon" />
              </li>

              {isLoggedIn ? (
                <li>
                  <div className="dropdown-login">
                    <div className="header-avavtar">{getAvatarContent()}</div>

                    {isOpen && (
                      <div className="dropdown-content">
                        {role === "customer" ? (
                          <>
                            <div style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '2px solid #eee' }}>
                              {firstName} {lastName}
                            </div>
                            <Link to="/customer">Profile</Link>
                            <Link to="/history">Lịch sử xét nghiệm</Link>
                          </>
                        ) : role === "staff" ? (
                          <>
                            <Link to="/staff">Người lấy mẫu</Link>
                          </>
                        ) : role === "manager" ? (
                          <>
                            <Link to="/manager">Người quản lý</Link>
                          </>
                        ) : role === "laboratory_technician" ? (
                          <>
                            <Link to="/laboratory_technician">Kỹ thuật viên</Link>
                          </>
                        ) : (
                          <>
                            <Link to="/admin">Dashboard</Link>
                          </>
                        )}

                        <a onClick={handleLogout}>Thoát</a>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <li>
                  <Link to="/login">
                    <FaCircleUser className="navBar-menu__icon" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
