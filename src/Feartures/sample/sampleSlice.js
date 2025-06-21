import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

export const addSamplesToAppointment = createAsyncThunk(
  "sample/addSamplesToAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/sample/add-to-appointment`,
        payload,
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
export const fetchSamplesByAppointment = createAsyncThunk(
  "sample/fetchSamplesByAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/sample/appointment/${appointmentId}`,
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
export const receiveSamples = createAsyncThunk(
  "sample/receiveSamples",
  async ({ sampleIds, receivedDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/sample/batch-receive`,
        {
          sample_ids: sampleIds,
          received_date: receivedDate
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

export const uploadSamplePersonImage = createAsyncThunk(
  "sample/uploadSamplePersonImage",
  async ({ sampleId, imageFile }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("sample_id", sampleId);
      formData.append("image", imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/api/sample/upload-person-image`,
        formData,
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
export const batchSubmitSamples = createAsyncThunk(
  "sample/batchSubmitSamples",
  async ({ sample_ids, collection_date }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/sample/batch-submit`,
        { sample_ids, collection_date },
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

export const searchSamples = createAsyncThunk(
  'sample/search',
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_BASE_URL}/api/sample/search`,
        {
          params: {
            status: filters.status || '',
            type: filters.type || '',
            appointmentId: filters.appointmentId || '',
            kitCode: filters.kitCode || '',
            personName: filters.personName || '',
            startDate: filters.startDate || '',
            endDate: filters.endDate || '',
            page: filters.page || 1,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sampleSlice = createSlice({
  name: "sample",
  initialState: {
    samples: [],
    // data: [],
    isLoading: false,
    isError: false,
    error: "",
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    filters: {
      status: '',
      type: '',
      appointmentId: '',
      kitCode: '',
      personName: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        type: '',
        appointmentId: '',
        kitCode: '',
        personName: '',
        startDate: '',
        endDate: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSamplesToAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addSamplesToAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload;
      })
     .addCase(addSamplesToAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchSamplesByAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSamplesByAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload.data; // API returns { success, data }
      })
      .addCase(fetchSamplesByAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(searchSamples.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchSamples.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload.data || [];
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.totalItems || 0,
        };
      })
      .addCase(searchSamples.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch samples';
      });
  },
});
export const { updateFilters, resetFilters } = sampleSlice.actions;
export default sampleSlice;