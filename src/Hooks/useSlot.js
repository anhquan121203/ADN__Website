import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";
import { data } from "react-router-dom";
import {
  changeStatus,
  createSlot,
  getSlotById,
  searchSlot,
  updateSlot,
} from "../Feartures/slots/slotSlice";

const useSlot = () => {
  const dispatch = useDispatch();
  const { slots, loading, error, total } = useSelector((state) => state.slot);

  const searchListSlot = async (searchPayload) => {
    try {
      await dispatch(searchSlot(searchPayload));
    } catch (error) {
      console.error("Error create service");
    }
  };

  const addNewSlot = async (createNewSlot) => {
    try {
      const response = await dispatch(createSlot(createNewSlot)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const slotById = async (id) => {
    try {
      const response = await dispatch(getSlotById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateSlotById = async (id, updateData) => {
    try {
      const response = await dispatch(updateSlot({ id, updateData })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  };

  // Change Status
  const changeStatusService = async ({ id, status }) => {
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

  return {
    slots,
    loading,
    error,
    total,
    searchListSlot,
    addNewSlot,
    slotById,
    updateSlotById,
    changeStatusService,
  };
};

export default useSlot;
