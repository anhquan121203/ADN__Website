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

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentIntent: null,
    verificationResult: null,
    isLoading: false,
    isVerifying: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
        state.paymentIntent = null;
        state.verificationResult = null;
        state.error = null;
        state.isLoading = false;
        state.isVerifying = false;
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
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice;
