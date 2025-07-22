import { useDispatch, useSelector } from "react-redux";
import {
  createStaffProfile,
  getStaffById,
  listStaffLabTech,
  searchStaff,
  updateStaffProfile,
} from "../Feartures/staffProfile/staffProfileSlice";
import { useCallback } from "react";

const useStaffProfile = () => {
  const dispatch = useDispatch();
  const { staffProfile, staffLabTech, loading, error, total } = useSelector(
    (state) => state.staffProfile
  );


  // get list staff profile
  //   const getListStaff = (searchPayload) => {
  //     dispatch(searchStaff(searchPayload));
  //   };

  const getListStaff = useCallback(
    (searchPayload) => {
      dispatch(searchStaff(searchPayload));
    },
    [dispatch]
  );

  const addNewStaffProfile = async (createNewStaff) => {
    try {
      const response = await dispatch(
        createStaffProfile(createNewStaff)
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const staffProfileById = async (id) => {
    try {
      const response = await dispatch(getStaffById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateStaffById = async (id, updateData) => {
    try {
      const response = await dispatch(
        updateStaffProfile({ id, updateData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  };

  const getListStaffLabTech = useCallback(() => {
    dispatch(listStaffLabTech());
  }, [dispatch]);

  return {
    staffProfile,
    staffLabTech,
    loading,
    error,
    total,
    getListStaff,
    addNewStaffProfile,
    staffProfileById,
    updateStaffById,
    getListStaffLabTech,
  };
};

export default useStaffProfile;
