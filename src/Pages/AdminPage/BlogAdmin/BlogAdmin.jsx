import React, { useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import useBlog from "../../../Hooks/useBlog";
import "./BlogAdmin.css";

function BlogAdmin() {
  const {
    blogs,
    blogCategories,
    totalBlogs,
    totalCategories,
    loading,
    error,
    searchListBlog,
    searchListBlogCategory,
  } = useBlog();

  // State phân trang blogs
  const [currentBlogPage, setCurrentBlogPage] = useState(1);
  const blogPageSize = 10;

  // State phân trang blog categories
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const categoryPageSize = 10;

  // State filter (mở rộng nếu cần)
  const [blogFilters, setBlogFilters] = useState({
    keyword: "",
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [categoryFilters, setCategoryFilters] = useState({
    keyword: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  useEffect(() => {
    searchListBlog({
      ...blogFilters,
      pageNum: currentBlogPage,
      pageSize: blogPageSize,
    });
    // eslint-disable-next-line
  }, [currentBlogPage, blogFilters]);

  useEffect(() => {
    searchListBlogCategory({
      ...categoryFilters,
      pageNum: currentCategoryPage,
      pageSize: categoryPageSize,
    });
    // eslint-disable-next-line
  }, [currentCategoryPage, categoryFilters]);

  return (
    <div className="blog-admin">
      {/* Blog Categories Table */}
      <div className="admin-table-container">
        <h2 className="table-title">Blog Categories</h2>
        {loading ? (
          <Spin />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>

                  <th>Name</th>

                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {blogCategories && blogCategories.length > 0 ? (
                  blogCategories.map((cat, idx) => (
                    <tr key={cat._id || cat.id}>
                      <td>
                        {(currentCategoryPage - 1) * categoryPageSize + idx + 1}
                      </td>

                      <td>{cat.name}</td>

                      <td>
                        {cat.created_at
                          ? new Date(cat.created_at).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {cat.updated_at
                          ? new Date(cat.updated_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              current={currentCategoryPage}
              pageSize={categoryPageSize}
              total={totalCategories}
              onChange={setCurrentCategoryPage}
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
              }}
            />
          </>
        )}
      </div>

      {/* Blogs Table */}
      <div className="admin-table-container">
        <h2 className="table-title">Blogs</h2>
        {loading ? (
          <Spin />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>

                  <th>Title</th>
                  <th>Content</th>

                  <th>User ID</th>
                  <th>Service ID</th>
                  <th>Category ID</th>
                  <th>Is Published</th>
                  <th>Published At</th>
                  <th>Images</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog, idx) => (
                    <tr key={blog._id || blog.id}>
                      <td>{(currentBlogPage - 1) * blogPageSize + idx + 1}</td>

                      <td>{blog.title}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {blog.content}
                        </div>
                      </td>

                      <td>{blog.user_id}</td>
                      <td>{blog.service_id}</td>
                      <td>{blog.blog_category_id}</td>
                      <td>{blog.is_published ? "Yes" : "No"}</td>
                      <td>
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {blog.images && blog.images.length > 0
                          ? blog.images.map((img, i) => (
                              <div key={i}>
                                <a
                                  href={img.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {img.name}
                                </a>
                              </div>
                            ))
                          : ""}
                      </td>
                      <td>
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {blog.updated_at
                          ? new Date(blog.updated_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} style={{ textAlign: "center" }}>
                      No blogs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              current={currentBlogPage}
              pageSize={blogPageSize}
              total={totalBlogs}
              onChange={setCurrentBlogPage}
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BlogAdmin;
