import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";

import {
  createService,
  deleteService,
  getServiceById,
  searchService,
  updateService,
} from "../Feartures/services/seviceSlice";
import { data } from "react-router-dom";

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
      const response = await dispatch(updateService({id, updateData})).unwrap();
      return {success: true, data: response}
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  }

  const deleteServiceById = async (id) => {
    await dispatch(deleteService(id))
  }

  return {
    services,
    loading,
    error,
    total,
    searchListService,
    addNewService,
    serviceById,
    updateServiceById,
    deleteServiceById
  };
};

export default useService;
