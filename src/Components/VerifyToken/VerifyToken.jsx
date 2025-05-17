// Khi user click vào email link: /verify-email/<token>, route này chạy
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../Api/axiosInstance";
import { API_BASE_URL } from "../../Constants/apiConstants";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/auth/verify-token`,
          { token }
        );
        toast.success("Xác minh email thành công ✅");
        navigate("/login");
      } catch (err) {
        toast.error("Xác minh thất bại ❌");
        navigate("/register");
      }
    };

    verifyEmail();
  }, [token]);

  return <p>Đang xác minh email...</p>;
}

export default VerifyEmail;
