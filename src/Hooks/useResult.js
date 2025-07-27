import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResultsByAppointmentId,
  startTestingProcess,
  createTestResult,
  getResultByAppointmentId,
  updateResult,
  resetResults,
  resetStartTesting,
  resetCreateResult,
  resetCurrentResult,
  resetUpdateResult,
  createRequestResultAdmin,
} from "../Feartures/result/resultSlice";

const useResult = () => {
  const dispatch = useDispatch();
  const {
    resultAdmin,
    loading,
    error,
    pageInfo,
    startTestingLoading,
    startTestingError,
    createResultLoading,
    createResultError,
    currentResult,
    resultLoading,
    resultError,
    updateResultLoading,
    updateResultError,
  } = useSelector((state) => state.result);

  const getResultsByAppointmentId = useCallback(
    async (appointmentId) => {
      try {
        const result = await dispatch(
          fetchResultsByAppointmentId(appointmentId)
        );
        if (fetchResultsByAppointmentId.fulfilled.match(result)) {
          return { success: true, data: result.payload };
        } else {
          return { success: false, error: result.payload };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const startTesting = useCallback(
    async (testingData) => {
      try {
        const result = await dispatch(startTestingProcess(testingData));
        if (startTestingProcess.fulfilled.match(result)) {
          return { success: true, data: result.payload };
        } else {
          return { success: false, error: result.payload };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const resetResultsState = useCallback(() => {
    dispatch(resetResults());
  }, [dispatch]);

  const createResult = useCallback(
    async (resultData) => {
      try {
        const result = await dispatch(createTestResult(resultData));
        if (createTestResult.fulfilled.match(result)) {
          return { success: true, data: result.payload };
        } else {
          return { success: false, error: result.payload };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const resetCreateResultState = useCallback(() => {
    dispatch(resetCreateResult());
  }, [dispatch]);

  const resetStartTestingState = useCallback(() => {
    dispatch(resetStartTesting());
  }, [dispatch]);

  const getResultByAppointment = useCallback(
    async (appointmentId) => {
      try {
        const result = await dispatch(getResultByAppointmentId(appointmentId));
        if (getResultByAppointmentId.fulfilled.match(result)) {
          return { success: true, data: result.payload };
        } else {
          return { success: false, error: result.payload };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const resetCurrentResultState = useCallback(() => {
    dispatch(resetCurrentResult());
  }, [dispatch]);

  const updateResultData = useCallback(
    async (resultId, resultData) => {
      try {
        const result = await dispatch(updateResult({ resultId, resultData }));
        if (updateResult.fulfilled.match(result)) {
          return { success: true, data: result.payload };
        } else {
          return { success: false, error: result.payload };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const resetUpdateResultState = useCallback(() => {
    dispatch(resetUpdateResult());
  }, [dispatch]);

  const addRequestResultAdmin = async ({ resultId, resultData }) => {
    try {
      const response = await dispatch(
        createRequestResultAdmin({ resultId, resultData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error create request:", error);
      return { success: false };
    }
  };

  return {
    resultAdmin,
    loading,
    error,
    pageInfo,
    startTestingLoading,
    startTestingError,
    createResultLoading,
    createResultError,
    currentResult,
    resultData: currentResult?.data || null, // Add resultData
    resultLoading,
    resultError,
    updateResultLoading,
    updateResultError,

    // Actions
    getResultsByAppointmentId,
    startTesting,
    createResult,
    getResultByAppointment,
    updateResultData,
    resetResultsState,
    resetStartTestingState,
    resetCreateResultState,
    resetCurrentResultState,
    resetUpdateResultState,
    addRequestResultAdmin,
  };
};

export default useResult;
