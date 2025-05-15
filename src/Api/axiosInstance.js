import axios from "axios";
import { API_BASE_URL } from "../Constants/apiConstants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// SETUP AXIOS INSTANCE *************************************************
axiosInstance.interceptors.request.use(
  (config) => {
    // Check hệ thống có access_token hay không và cập nhật Authorization header nếu có
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =======================================================================================================

axiosInstance.interceptors.response.use(
  (response) => {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    return response;
  },
  async (error) => {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger
    if (error.response && error.response.status === 401) {
      try {
        // kiểm tra refereshToken
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(API_BASE_URL + "/refresh", {
          refreshToken,
        });
        // Lưu access-token mới vào localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        // Cập nhật lại token mới vào headers và gửi lại request ban đầu

        // store.
        store.dispatch(
          login({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );

        error.config.headers["Authorization"] =
          "Bearer" + " " + data.accessToken;
        // Gọi lại API ban đầu này với axiosInstance để thực thi

        return axiosInstance(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;