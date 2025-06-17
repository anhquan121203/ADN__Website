import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/appointment/create`,
        appointmentData,
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

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/search`,
        {
          params,
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

export const getAppointmentById = createAsyncThunk(
  "appointment/getById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/${id}`,
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

export const getAvailableStaff = createAsyncThunk(
  "appointment/getAvailableStaff",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/staff/available`,
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

export const assignStaffToAppointment = createAsyncThunk(
  "appointment/assignStaff",
  async ({ appointmentId, staffId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/appointment/${appointmentId}/assign-staff`,
        { staff_id: staffId },
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

export const fetchStaffAssignedAppointments = createAsyncThunk(
  "appointment/fetchStaffAssignedAppointments",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/staff/assigned`,
        {
          params,
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

export const fetchStaffSlots = createAsyncThunk(
  "appointment/fetchStaffSlots",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/staff/slots`,
        {
          params,
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

export const confirmAppointment = createAsyncThunk(
  "appointment/confirmAppointment",
  async ({ appointmentId, slotId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/appointment/${appointmentId}/confirm`,
        { slot_id: slotId },
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

export const fetchAvailableLabTechs = createAsyncThunk(
  "appointment/fetchAvailableLabTechs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/lab-tech/available`,
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

export const assignLabTechToAppointment = createAsyncThunk(
  "appointment/assignLabTechToAppointment",
  async ({ appointmentId, labTechId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/appointment/${appointmentId}/assign-lab-tech`,
        { lab_tech_id: labTechId },
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

const appointmentSlice = createSlice({
  name: "APPOINTMENT",
  initialState: {
    appointments: [],
    selectedAppointment: null,
    availableStaff: [],
    loading: false,
    error: null,
    pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    staffAssignedAppointments: [],
    staffAssignedPageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    staffSlots: [],
    staffSlotsLoading: false,
    staffSlotsError: null,
    availableLabTechs: [],
    availableLabTechsLoading: false,
    availableLabTechsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data.pageData;
        state.pageInfo = action.payload.data.pageInfo;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment = action.payload.data;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAvailableStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.availableStaff = action.payload.data;
      })
      .addCase(getAvailableStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignStaffToAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStaffToAppointment.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selected appointment with the new staff
        if (state.selectedAppointment) {
          state.selectedAppointment = action.payload.data;
        }
      })
      .addCase(assignStaffToAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStaffAssignedAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffAssignedAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.staffAssignedAppointments = action.payload.data.pageData;
        state.staffAssignedPageInfo = action.payload.data.pageInfo;
      })
      .addCase(fetchStaffAssignedAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStaffSlots.pending, (state) => {
        state.staffSlotsLoading = true;
        state.staffSlotsError = null;
      })
      .addCase(fetchStaffSlots.fulfilled, (state, action) => {
        state.staffSlotsLoading = false;
        state.staffSlots = action.payload.data;
      })
      .addCase(fetchStaffSlots.rejected, (state, action) => {
        state.staffSlotsLoading = false;
        state.staffSlotsError = action.payload;
      })
      .addCase(confirmAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if needed
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableLabTechs.pending, (state) => {
        state.availableLabTechsLoading = true;
        state.availableLabTechsError = null;
      })
      .addCase(fetchAvailableLabTechs.fulfilled, (state, action) => {
        state.availableLabTechsLoading = false;
        state.availableLabTechs = action.payload.data;
      })
      .addCase(fetchAvailableLabTechs.rejected, (state, action) => {
        state.availableLabTechsLoading = false;
        state.availableLabTechsError = action.payload;
      })
      .addCase(assignLabTechToAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignLabTechToAppointment.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if needed
      })
      .addCase(assignLabTechToAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice;