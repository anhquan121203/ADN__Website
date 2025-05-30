import { API_BASE_URL } from "../../Constants/apiConstants";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const updateUser = createAsyncThunk(
  "account/updateUser",
  async (updateUser, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${updateUser.id}`,
        updateUser,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "account/changePassword",
  async (changePassword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/users/change-password`,
        changePassword,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
    "account/forgotPassword",
    async (email, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/auth/forgot-password`, {
          email,
        });
        return response.data;
      } catch (error) {
        throw rejectWithValue (error.response?.data || error.message);
      }
    }
);

export const getAppointments = createAsyncThunk(
  "staff/getAppointments",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      // Build query string from search params
      const queryParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(searchParams)) {
        if (value) {
          queryParams.append(key, value);
        }
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/service/appointments?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add new thunks for services
export const getServices = createAsyncThunk(
  "staff/getServices",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      // Build query string from search params
      const queryParams = new URLSearchParams();
      
      // Set default is_active to true if not specified
      if (searchParams.is_active === undefined) {
        queryParams.append('is_active', true);
      }
      
      for (const [key, value] of Object.entries(searchParams)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/service/search?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getServiceById = createAsyncThunk(
  "staff/getServiceById",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await axios.get(
        `${API_BASE_URL}/api/service/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getChildServices = createAsyncThunk(
  "staff/getChildServices",
  async (parentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await axios.get(
        `${API_BASE_URL}/api/service/${parentId}/child`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Add new thunk for departments
export const getDepartments = createAsyncThunk(
  "staff/getDepartments",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();
      
      // Set default values if not specified
      const params = {
        is_deleted: false,
        sort_by: 'created_at',
        sort_order: 'desc',
        ...searchParams
      };
      
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/department/search?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Add after getDepartments thunk
export const getDepartmentById = createAsyncThunk(
  "staff/getDepartmentById",
  async (departmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/department/${departmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSlots = createAsyncThunk(
  "staff/getSlots",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();
      
      const params = {
        pageNum: 1,
        pageSize: 10,
        ...searchParams
      };
      
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/slot/search?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const staffSlice = createSlice({
    name: "STAFF",
    initialState: {
        accounts: [],
        appointments: null,
        services: null,
        serviceDetails: null,
        childServices: [],
        departments: null,
        departmentDetails: null,
        slots: null,
        loading: false,
        error: null,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload;
            })
           .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Đã xảy ra lỗi";
            })
            
            // Add cases for getAppointments
            .addCase(getAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
                state.error = null;
            })
            .addCase(getAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch appointments";
            })
            
            // Add cases for getServices
            .addCase(getServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
                state.error = null;
            })
            .addCase(getServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch services";
            })
            
            // Add cases for getServiceById
            .addCase(getServiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getServiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceDetails = action.payload;
                state.error = null;
            })
            .addCase(getServiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch service details";
            })
            
            // Add cases for getChildServices
            .addCase(getChildServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChildServices.fulfilled, (state, action) => {
                state.loading = false;
                state.childServices = action.payload;
                state.error = null;
            })
            .addCase(getChildServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch child services";
            })
            // Add cases for getDepartments
            .addCase(getDepartments.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getDepartments.fulfilled, (state, action) => {
              state.loading = false;
              state.departments = action.payload;
              state.error = null;
          })
          .addCase(getDepartments.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || "Failed to fetch departments";
          })
          // Add to extraReducers
  .addCase(getDepartmentById.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(getDepartmentById.fulfilled, (state, action) => {
  state.loading = false;
  state.departmentDetails = action.payload;
  state.error = null;
})
.addCase(getDepartmentById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to fetch department details";
})
// Add to extraReducers
.addCase(getSlots.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(getSlots.fulfilled, (state, action) => {
  state.loading = false;
  state.slots = action.payload;
  state.error = null;
})
.addCase(getSlots.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to fetch slots";
});
    },
})

// Change this line - export the reducer instead of the slice
export default staffSlice;