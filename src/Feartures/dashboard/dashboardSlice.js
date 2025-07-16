import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// dashboard payments status
export const dashboardPayment = createAsyncThunk(
  "dashboards/dashboardPayment",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/payments/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==========================================================================================
// dashboard revenue
export const dashboardRevenue = createAsyncThunk(
  "dashboards/dashboardRevenue",
  async (revenueData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/revenue`,
        {
          params: revenueData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==========================================================================================
// dashboard sumary
export const dashboardSumary = createAsyncThunk(
  "dashboards/dashboardSumary",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/summary`,
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

const dashboardSlice = createSlice({
  name: "DASHBOARD",
  initialState: {
    dashboards: {},
    revenues: [],
    summary: {},
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboardPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboards = action.payload || {};
      })
      .addCase(dashboardPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //   dashboard revenue
      .addCase(dashboardRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues = action.payload || [];
      })
      .addCase(dashboardRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //   dashboard revenue
      .addCase(dashboardSumary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardSumary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.data || {};
      })

      .addCase(dashboardSumary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      });
  },
});

export default dashboardSlice;
