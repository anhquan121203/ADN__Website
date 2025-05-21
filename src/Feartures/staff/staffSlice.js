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
)
const staffSlice = createSlice({
    name: "STAFF",
    initialState: {
        accounts: [],
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
            });
    },
})

export default staffSlice;