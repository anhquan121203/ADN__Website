import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunks
export const checkAppointmentAdmin = createAsyncThunk(
  "appointmentAdmin/checkAppointmentAdmin",
  async (caseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/administrative/${caseId}/validate`,
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

// create service
export const createAppointmnetAdmin = createAsyncThunk(
  "appointmentAdmin/createAppointmnetAdmin",
  async ({ caseId, createNewAdmin }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/appointment/administrative/${caseId}`,
        createNewAdmin,
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

// list user
export const listCustomer = createAsyncThunk(
  "appointmentAdmin/listCustomer",
  async ({searchTerm}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/users/search-customer`,
        {
          params: {searchTerm},
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

const appointmentAdminSlice = createSlice({
  name: "APPOINTMENT_ADMIN",
  initialState: {
    appointmentAdmins: [],
    customers: {},
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAppointmentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAppointmentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentAdmins = action.payload;
      })
      .addCase(checkAppointmentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch appointment admin";
      })

      //  create create Appointmnet Admin
      .addCase(createAppointmnetAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentAdmins.push(action.payload);
      })

      // list customer
      .addCase(listCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(listCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })
  },
});

export default appointmentAdminSlice;
