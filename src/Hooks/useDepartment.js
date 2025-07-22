import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  searchDepartment,
  updateDepartment,
  getDepartmentStatistics,
  getDepartmentCount,
  getDepartmentsByManager,
} from "../Feartures/department/departmentSlice";
import { toast } from "react-toastify";

const useDepartment = () => {
  const dispatch = useDispatch();
  const {
    departments,
    loading,
    error,
    total,
    statistics,
    count,
    managerDepartments,
  } = useSelector((state) => state.department);

  const searchListDepartment = async (searchPayload) => {
    try {
      const response = await dispatch(searchDepartment(searchPayload)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error search department", error);
      return { success: false, data: [] };
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

  const getTotalDepartmentCount = async () => {
    try {
      await dispatch(getDepartmentCount()).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Error get department count");
    }
  };

  const getDepartmentsByManagerId = async (managerId) => {
    try {
      const response = await dispatch(
        getDepartmentsByManager(managerId)
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error fetching departments by manager", error);
      return { success: false };
    }
  };

  return {
    departments,
    loading,
    error,
    total,
    statistics,
    count,
    managerDepartments,
    searchListDepartment,
    addNewDepartment,
    departmentById,
    updateDepartmentById,
    deleteDepartmentById,
    fetchDepartmentStatistics,
    getTotalDepartmentCount,
    getDepartmentsByManagerId,
  };
};

export default useDepartment;
