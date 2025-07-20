import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Spin } from "antd";
import useBlog from "../../../Hooks/useBlog";
import "./Blogger.css";

const Blogger = () => {
  const navigate = useNavigate();
  const { blogs, totalBlogs, loading, searchListBlog } = useBlog(); // dùng dữ liệu từ hook

  const [pageNum, setPageNum] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    searchListBlog({
      searchCondition: { is_published: true },
      pageInfo: { pageNum, pageSize },
    });
  }, [pageNum, searchListBlog]);

  const handleClickBlog = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="blogger-container">
      <div className="blogger-header">
        <h1>Bài viết nổi bật</h1>
        <p>Cập nhật các chia sẻ kiến thức, kinh nghiệm hữu ích.</p>
      </div>

      {loading ? (
        <div className="blogger-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="blogger-grid">
            {blogs.map((blog) => {
              console.log("Rendering blog card:", {
                title: blog.title,
                slug: blog.slug,
                image_url: blog.images?.[0]?.image_url,
              });
              return (
                <div
                  key={blog.slug}
                  className="blogger-card"
                  onClick={() => handleClickBlog(blog.slug)}
                >
                  <img
                    src={
                      blog.images?.[0]?.image_url ||
                      "https://picsum.photos/300/180"
                    }
                    alt={blog.title || "Blog Image"}
                    className="blogger-thumbnail"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/300/180"; // Fallback nếu hình ảnh lỗi
                    }}
                  />
                  <div className="blogger-content">
                    <h3>{blog.title || "Tiêu đề không khả dụng"}</h3>
                    <p className="blogger-short">
                      {typeof blog.content === "string"
                        ? blog.content.slice(0, 40) + "..."
                        : "Nội dung không khả dụng..."}
                    </p>
                    <span className="blogger-link">Đọc thêm →</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="blogger-pagination">
            <Pagination
              current={pageNum}
              pageSize={pageSize}
              total={totalBlogs}
              onChange={(page) => setPageNum(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Blogger;
