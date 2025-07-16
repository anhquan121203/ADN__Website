import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Button, message } from "antd";

const { TextArea } = Input;

const ModalEditBlog = ({
  isModalOpen,
  handleCancel,
  handleUpdate,
  blog,
  categories,
  services,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        service_id: blog.service_id?._id || blog.service_id,
        blog_category_id: blog.blog_category_id?._id || blog.blog_category_id,
        is_published: blog.is_published,
      });
    }
  }, [blog, form]);

  const onFinish = async (values) => {
    if (blog && blog._id) {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", values.content);
      formData.append("blog_category_id", values.blog_category_id);
      formData.append("service_id", values.service_id || "");
      formData.append("is_published", values.is_published);

      try {
        await handleUpdate(blog._id, formData);
      } catch (error) {
        message.error("Cập nhật blog thất bại!");
      }
    }
  };

  return (
    <Modal
      title="Cập nhật Blog"
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
          onClick={() => form.submit()}
        >
          Cập nhật
        </Button>,
      ]}
      width={600}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề blog" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
        >
          <Input placeholder="Nhập slug (không dấu, không khoảng trắng)" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea placeholder="Nội dung blog..." rows={5} />
        </Form.Item>
        <Form.Item
          name="blog_category_id"
          label="Danh mục blog"
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
          name="is_published"
          label="Công khai"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditBlog;
