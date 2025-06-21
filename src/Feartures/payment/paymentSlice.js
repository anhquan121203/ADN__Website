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
        `${API_BASE_URL}/api/payment/appointment`,
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

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentIntent: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
        state.paymentIntent = null;
        state.error = null;
        state.isLoading = false;
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
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice;
