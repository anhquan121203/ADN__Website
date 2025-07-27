// Settup axiosIntance

import { API_BASE_URL } from "../Constants/apiConstants";
import axiosInstance from "./axiosInstance";

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/auth`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.Errors ||
      error.response?.data?.Message ||
      "An error occurred"
    );
  }
};


export const registerUser = async (userData) => {
  const formData = new FormData();

  // 👉 Convert address object to JSON string
  formData.append("address", JSON.stringify(userData.address));

  // Append the rest of fields
  Object.entries(userData).forEach(([key, value]) => {
    if (key !== "address" && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/users`,
      formData
      // ❌ KHÔNG set Content-Type, để Axios tự động thêm boundary
    );
    return response;
  } catch (error) {
    throw (
      error.response?.data?.Errors ||
      error.response?.data?.Message ||
      "An error occurred"
    );
  }
};

//  logout

// export const signOut = async () => {
//   try {
//     localStorage.removeItem("accessToken");
//     window.location.href = "/login";
//   } catch (error) {
//     console.error("Error logging out:", error);
//   }
// };

export const signOut = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw "Không tìm thấy accessToken trong localStorage";
    }

    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.Errors ||
      error.response?.data?.Message ||
      "Đăng xuất thất bại"
    );
  }
};

// Login with Google
export const loginWithGoogle = async (id_token) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/auth/google`,
      {
        google_id: id_token,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.Errors ||
      error.response?.data?.Message ||
      "Google login failed"
    );
  }
};

// Register with Google
export const registerWithGoogle = async (id_token) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/users/google`,
      { google_id: id_token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.Errors ||
      error.response?.data?.Message ||
      "Google register failed"
    );
  }
};
