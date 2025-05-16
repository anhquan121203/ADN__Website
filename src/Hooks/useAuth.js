// Get me from api - FE

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_API_URL } from "../Constants/userContant";
import axios from "axios";
import axiosInstance from "../Api/axiosInstance";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const token =
    useSelector((state) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axiosInstance.get(`${PROFILE_API_URL}/GetUserProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        // console.log(response.data)

       
      } catch (error) {
        console.error("Error fetch data user", error);
      }
    };
    fetchUserData();
  }, [token]);

  

  return {
    userId: user?.id,
    avatar: avatar,
    firstName: user?.firstName,
    lastName: user?.lastName,
    address: user?.address,
    birthday: user?.birthday,
    phoneNumber: user?.phoneNumber,
    roleName: user?.roleName,
    email: user?.email,
    user,
  };
};

export default useAuth;
