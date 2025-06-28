import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import { createCase, deleteCase, getCaseById, searchCase, updateCase } from "../Feartures/case/caseSlice";


const useCase = () => {
  const dispatch = useDispatch();
  const { cases, loading, error } = useSelector(
    (state) => state.case
  );

  const searchListCase = useCallback(
    (searchPayload) => {
      dispatch(searchCase(searchPayload));
    },
    [dispatch]
  );

  const addNewCase = async (createNewCase) => {
    try {
      const response = await dispatch(createCase(createNewCase)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const caseById = async (id) => {
    try {
      const response = await dispatch(getCaseById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create Staff");
    }
  };

  const updateCaseById = async (id, updateData) => {
    try {
      const response = await dispatch(updateCase({ id, updateData })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công!" };
    }
  };

  // Change Status
  const deleteCaseById = async (id) => {
    try {
      const response = await dispatch(deleteCase(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: "Thay đổi trạng thái tài khoản không thành công",
      };
    }
  };


  return {
    cases,
    loading,
    error,
    searchListCase,
    addNewCase,
    caseById,
    updateCaseById,
    deleteCaseById,
  };
};

export default useCase;
