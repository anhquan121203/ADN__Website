import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import { data } from "react-router-dom";
import {
  changeStatus,
  createKit,
  deleteKit,
  getKitById,
  searchKit,
  updateKit,
} from "../Feartures/kits/kitSlice";

const useKit = () => {
  const dispatch = useDispatch();
  const { kits, loading, error, total } = useSelector((state) => state.kit);

  // CRUD SLOT
  // const searchListSlot = (searchPayload) => {
  //   dispatch(searchSlot(searchPayload));
  // };

  const searchListKit = useCallback(
    (searchPayload) => {
      dispatch(searchKit(searchPayload));
    },
    [dispatch]
  );

  const addNewKit = async (createNewKit) => {
    try {
      const response = await dispatch(createKit(createNewKit)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const kitById = async (id) => {
    try {
      const response = await dispatch(getKitById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateKitById = async (id, updateData) => {
    try {
      const response = await dispatch(updateKit({ id, updateData })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  };

  const deletekitById = async (id) => {
    try {
      const response = await dispatch(deleteKit(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Xóa tài khoản không thành công" };
    }
  };

  // Change Status
  const changeStatusKit = async ({ id, status }) => {
    try {
      const response = await dispatch(changeStatus({ id, status })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: "Thay đổi trạng thái tài khoản không thành công",
      };
    }
  };

  const returnKitById = async (id, returnData) => {
    try {
      const response = await dispatch(
        updateKit({ id, updateData: returnData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Trả hàng không thành công!" };
    }
  };

  return {
    kits,
    loading,
    error,
    total,
    searchListKit,
    addNewKit,
    kitById,
    updateKitById,
    deletekitById,
    changeStatusKit,
    returnKitById,
  };
};

export default useKit;
