import React, { useEffect, useState } from "react";
import { Pagination, Spin, Button, message } from "antd";
import useBlog from "../../../Hooks/useBlog";
import useService from "../../../Hooks/useService";
import ModalCreateBlog from "./ModalCreateBlog/ModalCreateBlog";
import "./BlogAdmin.css";

function BlogAdmin() {
  const {
    blogs,
    totalBlogs,
    loading,
    error,
    searchListBlog,
    addNewBlog,
    blogCategories,
  } = useBlog();
  const { services, searchListService } = useService();

  const [currentBlogPage, setCurrentBlogPage] = useState(1);
  const blogPageSize = 10;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [blogFilters, setBlogFilters] = useState({
    keyword: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Lấy danh sách blog
  useEffect(() => {
    searchListBlog({
      ...blogFilters,
      pageNum: currentBlogPage,
      pageSize: blogPageSize,
    });
    // eslint-disable-next-line
  }, [currentBlogPage, blogFilters]);

  // Lấy danh sách dịch vụ
  useEffect(() => {
    searchListService({
      is_active: true,
      pageNum: 1,
      pageSize: 10,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, []);

  // Handler tạo mới blog
  const handleCreateBlog = async (formData) => {
    const res = await addNewBlog(formData);
    if (res.success) {
      message.success("Tạo blog mới thành công!");
      setIsAddModalOpen(false);
      searchListBlog({
        ...blogFilters,
        pageNum: 1,
        pageSize: blogPageSize,
      });
      setCurrentBlogPage(1);
    } else {
      message.error(res.message || "Tạo blog thất bại!");
    }
  };

  return (
    <div className="blog-admin">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 className="table-title">Các bài Blog</h2>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Thêm blog
        </Button>
      </div>
      <div className="admin-table-container">
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
                    <tr key={blog.id || blog._id}>
                      <td>{(currentBlogPage - 1) * blogPageSize + idx + 1}</td>
                      <td>{blog.title || "N/A"}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {blog.content || "N/A"}
                        </div>
                      </td>
                      <td>
                        {typeof blog.user_id === "object"
                          ? `${blog.user_id.email || blog.user_id._id}`
                          : blog.user_id || "N/A"}
                      </td>
                      <td>
                        {typeof blog.service_id === "object"
                          ? blog.service_id.name || blog.service_id._id
                          : blog.service_id || "N/A"}
                      </td>
                      <td>
                        {typeof blog.blog_category_id === "object"
                          ? blog.blog_category_id.name ||
                            blog.blog_category_id._id
                          : blog.blog_category_id || "N/A"}
                      </td>
                      <td>{blog.is_published ? "Yes" : "No"}</td>
                      <td>
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {Array.isArray(blog.images) &&
                        blog.images.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            {blog.images.map((img, i) => (
                              <img
                                key={i}
                                src={img.image_url || "#"}
                                alt={img.name || `image-${i}`}
                                style={{
                                  maxWidth: 120,
                                  maxHeight: 80,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  border: "1px solid #ddd",
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#888" }}>No images</span>
                        )}
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
                    <td colSpan={11} style={{ textAlign: "center" }}>
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

      {/* Modal tạo blog */}
      <ModalCreateBlog
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleCreate={handleCreateBlog}
        loading={loading}
        categories={blogCategories}
        services={services}
      />
    </div>
  );
}

export default BlogAdmin;
