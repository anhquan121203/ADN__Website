import React from "react";
import { Modal, Descriptions, Image } from "antd";

const ModalDetailBlog = ({ isModalOpen, handleCancel, blog }) => {
  if (!blog) return null;

  const {
    title,
    content,
    slug,
    user_id,
    service_id,
    blog_category_id,
    is_published,
    published_at,
    images,
    created_at,
    updated_at,
  } = blog;

  return (
    <Modal
      title="Chi tiết Blog"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Tiêu đề">{title}</Descriptions.Item>
        <Descriptions.Item label="Slug">{slug}</Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          {typeof user_id === "object"
            ? user_id.email || user_id.last_name || user_id._id
            : user_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">
          {typeof service_id === "object"
            ? service_id.name || service_id._id
            : service_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Danh mục">
          {typeof blog_category_id === "object"
            ? blog_category_id.name || blog_category_id._id
            : blog_category_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {is_published ? "Đã xuất bản" : "Chưa xuất bản"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày xuất bản">
          {published_at ? new Date(published_at).toLocaleString() : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(created_at).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {new Date(updated_at).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung">
          <div
            style={{
              maxHeight: 200,
              overflowY: "auto",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Hình ảnh">
          {Array.isArray(images) && images.length > 0 ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.image_url}
                  alt={img.name || `image-${idx}`}
                  width={120}
                  height={80}
                  style={{ objectFit: "cover" }}
                />
              ))}
            </div>
          ) : (
            <span>Không có hình ảnh</span>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalDetailBlog;
