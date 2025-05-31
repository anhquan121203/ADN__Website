import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  searchDepartment,
  updateDepartment,
  getDepartmentStatistics,
} from "../Feartures/department/departmentSlice";
import { toast } from "react-toastify";

const useDepartment = () => {
  const dispatch = useDispatch();
  const { departments, loading, error, total, statistics } = useSelector(
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

  const fetchDepartmentStatistics = async ({
    departmentId,
    date_from,
    date_to,
  }) => {
    try {
      const response = await dispatch(
        getDepartmentStatistics({ departmentId, date_from, date_to })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error fetching department statistics");
      return { success: false };
    }
  };

  return {
    departments,
    loading,
    error,
    total,
    statistics,
    searchListDepartment,
    addNewDepartment,
    departmentById,
    updateDepartmentById,
    deleteDepartmentById,
    fetchDepartmentStatistics,
  };
};

export default useDepartment;
