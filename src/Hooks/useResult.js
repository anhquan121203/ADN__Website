import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchResultsByAppointmentId, 
  startTestingProcess, 
  createTestResult,
  getResultByAppointmentId,
  resetResults, 
  resetStartTesting,
  resetCreateResult,
  resetCurrentResult 
} from '../Feartures/result/resultSlice';

const useResult = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    pageInfo, 
    startTestingLoading, 
    startTestingError,
    createResultLoading,
    createResultError,
    currentResult,
    resultLoading,
    resultError 
  } = useSelector((state) => state.result);

  const getResultsByAppointmentId = useCallback(async (appointmentId) => {
    try {
      const result = await dispatch(fetchResultsByAppointmentId(appointmentId));
      if (fetchResultsByAppointmentId.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const startTesting = useCallback(async (testingData) => {
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
  }, [dispatch]);

  const resetResultsState = useCallback(() => {
    dispatch(resetResults());
  }, [dispatch]);

  const createResult = useCallback(async (resultData) => {
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
  }, [dispatch]);

  const resetCreateResultState = useCallback(() => {
    dispatch(resetCreateResult());
  }, [dispatch]);

  const resetStartTestingState = useCallback(() => {
    dispatch(resetStartTesting());
  }, [dispatch]);

  const getResultByAppointment = useCallback(async (appointmentId) => {
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
  }, [dispatch]);

  const resetCurrentResultState = useCallback(() => {
    dispatch(resetCurrentResult());
  }, [dispatch]);

  return {
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
    
    // Actions
    getResultsByAppointmentId,
    startTesting,
    createResult,
    getResultByAppointment,
    resetResultsState,
    resetStartTestingState,
    resetCreateResultState,
    resetCurrentResultState,
  };
};

export default useResult;
