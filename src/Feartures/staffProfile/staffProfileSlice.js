import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Manager staff profile
export const searchStaff = createAsyncThunk(
  "staffProfile/searchStaff",
  async (searchPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/staff-profile/search`,
        {
          params: searchPayload,
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

// create staff profile
export const createStaffProfile = createAsyncThunk(
  "staffProfile/createStaffProfile",
  async (createNewStaff, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/staff-profile/create`,
        createNewStaff,
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

// get staff profile by ID
export const getStaffById = createAsyncThunk(
  "staffProfile/getStaffById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/staff-profile/${id}`,
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

// update staff profile
export const updateStaffProfile = createAsyncThunk(
  "staffProfile/updateSlot",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/staff-profile/${id}`,
        updateData,
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

const staffProfileSlice = createSlice({
  name: "STAFF_PROFILE",
  initialState: {
    staffProfile: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Staff profile data
      .addCase(searchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffProfile = action.payload.pageData;
        state.total = action.payload.pageInfo.totalItems;
      })
      .addCase(searchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      .addCase(createStaffProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.staffProfile.push(action.payload);
      })

      .addCase(updateStaffProfile.fulfilled, (state, action) => {
        state.staffProfile = state.staffProfile.map((staff) =>
          staff._id === action.payload._id ? action.payload : staff
        );
      });
  },
});

export default staffProfileSlice;
