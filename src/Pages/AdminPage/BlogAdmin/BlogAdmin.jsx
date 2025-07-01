import React, { useEffect, useState } from "react";
import { Pagination, Spin, Button, message } from "antd";
import useBlog from "../../../Hooks/useBlog";
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
    // Nếu cần, truyền thêm list dịch vụ từ useService
  } = useBlog();

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
        <h2 className="table-title">Blogs</h2>
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
        categories={blogCategories} // truyền danh mục blog từ hook
        services={[]} // truyền dịch vụ nếu có, hoặc lấy từ useService
      />
    </div>
  );
}

export default BlogAdmin;
