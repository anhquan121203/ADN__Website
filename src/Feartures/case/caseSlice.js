import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunks
export const searchCase = createAsyncThunk(
  "case/searchCase",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/administrative-cases`,
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

// create service
export const createCase = createAsyncThunk(
  "case/createCase",
  async (createNewCase, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/administrative-cases`,
        createNewCase,
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
export const getCaseById = createAsyncThunk(
  "case/getCaseById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/administrative-cases/${id}`,
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

// update service
export const updateCase = createAsyncThunk(
  "case/updateCase",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/administrative-cases/${id}`,
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
export const deleteCase = createAsyncThunk(
  "case/deleteCase",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `${API_BASE_URL}/api/administrative-cases/${id}`,
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

// tash hành chính được Admin giao cho Staff
export const searchCaseAssign = createAsyncThunk(
  "case/searchCaseAssign",
  async (listCaseAssign, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/administrative-cases/assigned/search`,
        {
          params: listCaseAssign,
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

const caseSlice = createSlice({
  name: "CASE",
  initialState: {
    cases: [],
    assignCase: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
      })
      .addCase(searchCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      })

      //  create slot
      .addCase(createCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases.push(action.payload);
      })

      // Update case
      .addCase(updateCase.fulfilled, (state, action) => {
        state.cases = state.cases.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })

      // Change status
      .addCase(deleteCase.fulfilled, (state, action) => {
        state.cases = state.cases.map((c) => {
          c._id = action.payload._id ? action.payload : c;
        });
      })

      .addCase(searchCaseAssign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCaseAssign.fulfilled, (state, action) => {
        state.loading = false;
        state.assignCase = action.payload;
      })
      .addCase(searchCaseAssign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accounts";
      });
  },
});

export default caseSlice;
