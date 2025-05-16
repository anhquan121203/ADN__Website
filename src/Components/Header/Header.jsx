import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { CiClock2, CiLocationOn, CiTwitter, CiUser } from "react-icons/ci";
import "./Header.css";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaFacebookF, FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Trigger after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header-container ${isScrolled ? "scrolled" : ""}`}>
      {/* HEADER TOP */}
      <div className="header-top">
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

      <nav className="navBar-menu">
        <ul>
          <li>
            <a href="/">Trang chủ</a>
          </li>
          <li>
            <a href="/booking">Xét nghiệm DNA</a>
          </li>
          <li>
            <a href="#">Blogger</a>
          </li>
          <li>
            <a href="#">Hướng dẫn xét nghiệm</a>
          </li>
          <li>
            <a href="#">Về chúng tôi</a>
          </li>
        </ul>

        <div className="navBar-menu__login">
          <CiTwitter className="navBar-menu__icon" />
          <FaFacebookF className="navBar-menu__icon" />
          {/* <CiUser  className="navBar-menu__icon"/> */}
          <Link to="/login">
            <button className="button--menu__login">Đăng nhập</button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
