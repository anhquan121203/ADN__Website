import React, { useState } from "react";
import "./Login.css";
import logo from "../../../assets/images/logo.png";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../../Api/authApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../../Feartures/user/authSlice";
import { FaGoogle } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword] = useState(false);
  const dispatch = useDispatch();

  // Schema Yup cho form validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Bắt buộc nhập email!"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Bắt buộc nhập mật khẩu!"),
  });

  // Sử dụng Formik để quản lý form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values);

        // Make sure we receive the correct tokens
        if (response?.accessToken && response?.refreshToken) {
          const { accessToken, refreshToken } = response;

          // Save token in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Dispatch login action
          dispatch(login({ accessToken, refreshToken }));

          toast.success("Đăng nhập thành công ✅");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        toast.error("Email or password is incorrect");
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <img src={logo} alt="logo page" />
        </div>

      </div>

      {/* LOGIN RIGHT***************** */}
      <div className="login-right">
        <h2>Đăng nhập</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email..."
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="**********"
              required
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" style={{ marginRight: "5px" }} />
              Giữ đăng nhập lần sau!!!
            </label>
            <Link>Quên mật khẩu</Link>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đăng nhập..." : "Đăng nhập"}{" "}
          </button>
        </form>

        <p style={{ marginBottom: "-5px" }}>Hoặc đăng nhập với Google</p>
        <div className="social-login">
          <button type="button" class="btn btn-social">
            <FaGoogle className="social-icon"/>Google
          </button>
        </div>

        <p>
          Không có tài không? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
