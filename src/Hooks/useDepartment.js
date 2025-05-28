import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  searchDepartment,
  updateDepartment,
} from "../Feartures/department/departmentSlice";
import { toast } from "react-toastify";

const useDepartment = () => {
  const dispatch = useDispatch();
  const { departments, loading, error, total } = useSelector(
    (state) => state.department
  );

  const searchListDepartment = async (searchPayload) => {
    try {
      await dispatch(searchDepartment(searchPayload));
    } catch (error) {
      console.error("Error search department");
    }
  };

  const addNewDepartment = async (createNewDepartment) => {
    try {
      const response = await dispatch(
        createDepartment(createNewDepartment)
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      toast.error("Tạo phòng ban không thành công!");
      return { success: false };
    }
  };

  const departmentById = async (id) => {
    try {
      const response = await dispatch(getDepartmentById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error get department by id");
      return { success: false };
    }
  };

  const updateDepartmentById = async (id, updateData) => {
    try {
      const response = await dispatch(
        updateDepartment({ id, updateData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      toast.error("Cập nhật phòng ban không thành công!");
      return { success: false };
    }
  };

  const deleteDepartmentById = async (id) => {
    try {
      await dispatch(deleteDepartment(id)).unwrap();
      toast.success("Xóa phòng ban thành công!");
      return { success: true };
    } catch (error) {
      toast.error("Xóa phòng ban không thành công!");
      return { success: false };
    }
  };

  return {
    departments,
    loading,
    error,
    total,
    searchListDepartment,
    addNewDepartment,
    departmentById,
    updateDepartmentById,
    deleteDepartmentById,
  };
};

export default useDepartment;
