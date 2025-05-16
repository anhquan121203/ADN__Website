// Settup axiosIntance

import { API_BASE_URL } from "../Constants/apiConstants";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";


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
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/account/register`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
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

export const signOut = async () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// export const loginWithGoogle = async (credentialResponse) => {
//   try {
//     const decoded = jwt_decode(credentialResponse.credential);

//     const response = await axiosInstance.post(
//       `${API_BASE_URL}/api/auth/google`,
//       { google_id: decoded.sub },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     return response;
//   } catch (error) {
//     throw (
//       error.response?.data?.Errors ||
//       error.response?.data?.Message ||
//       "Google login failed"
//     );
//   }
// };

// export const loginWithGoogle = async (credentialResponse) => {
//   try {
//     const credential =
//       credentialResponse?.credential || credentialResponse?.access_token;

//     if (!credential) {
//       throw "Không nhận được credential từ Google!";
//     }

//     const decoded = jwtDecode(credential);
//     const googleId = decoded.sub;

//     if (!googleId) {
//       throw "Không lấy được google_id từ credential!";
//     }

//     const response = await axiosInstance.post(
//       `${API_BASE_URL}/api/auth/google`,
//       {
//         google_id: googleId,
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Google login failed:", error);
//     throw (
//       error?.response?.data?.Errors ||
//       error?.response?.data?.Message ||
//       error?.message ||
//       "Google login failed"
//     );
//   }
// };


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
