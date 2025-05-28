import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// Search department
export const searchDepartment = createAsyncThunk(
  "department/searchDepartmen",
  async (listDepartment, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/department/search`,
        {
          params: listDepartment,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create department
export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (createNewDepartment, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/department/create`,
        createNewDepartment,
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

// Get department by ID
export const getDepartmentById = createAsyncThunk(
  "department/getDepartmentById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/department/${id}`, {
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

// Update department
export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/department/${id}`,
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

// Delete department
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/department/${id}`, {
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

// Slice
const departmentSlice = createSlice({
  name: "DEPARTMENT",
  initialState: {
    departments: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDepartment.fulfilled, (state, action) => {
        console.log("Dữ liệu trả về từ API:", action.payload);
        state.loading = false;
        state.departments = action.payload.pageData; // Lấy danh sách department
        state.total = action.payload.pageInfo.totalItems; // Tổng số department
      })
      .addCase(searchDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch departments";
      })

      // Create department
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })

      // Update department
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.map((department) =>
          department._id === action.payload._id ? action.payload : department
        );
      })

      // Delete department
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(
          (department) => department._id !== action.payload
        );
      });
  },
});

export default departmentSlice;
