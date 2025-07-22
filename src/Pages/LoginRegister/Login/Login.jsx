import React, { useState } from "react";
import "./Login.css";
import logo from "../../../assets/images/logo.png";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser, loginWithGoogle } from "../../../Api/authApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../../Feartures/user/authSlice";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Vui lòng nhập email hợp lệ!")
      .required("Bắt buộc nhập email!"),
    password: Yup.string().required("Bắt buộc nhập mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values);
        const token = response.data.token;

        if (token) {
          localStorage.setItem("accessToken", token);
          dispatch(login({ token }));
          toast.success("Đăng nhập thành công ✅");
          navigate("/");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        toast.error("Email hoặc mật khẩu không đúng");
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
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="**********"
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#555",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" style={{ marginRight: "5px" }} />
              Giữ đăng nhập lần sau!!!
            </label>
            <Link to="/forgot-password">Quên mật khẩu</Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p style={{ marginBottom: "-5px" }}>Hoặc đăng nhập với Google</p>

        <div className="social-login">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const id_token = credentialResponse.credential;
              try {
                const response = await loginWithGoogle(id_token);
                const token =
                  response.data.acceesToken ||
                  response.token ||
                  response.data.token;

                localStorage.setItem("accessToken", token);
                dispatch(login({ token }));
                toast.success("Đăng nhập bằng Google thành công");
                navigate("/");
              } catch (error) {
                toast.error("Đăng nhập bằng Google thất bại");
              }
            }}
            onError={() => {
              toast.error("Google login failed");
            }}
          />
        </div>

        <p>
          Không có tài khoản? <Link to="/register"> <span style={{fontWeight: "bold", color: "black", textDecoration: "underline"}}>Đăng ký</span></Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
