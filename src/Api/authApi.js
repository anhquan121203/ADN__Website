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
      `${API_BASE_URL}/api/users`,
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
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
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

// Verify token
