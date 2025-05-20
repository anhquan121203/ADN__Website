import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";
import { createUser, getUserById, searchUser } from "../Feartures/admin/adminSlice";

const useAdmin = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error, total } = useSelector((state) => state.account);

  const searchUserPag = async (searchPayload) => {
    try {
      await dispatch(searchUser(searchPayload));
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const addNewUser = async (createNewUser) => {
    try {
     const response = await dispatch(createUser(createNewUser)).unwrap(); 
    return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const userById = async (id) => {
    try {
        await dispatch(getUserById(id));
    } catch (error) {
      console.error("Error create Staff");
        
    }
  }
    

  return { accounts, loading, error, total, searchUserPag, addNewUser, userById };
};

export default useAdmin;
