import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import {
  createUser,
  getUserById,
  searchUser,
  updateUser,
  deleteUser,
  changeStatus,
} from "../Feartures/admin/adminSlice";

const useAdmin = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error, total } = useSelector(
    (state) => state.account
  );

  // const searchUserPag = async (searchPayload) => {
  //   try {
  //     await dispatch(searchUser(searchPayload));
  //   } catch (error) {
  //     console.error("Error create Staff");
  //   }
  // };

   const searchUserPag = useCallback(
      (searchPayload) => {
        dispatch(searchUser(searchPayload));
      },
      [dispatch]
    );

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
      const response = await dispatch(getUserById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateUserById = async (id, updateData) => {
    try {
      const response = await dispatch(updateUser({ id, updateData })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật tài khoản không thành công" };
    }
  };

  const deleteUserById = async (id) => {
    try {
      const response = await dispatch(deleteUser(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Xóa tài khoản không thành công" };
    }
  };

  // Change Status
  const changeStatusUser = async(userId) => {
    try {
      const response = await dispatch(changeStatus(userId)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Thay đổi trạng thái tài khoản không thành công" };
    }
  }


  return {
    accounts,
    loading,
    error,
    total,
    searchUserPag,
    addNewUser,
    userById,
    updateUserById,
    deleteUserById,
    changeStatusUser,
  };
};

export default useAdmin;
