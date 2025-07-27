import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunk to fetch results by appointment ID
export const fetchResultsByAppointmentId = createAsyncThunk(
  "result/fetchResultsByAppointmentId",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/result/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch results"
      );
    }
  }
);

// Async thunk to start testing process
export const startTestingProcess = createAsyncThunk(
  "result/startTestingProcess",
  async (testingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/result/sample/start-testing`,
        testingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start testing process"
      );
    }
  }
);

// Async thunk to create test result
export const createTestResult = createAsyncThunk(
  "result/createTestResult",
  async (resultData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/result`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create test result"
      );
    }
  }
);

// Async thunk to get result by appointment ID
export const getResultByAppointmentId = createAsyncThunk(
  "result/getResultByAppointmentId",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/result/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch result"
      );
    }
  }
);

// Async thunk to update result
export const updateResult = createAsyncThunk(
  "result/updateResult",
  async ({ resultId, resultData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/result/${resultId}`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update result"
      );
    }
  }
);

// Khách hàng yêu cầu cấp giấy chứng nhận bản cứng cho kết quả xét nghiệm ADN pháp lý.
export const createRequestResultAdmin = createAsyncThunk(
  "result/createRequestResultAdmin",
  async ({ resultId, resultData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/result/${resultId}/request-certificate`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create test result"
      );
    }
  }
);

export const resultSlice = createSlice({
  name: "result",
  initialState: {
    results: [],
    resultAdmin: {},
    loading: false,
    error: null,
    pageInfo: {},
    startTestingLoading: false,
    startTestingError: null,
    createResultLoading: false,
    createResultError: null,
    // Add new state for single result
    currentResult: null,
    resultLoading: false,
    resultError: null,
    // Add new state for update result
    updateResultLoading: false,
    updateResultError: null,
  },
  reducers: {
    resetResults: (state) => {
      state.results = [];
      state.loading = false;
      state.error = null;
      state.pageInfo = {};
    },
    resetStartTesting: (state) => {
      state.startTestingLoading = false;
      state.startTestingError = null;
    },
    resetCreateResult: (state) => {
      state.createResultLoading = false;
      state.createResultError = null;
    },
    // Add new reset action
    resetCurrentResult: (state) => {
      state.currentResult = null;
      state.resultLoading = false;
      state.resultError = null;
    },
    // Add new reset action for update result
    resetUpdateResult: (state) => {
      state.updateResultLoading = false;
      state.updateResultError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResultsByAppointmentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsByAppointmentId.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data || [];
        state.pageInfo = action.payload.pageInfo || {};
      })
      .addCase(fetchResultsByAppointmentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch results";
      })
      .addCase(startTestingProcess.pending, (state) => {
        state.startTestingLoading = true;
        state.startTestingError = null;
      })
      .addCase(startTestingProcess.fulfilled, (state, action) => {
        state.startTestingLoading = false;
      })
      .addCase(startTestingProcess.rejected, (state, action) => {
        state.startTestingLoading = false;
        state.startTestingError = action.payload || "Failed to start testing";
      })
      .addCase(createTestResult.pending, (state) => {
        state.createResultLoading = true;
        state.createResultError = null;
      })
      .addCase(createTestResult.fulfilled, (state, action) => {
        state.createResultLoading = false;
        // Optionally add the new result to the results array
        if (action.payload.data) {
          state.results.push(action.payload.data);
        }
      })
      .addCase(createTestResult.rejected, (state, action) => {
        state.createResultLoading = false;
        state.createResultError =
          action.payload || "Failed to create test result";
      })
      .addCase(getResultByAppointmentId.pending, (state) => {
        state.resultLoading = true;
        state.resultError = null;
      })
      .addCase(getResultByAppointmentId.fulfilled, (state, action) => {
        state.resultLoading = false;
        if (action.payload.success && action.payload.data) {
          state.currentResult = action.payload;
        } else {
          state.currentResult = action.payload || null;
        }
      })
      .addCase(getResultByAppointmentId.rejected, (state, action) => {
        state.resultLoading = false;
        state.resultError = action.payload || "Failed to fetch result";
      })
      .addCase(updateResult.pending, (state) => {
        state.updateResultLoading = true;
        state.updateResultError = null;
      })
      .addCase(updateResult.fulfilled, (state, action) => {
        state.updateResultLoading = false;
        if (action.payload.success && action.payload.data) {
          state.currentResult = action.payload;
        }
      })
      .addCase(updateResult.rejected, (state, action) => {
        state.updateResultLoading = false;
        state.updateResultError = action.payload || "Failed to update result";
      })

      //  createService
      .addCase(createRequestResultAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.resultAdmin.push(action.payload);
      });
  },
});

export const {
  resetResults,
  resetStartTesting,
  resetCreateResult,
  resetCurrentResult,
  resetUpdateResult,
} = resultSlice.actions;
export default resultSlice;
