// Settup axiosIntance

import { API_BASE_URL } from "../Constants/apiConstants";
import axiosInstance from "./axiosInstance";
import * as jwt_decode from "jwt-decode"; 


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

export const loginWithGoogle = async (credentialResponse) => {
  try {
    const decoded = jwt_decode(credentialResponse.credential);

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/auth/google`,
      {
        google_id: decoded.sub,
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