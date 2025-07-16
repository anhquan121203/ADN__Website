import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Constants/apiConstants";

// ========== BLOG CATEGORY (6 API) ==========

// 1. POST /api/blog-category - Create a new blog category (Admin)
export const createBlogCategory = createAsyncThunk(
  "blog/createBlogCategory",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/blog-category`,
        data,
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

// 2. GET /api/blog-category - Get all blog categories (Public)
export const getAllBlogCategories = createAsyncThunk(
  "blog/getAllBlogCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog-category`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. GET /api/blog-category/{id} - Get a blog category by ID (Public)
export const getBlogCategoryById = createAsyncThunk(
  "blog/getBlogCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/blog-category/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. PUT /api/blog-category/{id} - Update a blog category (Admin)
export const updateBlogCategory = createAsyncThunk(
  "blog/updateBlogCategory",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/blog-category/${id}`,
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

// 5. DELETE /api/blog-category/{id} - Delete a blog category (Admin)
export const deleteBlogCategory = createAsyncThunk(
  "blog/deleteBlogCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/blog-category/${id}`, {
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

// 6. POST /api/blog-category/search - Search blog categories with pagination (Public/Admin)
export const searchBlogCategory = createAsyncThunk(
  "blog/searchBlogCategory",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/blog-category/search`,
        query,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ========== BLOG (9 API) ==========

// 1. GET /api/blog - Get all blogs (Public)
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. GET /api/blog/{id} - Get a blog by ID (Public)
export const getBlogById = createAsyncThunk(
  "blog/getBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. PUT /api/blog/{id} - Update a blog with optional image uploads (Admin)
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/blog/${id}`,
        updateData,
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

// 4. DELETE /api/blog/{id} - Delete a blog (Admin)
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/blog/${id}`, {
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

// 5. DELETE /api/blog/{id}/image - Delete an image from a blog (Admin)
export const deleteBlogImage = createAsyncThunk(
  "blog/deleteBlogImage",
  async ({ id, imageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/blog/${id}/image`, {
        data: { imageId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 6. GET /api/blog/{id}/logs - Gets logs for a blog (Admin)
export const getBlogLogs = createAsyncThunk(
  "blog/getBlogLogs",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/blog/${id}/logs`, {
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

// 7. POST /api/blog/create - Create a new blog with optional image uploads (Admin)
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/blog/create`,
        blogData,
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

// 8. POST /api/blog/search - Search blogs with pagination (Public/Admin)
export const searchBlog = createAsyncThunk(
  "blog/searchBlog",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/blog/search`,
        query,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 9. GET /api/blog/slug/{slug} - Get a blog by slug (Public)
export const getBlogBySlug = createAsyncThunk(
  "blog/getBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/blog/slug/${slug}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ========== SLICE ==========

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    blogCategories: [],
    blogLogs: [],
    loading: false,
    error: null,
    totalBlogs: 0,
    totalCategories: 0,
    blogDetail: null,
    blogCategoryDetail: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Blog Categories
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.blogCategories.push(action.payload);
      })
      .addCase(getAllBlogCategories.fulfilled, (state, action) => {
        state.blogCategories = action.payload;
      })
      .addCase(getBlogCategoryById.fulfilled, (state, action) => {
        state.blogCategoryDetail = action.payload;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.blogCategories = state.blogCategories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.blogCategories = state.blogCategories.filter(
          (cat) => (cat._id || cat.id) !== action.payload
        );
      })
      .addCase(searchBlogCategory.fulfilled, (state, action) => {
        state.blogCategories = action.payload.data.pageData || [];
        state.totalCategories = action.payload.data.pageInfo?.totalItems || 0;
      })

      // Blogs
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.blogDetail = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlogImage.fulfilled, (state, action) => {
        const { blogId, imageId } = action.meta.arg;
        state.blogs = state.blogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                images: blog.images?.filter((img) => img._id !== imageId),
              }
            : blog
        );
      })
      .addCase(getBlogLogs.fulfilled, (state, action) => {
        state.blogLogs = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(searchBlog.fulfilled, (state, action) => {
        state.blogs = action.payload.data.pageData || [];
        state.totalBlogs = action.payload.data.pageInfo?.totalItems || 0;
        // console.log("searchBlog.fulfilled payload:", action.payload);
      })
      .addCase(getBlogBySlug.fulfilled, (state, action) => {
        state.blogDetail = action.payload;
      });
  },
});

export default blogSlice;
