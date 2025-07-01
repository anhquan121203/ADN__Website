import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ModalCreateBlog = ({
  isModalOpen,
  handleCancel,
  handleCreate,
  loading = false,
  categories = [],
  services = [],
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  const normFile = (e) => {
    // Antd Upload onChange returns array of files
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Chuẩn hóa request body:
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("slug", values.slug);
      formData.append("blog_category_id", values.blog_category_id);
      formData.append("service_id", values.service_id || "");
      // images là mảng các file
      if (values.images && values.images.length > 0) {
        values.images.forEach((fileObj, idx) => {
          if (fileObj.originFileObj) {
            formData.append("images", fileObj.originFileObj);
          }
        });
      }
      await handleCreate(formData);
      form.resetFields();
    } catch (error) {
      // Xử lý lỗi nếu muốn
    }
  };

  return (
    <Modal
      title="Tạo blog mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Tạo mới
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề blog" />
        </Form.Item>
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
        >
          <Input placeholder="Nhập slug (không dấu, không khoảng trắng)" />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea placeholder="Nội dung blog..." rows={5} />
        </Form.Item>
        <Form.Item
          label="Danh mục blog"
          name="blog_category_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục blog!" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Select.Option value={cat._id || cat.id} key={cat._id || cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Dịch vụ liên quan" name="service_id">
          <Select placeholder="Chọn dịch vụ (nếu có)" allowClear>
            {services.map((sv) => (
              <Select.Option value={sv._id || sv.id} key={sv._id || sv.id}>
                {sv.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ảnh (có thể chọn nhiều)"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false} // Không upload ngay, chỉ lưu vào form
            multiple
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Thêm ảnh</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateBlog;