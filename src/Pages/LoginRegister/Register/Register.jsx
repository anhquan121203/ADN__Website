import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import "./Register.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { registerUser, registerWithGoogle } from "../../../Api/authApi";
import { login } from "../../../Feartures/user/authSlice";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google"; 

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
                toast.success("Đăng ký bằng Google thành công ✅");

                navigate("/login");
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
    </div>
  );
}

export default Register;
