import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchResultsByAppointmentId, 
  startTestingProcess, 
  createTestResult,
  resetResults, 
  resetStartTesting,
  resetCreateResult 
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
    createResultError 
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

  return {
    loading,
    error,
    pageInfo,
    startTestingLoading,
    startTestingError,
    createResultLoading,
    createResultError,
    
    // Actions
    getResultsByAppointmentId,
    startTesting,
    createResult,
    resetResultsState,
    resetStartTestingState,
    resetCreateResultState,
  };
};

export default useResult;
