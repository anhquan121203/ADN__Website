import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import "./Register.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { registerUser, registerWithGoogle } from "../../../Api/authApi";
import { login } from "../../../Feartures/user/authSlice";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { Button, Modal } from "antd";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-logo">
          <img src={Logo} alt="Logo" />
        </div>
      </div>

      <div className="register-right">
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới của bạn</p>

        <p style={{ marginBottom: "-5px" }}>Hoặc đăng ký với Google</p>
        <div className="social-login">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const id_token = credentialResponse.credential;
              try {
                const response = await registerWithGoogle(id_token);
                const token = response.token;

                localStorage.setItem("accessToken", token);
                dispatch(login({ token }));
                toast.success("Đăng ký Google thành công ✅");
                showLoading();
                setTimeout(() => {
                  navigate("/login");
                }, 4000);
              } catch (error) {
                toast.error("Đăng ký thất bại!!!");
              }
            }}
            onError={() => {
              toast.error("Google login failed");
            }}
          />
        </div>

        <p>
          Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>

      <Modal
        title={<p><IoMdNotificationsOutline />Thông báo</p>}
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {loading ? (
          <p>Đang xử lý đăng ký...</p>
        ) : (
          <p>Vui lòng kiểm tra email để xác nhận!</p>
        )}
      </Modal>
    </div>
  );
}

export default Register;
