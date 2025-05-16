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
import { FaGoogle } from "react-icons/fa";

// ROUTER API GG
import { useGoogleLogin } from "@react-oauth/google";

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
      .min(6, "Password must be at least 6 characters")
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
        console.log(response)

        // Make sure we receive the correct tokens
        const token = response.data.token;
        if (token) {


          // Save token in localStorage
          localStorage.setItem("accessToken", token);
          // localStorage.setItem("refreshToken", refreshToken);

          // Dispatch login action
          dispatch(login({ token }));

          toast.success("Đăng nhập thành công ✅");

          navigate("/");

        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        toast.error("Email or password is incorrect");
      }
    },
  });

  // Handle Google login
  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const response = await loginWithGoogle(tokenResponse);
  //       console.log(response);
  //       const token = response.token; 

  //       localStorage.setItem("accessToken", token);
  //       dispatch(login({ token }));

  //       toast.success("Đăng nhập bằng Google thành công ✅");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Google login error:", error); 
  //       toast.error("Đăng nhập bằng Google thất bại");
  //     }
  //   },
  //   onError: () => toast.error("Google login failed"),
  // });

  const googleLogin = useGoogleLogin({
    flow: "implicit", // hoặc "auth-code" nếu bạn dùng backend token exchange
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      // 👇 Thêm dòng này để lấy id_token (JWT)
      const id_token = tokenResponse.id_token;

      try {
        const response = await loginWithGoogle(id_token);
        const token = response.token;

        localStorage.setItem("accessToken", token);
        dispatch(login({ token }));
        toast.success("Đăng nhập bằng Google thành công ✅");

        navigate("/");
      } catch (error) {
        toast.error("Đăng nhập bằng Google thất bại");
      }
    },
    onError: () => toast.error("Google login failed"),
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
          <button
            type="submit"
            className="btn btn-social"
            onClick={() => googleLogin()}
          >
            <FaGoogle className="social-icon" />
            Google
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
