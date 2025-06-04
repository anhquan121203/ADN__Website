import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunks
export const searchService = createAsyncThunk(
  "service/searchService",
  async (listService, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/service/search`, {
        params: listService,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// create service
export const createService = createAsyncThunk(
  "account/createService",
  async (createNewService, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/service/create`,
        createNewService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get by ID
export const getServiceById = createAsyncThunk(
  "account/getServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update service
export const updateService = createAsyncThunk(
  "account/updateService",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/service/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete service
export const deleteService = createAsyncThunk(
  "account/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// changle status
export const changeStatus = createAsyncThunk(
  "service/changeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_BASE_URL}/api/service/${id}/status`,
        {
          is_active: status,
        },
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

const serviceSlice = createSlice({
  name: "SERVICE",
  initialState: {
    services: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.pageData; // Lấy danh sách service
        state.total = action.payload.pageInfo.totalItems; // Tổng số service
      })
      .addCase(searchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //  createService
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })

      // Update service
      .addCase(updateService.fulfilled, (state, action) => {
        state.services = state.services.map((service) =>
          service._id === action.payload._id ? action.payload : service
        );
      })

      // delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(
          (service) => service._id !== action.payload
        );
      })

      // Change status
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.services.findIndex(
          (u) => u._id === action.payload.data?._id
        );
        if (idx !== -1) {
          state.services[idx] = action.payload.data;
        }
      });
  },
});

export default serviceSlice;
