import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../Feartures/appoinment/appoimentSlice";

export const useAppointment = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointment);

  const createNewAppointment = async (appointmentData) => {
    try {
      const result = await dispatch(createAppointment(appointmentData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    appointments,
    loading,
    error,
    createAppointment: createNewAppointment,
  };
};