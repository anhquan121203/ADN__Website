import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useBlog from "../../../../Hooks/useBlog";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const { blogBySlug } = useBlog();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      //   console.log("Fetching blog with slug:", slug);
      try {
        const res = await blogBySlug(slug);
        // console.log("blogBySlug response:", res);
        if (res.success) {
          //   console.log("Blog data:", res.data);
          setBlog(res.data);
        } else {
          //   console.log("Failed to fetch blog:", res.message);
          setError(res.message || "Không tìm thấy bài viết!");
        }
      } catch (err) {
        // console.error("Error fetching blog:", err);
        setError("Đã xảy ra lỗi khi lấy bài viết!");
      }
      setLoading(false);
    };
    fetchBlog();
  }, [slug, blogBySlug]);

  if (loading) {
    return (
      <div
        className="blogdetail-loading"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="blogdetail-error"
        style={{ color: "red", textAlign: "center" }}
      >
        {error}
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        className="blogdetail-error"
        style={{ color: "red", textAlign: "center" }}
      >
        Không tìm thấy bài viết!
      </div>
    );
  }

//   console.log("Rendering blog:", {
//     title: blog.title,
//     content: blog.content,
//     image_url: blog.images?.[0]?.image_url,
//   });

  return (
    <div className="blogdetail-container">
      <h1 className="blogdetail-title">
        {blog.title || "Tiêu đề không khả dụng"}
      </h1>
      <img
        className="blogdetail-banner"
        src={blog.images?.[0]?.image_url || "https://picsum.photos/300/180"}
        alt={blog.title || "Blog Image"}
        onError={(e) => {
          e.target.src = "https://picsum.photos/300/180"; 
        }}
      />
      <div className="blogdetail-content">
        {blog.content && blog.content.startsWith("<") ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <p>{blog.content || "Nội dung không khả dụng"}</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
