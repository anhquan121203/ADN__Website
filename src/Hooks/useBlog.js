import { useDispatch, useSelector } from "react-redux";
import {
  searchBlog,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogCategory,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "../Feartures/blog/blogSlice";
import { useCallback } from "react";

const useBlog = () => {
  const dispatch = useDispatch();
  const { blogs, blogCategories, loading, error, totalBlogs, totalCategories } =
    useSelector((state) => state.blog);

  // BLOG
  const searchListBlog = useCallback(
    (searchPayload) => {
      dispatch(searchBlog(searchPayload));
    },
    [dispatch]
  );

  const blogById = async (id) => {
    try {
      const response = await dispatch(getBlogById(id)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Không lấy được thông tin blog!" };
    }
  };

  const blogBySlug = useCallback(
    async (slug) => {
      try {
        const response = await dispatch(getBlogBySlug(slug)).unwrap();
        // console.log("Raw API response:", response); // Log để kiểm tra
        return { success: true, data: response.data }; // Lấy response.data thay vì response
      } catch (error) {
        // console.error("Error in blogBySlug:", error);
        return { success: false, message: "Không lấy được blog theo slug!" };
      }
    },
    [dispatch]
  );
  const addNewBlog = async (createNewBlog) => {
    try {
      const response = await dispatch(createBlog(createNewBlog)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Tạo blog không thành công!" };
    }
  };

  const updateBlogById = async (id, updateData) => {
    try {
      const response = await dispatch(updateBlog({ id, updateData })).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Cập nhật blog không thành công!" };
    }
  };

  const deleteBlogById = async (id) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // BLOG CATEGORY
  const searchListBlogCategory = useCallback(
    (searchPayload) => {
      dispatch(searchBlogCategory(searchPayload));
    },
    [dispatch]
  );

  const addNewBlogCategory = async (data) => {
    try {
      const response = await dispatch(createBlogCategory(data)).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: "Tạo danh mục blog không thành công!" };
    }
  };

  const updateBlogCategoryById = async (id, updateData) => {
    try {
      const response = await dispatch(
        updateBlogCategory({ id, updateData })
      ).unwrap();
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật danh mục blog không thành công!",
      };
    }
  };

  const deleteBlogCategoryById = async (id) => {
    try {
      await dispatch(deleteBlogCategory(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return {
    blogs,
    blogCategories,
    loading,
    error,
    totalBlogs,
    totalCategories,
    // Blog
    searchListBlog,
    blogById,
    blogBySlug,
    addNewBlog,
    updateBlogById,
    deleteBlogById,
    // Blog Category
    searchListBlogCategory,
    addNewBlogCategory,
    updateBlogCategoryById,
    deleteBlogCategoryById,
  };
};

export default useBlog;
