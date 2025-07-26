import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  checkAppointmentAdmin,
  createAppointmnetAdmin,
  listCustomer,
} from "../Feartures/appointmentAdmin/appointmentAdminSlice";

const useAppointmentAdmin = () => {
  const dispatch = useDispatch();
  const { appointmentAdmins, loading, error, message, customers } = useSelector(
    (state) => state.appointmentAdmin
  );

  // Check if appointment can be created
  const validateAppointment = async (caseId) => {
    try {
      const response = await dispatch(checkAppointmentAdmin(caseId)).unwrap();
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Create new appointment
  const addNewAppointmentAdmin = async ({ caseId, createNewAdmin }) => {
    try {
      const response = await dispatch(
        createAppointmnetAdmin({ caseId, createNewAdmin })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error };
    }
  };

  const searchListCustomer = async ({ searchTerm }) => {
    try {
      const response = await dispatch(listCustomer({ searchTerm })).unwrap();
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    appointmentAdmins,
    customers,
    loading,
    error,
    message,
    validateAppointment,
    addNewAppointmentAdmin,
    searchListCustomer,
  };
};

export default useAppointmentAdmin;
