import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import { createPaymentIntent, verifyPayment } from "../Feartures/payment/paymentSlice";

const usePayment = () => {
 const dispatch = useDispatch();
  const { paymentIntent, verificationResult, isLoading, isVerifying, error } = useSelector(state => state.payment);

  const makePayment = async ({ appointment_id, payment_method, sample_ids }) => {
    try {
      const res = await dispatch(
        createPaymentIntent({ appointment_id, payment_method, sample_ids })
      ).unwrap();
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const verifyPaymentStatus = async (paymentNo) => {
    try {
      const res = await dispatch(verifyPayment(paymentNo)).unwrap();
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return { 
    makePayment, 
    verifyPaymentStatus,
    paymentIntent, 
    verificationResult,
    isLoading, 
    isVerifying,
    error 
  };
}

export default usePayment;
