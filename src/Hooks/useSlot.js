import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import { data } from "react-router-dom";
import {
  changeStatus,
  createSlot,
  getSlotById,
  getSlotByStaffId,
  searchSlot,
  updateSlot,
  getAvailableSlots,
} from "../Feartures/slots/slotSlice";

const useSlot = () => {
  const dispatch = useDispatch();
  const { slots, loading, error, total } = useSelector(
    (state) => state.slot
  );

  // CRUD SLOT
  // const searchListSlot = (searchPayload) => {
  //   dispatch(searchSlot(searchPayload));
  // };

  const searchListSlot = useCallback(
    (searchPayload) => {
      dispatch(searchSlot(searchPayload));
    },
    [dispatch]
  );

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
  const changeStatusSlot = async ({ id, status }) => {
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

  // get slot by staff ID
  const slotByStaffId = async (id) => {
    try {
      const response = await dispatch(getSlotByStaffId(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };  
  const fetchAvailableSlots = useCallback(
    async (params) => {
      try {
        const response = await dispatch(getAvailableSlots(params)).unwrap();
        return { success: true, data: response };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  return {
    slots,
    loading,
    error,
    total,
    searchListSlot,
    addNewSlot,
    slotById,
    updateSlotById,
    changeStatusSlot,
    slotByStaffId,   
    fetchAvailableSlots,
  };
};

export default useSlot;
