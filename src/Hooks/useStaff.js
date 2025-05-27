import { useDispatch, useSelector } from 'react-redux';
import { 
  updateUser, 
  changePassword, 
  forgotPassword, 
  getAppointments,
  getServices,
  getServiceById,
  getChildServices
} from '../Feartures/staff/staffSlice';

const useStaff = () => {
  const dispatch = useDispatch();
  // Add a fallback empty object to prevent destructuring errors
  const staffState = useSelector((state) => state.staff) || {};
  
  const { 
    accounts, 
    appointments,
    services,
    serviceDetails,
    childServices,
    loading, 
    error 
  } = staffState;

  // Add new functions for services with better error handling
  const fetchServices = async (searchParams = { is_active: true }) => {
    try {
      const result = await dispatch(getServices(searchParams)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Services fetch error in hook:', error);
      return { success: false, error };
    }
  };

  const updateUserData = async (userData) => {
    try {
      const result = await dispatch(updateUser(userData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const changeUserPassword = async (passwordData) => {
    try {
      const result = await dispatch(changePassword(passwordData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const fetchAppointments = async (searchParams) => {
    try {
      const result = await dispatch(getAppointments(searchParams)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const fetchServiceById = async (serviceId) => {
    try {
      const result = await dispatch(getServiceById(serviceId)).unwrap();
      console.log('Service details:', result);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const fetchChildServices = async (parentId) => {
    try {
      const result = await dispatch(getChildServices(parentId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    accounts,
    appointments,
    services,
    serviceDetails,
    childServices,
    loading,
    error,
    updateUserData,
    changeUserPassword,
    requestPasswordReset,
    fetchAppointments,
    fetchServices,
    fetchServiceById,
    fetchChildServices
  };
};

export default useStaff;