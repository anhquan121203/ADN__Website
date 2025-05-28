import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunks
export const searchSlot = createAsyncThunk(
  "slot/searchSlot",
  async (listSlot, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/slot/search`, {
        params: listSlot,
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
export const createSlot = createAsyncThunk(
  "slot/createSlot",
  async (createNewSlot, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/slot/create`,
        createNewSlot,
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
export const getSlotById = createAsyncThunk(
  "slot/getSlotById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/slot/${id}`, {
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
export const updateSlot = createAsyncThunk(
  "slot/updateSlot",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/slot/${id}`,
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

// changle status
export const changeStatus = createAsyncThunk(
  "slot/changeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_BASE_URL}/api/slot/${id}/status`,
        {
          status,
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

const slotSlice = createSlice({
  name: "SLOT",
  initialState: {
    slots: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.pageData; // Lấy danh sách slot
        state.total = action.payload.pageInfo.totalItems; // Tổng số data
      })
      .addCase(searchSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //  create slot
      .addCase(createSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.slots.push(action.payload);
      })

      // Update slot
      .addCase(updateSlot.fulfilled, (state, action) => {
        state.slots = state.slots.map((slot) =>
          slot._id === action.payload._id ? action.payload : slot
        );
      })


      // Change status
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.slots.findIndex(
          (u) => u._id === action.payload.data?._id
        );
        if (idx !== -1) {
          state.slots[idx] = action.payload.data;
        }
      });
  },
});

export default slotSlice;
