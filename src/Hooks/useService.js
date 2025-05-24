import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";

import {
  createService,
  getServiceById,
  searchService,
} from "../Feartures/services/seviceSlice";

const useService = () => {
  const dispatch = useDispatch();
  const { services, loading, error, total } = useSelector(
    (state) => state.service
  );

  const searchListService = async (searchPayload) => {
    try {
      await dispatch(searchService(searchPayload));
    } catch (error) {
      console.error("Error create Staff");
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

  return {
    services,
    loading,
    error,
    total,
    searchListService,
    addNewService,
    serviceById
  };
};

export default useService;
