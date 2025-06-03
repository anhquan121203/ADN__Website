import axios from "axios";
import { API_BASE_URL } from "../Constants/apiConstants";

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 giây
});

// INTERCEPTOR REQUEST **********************************************
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE **********************************************
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout. Server may be slow or offline.");
    }

    if (error.response && error.response.status === 401) {
      console.warn("🔐 Unauthorized - Access token có thể đã hết hạn hoặc sai.");
      // redirect đến trang login hoặc clear localStorage
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
