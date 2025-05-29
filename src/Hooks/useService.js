import { useDispatch, useSelector } from "react-redux";

import {
  changeStatus,
  createService,
  deleteService,
  getServiceById,
  searchService,
  updateService,
} from "../Feartures/services/serviceSlice";

const useService = () => {
  const dispatch = useDispatch();
  const { services, loading, error, total } = useSelector(
    (state) => state.service
  );

  const searchListService = async (searchPayload) => {
    try {
      await dispatch(searchService(searchPayload));
    } catch (error) {
      console.error("Error create service");
    }
  };

  const addNewService = async (createNewService) => {
    try {
      const response = await dispatch(createService(createNewService)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const serviceById = async (id) => {
    try {
      const response = await dispatch(getServiceById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateServiceById = async (id, updateData) => {
    try {
      const response = await dispatch(
        updateService({ id, updateData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  };

  const deleteServiceById = async (id) => {
    try {
      await dispatch(deleteService(id)).unwrap();
      toast.success("Xóa thiết bị thành công!");
      return { success: true };
    } catch (error) {
      toast.error("Xóa thất bại!");
      return { success: false };
    }
  };

  // Change Status
  const changeStatusService = async ({id, status}) => {
    try {
      const response = await dispatch(changeStatus({id, status})).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: "Thay đổi trạng thái tài khoản không thành công",
      };
    }
  };

  return {
    services,
    loading,
    error,
    total,
    searchListService,
    addNewService,
    serviceById,
    updateServiceById,
    deleteServiceById,
    changeStatusService,
  };
};

export default useService;
