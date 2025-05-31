// Get me from api - FE

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import axiosInstance from "../Api/axiosInstance";
import { API_BASE_URL } from "../Constants/apiConstants";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
   const [isLoading, setIsLoading] = useState(true);

  const token =
    useSelector((state) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

    const fetchUserData = async () => {
      try {
        if (!token) {
          // console.log("No token found");
          return;
        }
        const response = await axiosInstance.get(`${API_BASE_URL}/api/auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetch data user", error);
      }
    };
    useEffect(() => {
    fetchUserData();
  }, [token]);
  
  return {
    userId: user?._id,
    avatar: user?.avatar_url,
    firstName: user?.first_name,
    lastName: user?.last_name,
    address: user?.address,
    dob: user?.dob,
    phoneNumber: user?.phone_number,
    role: user?.role ,
    email: user?.email,
    user,
    refreshUserData: fetchUserData,
  };
};

export default useAuth;
