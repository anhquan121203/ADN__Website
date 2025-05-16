import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./Footer.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoLogoTiktok } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="single-box">
              <img
                src={logo}
                alt
                style={{
                  width: "200px",
                  margin: "20px"
                }}
              />

              <h3>We Accect</h3>
              <div className="card-area">
                <i className="fa fa-cc-visa" />
                <i className="fa fa-credit-card" />
                <i className="fa fa-cc-mastercard" />
                <i className="fa fa-cc-paypal" />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-box">
              <h2>Hosting</h2>
              <ul>
                <li>
                  <Link>Trang chủ</Link>
                </li>
                <li>
                  <Link>Xét nghiệm DNA</Link>
                </li>
                <li>
                  <Link>Blogger</Link>
                </li>
                <li>
                  <Link>Hướng dẫ xét nghiệm</Link>
                </li>
                <li>
                  <Link>Về chúng tôi</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-box">
              <h2>Các chi nhánh</h2>
              <ul>
                <li className="address">
                  <CiLocationOn className="icon" />

                  <div>
                    <p>Thứ 2 - Thứ 6 08:00-19:00</p>
                    <p>Thứ 7 và Chủ nhật - Đóng cửa</p>
                  </div>

                </li>
                <li className="address">
                  {" "}
                  <CiLocationOn className="icon" />
                  <div>
                    <p>Địa chỉ</p>
                    <p>123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </li>
                <li className="address">
                  {" "}
                  <CiLocationOn className="icon" />
                  <div>
                    <p>Điện thoại</p>
                    <p>+84 123 456 789</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-box">
              <h2>Social</h2>
              <p>Email: ADNBlood@shopvn.com</p>
              <p>Hotline: (+84) 312812314</p>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email của bạn..."
                  aria-label="Enter your Email ..."
                  aria-describedby="basic-addon2"
                />
                <button className="input-group-text" id="basic-addon2">
                  <i className="fa fa-long-arrow-right" />
                </button>
              </div>
              <h2>Follow us on</h2>
              <p className="socials">
                <FaFacebookF />
                <FaInstagram />
                <FaYoutube />
                <IoLogoTiktok />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
