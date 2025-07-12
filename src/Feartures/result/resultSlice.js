import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Async thunk to fetch results by appointment ID
export const fetchResultsByAppointmentId = createAsyncThunk(
    "result/fetchResultsByAppointmentId",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/api/result/appointment/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch results");
        }
    }
);

// Async thunk to start testing process
export const startTestingProcess = createAsyncThunk(
    "result/startTestingProcess",
    async (testingData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(`${API_BASE_URL}/api/result/sample/start-testing`, testingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to start testing process");
        }
    }
);

// Async thunk to create test result
export const createTestResult = createAsyncThunk(
    "result/createTestResult",
    async (resultData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(`${API_BASE_URL}/api/result`, resultData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create test result");
        }
    }
);

export const resultSlice = createSlice({
    name: "result",
    initialState: {
        results: [],
        loading: false,
        error: null,
        pageInfo: {},
        startTestingLoading: false,
        startTestingError: null,
        createResultLoading: false,
        createResultError: null,
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
                state.createResultError = action.payload || "Failed to create test result";
            });
    },
});

export const { resetResults, resetStartTesting, resetCreateResult } = resultSlice.actions;
export default resultSlice;