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
      // .addCase(createService.fulfilled, (state, action) => {
      //   state.services.unshift(action.payload);
      //   state.total += 1;
      //   state.error = null;
      // });
  },
});

export default serviceSlice;
