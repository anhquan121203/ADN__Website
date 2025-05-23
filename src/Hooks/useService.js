import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";

import { searchService } from "../Feartures/services/seviceSlice";

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


  return {
    services,
    loading,
    error,
    total,
    searchListService,
  };
};

export default useService;
