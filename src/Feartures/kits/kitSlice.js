import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunks
export const searchKit = createAsyncThunk(
  "kits/searchKit",
  async (listKit, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/kit/search`, {
        params: listKit,
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

// // create kit
export const createKit = createAsyncThunk(
  "kits/createKit",
  async (createNewKit, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/kit/create`,
        createNewKit,
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

// get by ID
export const getKitById = createAsyncThunk(
  "kits/getKitById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/kit/${id}`, {
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
export const updateKit = createAsyncThunk(
  "kits/updateKit",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/kit/${id}`,
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

// Delete service
export const deleteKit = createAsyncThunk(
  "kits/deleteKit",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/kit/${id}`, {
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
  "kits/changeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_BASE_URL}/api/kit/${id}/status`,
        {
          status: status,
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

// return service
export const returnKit = createAsyncThunk(
  "kits/returnKit",
  async ({ id, returnData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/kit/${id}/return`,
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

const kitSlice = createSlice({
  name: "KIT",
  initialState: {
    kits: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchKit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchKit.fulfilled, (state, action) => {
        state.loading = false;
        state.kits = action.payload.pageData; // Lấy danh sách service
        state.total = action.payload.pageInfo.totalItems; // Tổng số service
      })
      .addCase(searchKit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //  createService
      .addCase(createKit.fulfilled, (state, action) => {
        state.loading = false;
        state.kits.push(action.payload);
      })

      // Update service
      .addCase(updateKit.fulfilled, (state, action) => {
        state.kits = state.kits.map((kit) =>
          kit._id === action.payload._id ? action.payload : kit
        );
      })

      // delete service
      .addCase(deleteKit.fulfilled, (state, action) => {
        state.kits = state.kits.filter((kit) => kit._id !== action.payload);
      })

      // Change status
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.services.findIndex(
          (u) => u._id === action.payload.data?._id
        );
        if (idx !== -1) {
          state.kits[idx] = action.payload.data;
        }
      })

      // return kit
      .addCase(returnKit.fulfilled, (state, action) => {
        state.kits = state.kits.map((kit) => {
          kit._id === action.payload._id ? action.payload : kit;
        });
      });
  },
});

export default kitSlice;
