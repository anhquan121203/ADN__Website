import { useDispatch, useSelector } from "react-redux";
import { 
  createAppointment, 
  fetchAppointments, 
  getAppointmentById,
  getAvailableStaff,
  assignStaffToAppointment,
  fetchStaffAssignedAppointments,
  fetchStaffSlots,
  confirmAppointment,
  fetchAvailableLabTechs,
  assignLabTechToAppointment
} from "../Feartures/appoinment/appoimentSlice";

export const useAppointment = () => {
  const dispatch = useDispatch();
  const { 
    appointments, 
    selectedAppointment, 
    availableStaff,
    loading, 
    error, 
    pageInfo,
    staffAssignedAppointments, // <-- add this
    staffAssignedPageInfo      // <-- add this
  } = useSelector((state) => state.appointment);

  const createNewAppointment = async (appointmentData) => {
    try {
      const result = await dispatch(createAppointment(appointmentData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAppointments = async (params) => {
    try {
      const result = await dispatch(fetchAppointments(params)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAppointmentDetail = async (id) => {
    try {
      const result = await dispatch(getAppointmentById(id)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAvailableStaffList = async () => {
    try {
      const result = await dispatch(getAvailableStaff()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const assignStaff = async (appointmentId, staffId) => {
    try {
      const result = await dispatch(assignStaffToAppointment({ appointmentId, staffId })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getStaffAssignedAppointments = async (params) => {
    try {
      const result = await dispatch(fetchStaffAssignedAppointments(params)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getStaffSlots = async (params) => {
    try {
      const result = await dispatch(fetchStaffSlots(params)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const confirmAppointmentSlot = async (appointmentId, slotId) => {
    try {
      const result = await dispatch(confirmAppointment({ appointmentId, slotId })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAvailableLabTechs = async () => {
    try {
      const result = await dispatch(fetchAvailableLabTechs()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const assignLabTech = async (appointmentId, labTechId) => {
    try {
      const result = await dispatch(assignLabTechToAppointment({ appointmentId, labTechId })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    appointments,
    selectedAppointment,
    availableStaff,
    loading,
    error,
    pageInfo,
    createAppointment: createNewAppointment,
    getAppointments,
    getAppointmentDetail,
    getAvailableStaffList,
    assignStaff,
    staffAssignedAppointments,
    staffAssignedPageInfo,
    getStaffAssignedAppointments,
    getStaffSlots,
    confirmAppointmentSlot,
    getAvailableLabTechs,
    assignLabTech,
  };
};