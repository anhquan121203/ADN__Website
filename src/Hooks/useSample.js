import { useDispatch, useSelector } from 'react-redux';
import { 
  addSamplesToAppointment, 
  fetchSamplesByAppointment, 
  uploadSamplePersonImage, 
  batchSubmitSamples,
  searchSamples,
  updateFilters,
  resetFilters,
  receiveSamples as receiveSamplesAction
} from '../Feartures/sample/sampleSlice';

const useSample = () => {
  const dispatch = useDispatch();
  const { 
    samples, 
    isLoading, 
    isError, 
    error, 
    pagination, 
    filters 
  } = useSelector((state) => state.sample);

  // Search samples with filters
  const searchSamplesWithFilters = async (filters) => {
    try {
      const res = await dispatch(searchSamples(filters)).unwrap();
      return { 
        success: true, 
        data: res.data || [],
        pagination: {
          currentPage: res.currentPage || 1,
          totalPages: res.totalPages || 1,
          totalItems: res.totalItems || 0
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to search samples' 
      };
    }
  };

  // Update filters in Redux store
  const updateSampleFilters = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  // Receive samples
  const receiveSamples = async (sampleIds) => {
    try {
      const receivedDate = new Date().toISOString();
      const res = await dispatch(receiveSamplesAction({ 
        sampleIds, 
        receivedDate 
      })).unwrap();
      
      return { 
        success: true, 
        data: res,
        message: 'Samples received successfully'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to receive samples' 
      };
    }
  };

  // Reset all filters
  const resetSampleFilters = () => {
    dispatch(resetFilters());
  };

  const addSamples = async (payload) => {
    try {
      const res = await dispatch(addSamplesToAppointment(payload)).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getSamplesByAppointment = async (appointmentId) => {
    try {
      const res = await dispatch(fetchSamplesByAppointment(appointmentId)).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadPersonImage = async (sampleId, imageFile) => {
    try {
      const res = await dispatch(uploadSamplePersonImage({ sampleId, imageFile })).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const submitSamples = async (sample_ids, collection_date) => {
    try {
      const res = await dispatch(batchSubmitSamples({ sample_ids, collection_date })).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    // Actions
    addSamples,
    getSamplesByAppointment,
    uploadPersonImage,
    submitSamples,
    searchSamples: searchSamplesWithFilters,
    updateFilters: updateSampleFilters,
    resetFilters: resetSampleFilters,
    receiveSamples,
    
    // State
    samples,
    loading: isLoading,
    error: isError ? error : null,
    pagination,
    filters,
    updateSampleFilters,
    resetSampleFilters
  };
};

export default useSample;
