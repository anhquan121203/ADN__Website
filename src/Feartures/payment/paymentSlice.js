import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunk to create a payment intent
export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async ({ appointment_id, payment_method, sample_ids }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
        const response = await axios.post(
        `${API_BASE_URL}/api/payments/appointment`,
        { appointment_id, payment_method, sample_ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to verify payment status
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentNo, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/payments/${paymentNo}/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to cancel payment
export const cancelPayment = createAsyncThunk(
  "payment/cancelPayment",
  async (paymentNo, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/${paymentNo}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentIntent: null,
    verificationResult: null,
    cancelResult: null,
    isLoading: false,
    isVerifying: false,
    isCanceling: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
        state.paymentIntent = null;
        state.verificationResult = null;
        state.cancelResult = null;
        state.error = null;
        state.isLoading = false;
        state.isVerifying = false;
        state.isCanceling = false;
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      })
      .addCase(cancelPayment.pending, (state) => {
        state.isCanceling = true;
        state.error = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.isCanceling = false;
        state.cancelResult = action.payload;
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.isCanceling = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice;
