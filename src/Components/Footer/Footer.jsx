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
                  marginBottom: "-50px",
                  marginTop: "-70px",
                }}
              />
              <p style={{ marginTop: "20px", alignItems: "center" }}>
                Your skin is your bodys largest organ, and it deserves all the
                care and love you can give.
              </p>
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
                  <Link>Sản phẩm</Link>
                </li>
                <li>
                  <Link>Khuyến mãi</Link>
                </li>
                <li>
                  <Link>Blogger</Link>
                </li>
                <li>
                  <Link>Hỗ chợ khách hàng</Link>
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
                  <p>182 Pasteur, Bến Nghé, Quận 1, Hồ Chí Minh</p>
                </li>
                <li className="address">
                  {" "}
                  <CiLocationOn className="icon" />
                  <p>110 Lê Văn Sỹ, Phường 10, Phú Nhuận, Hồ Chí Minh</p>
                </li>
                <li className="address">
                  {" "}
                  <CiLocationOn className="icon" />
                  <p>277 Phan Xích Long, Phường 2, Phú Nhuận, Hồ Chí Minh</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-box">
              <h2>Social</h2>
              <p>Email: Beutylove@shopvn.com</p>
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
