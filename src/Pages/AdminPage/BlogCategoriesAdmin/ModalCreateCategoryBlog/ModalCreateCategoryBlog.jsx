import React, { useEffect } from "react";
import { Modal, Button, Form, Input } from "antd";

const ModalCreateCategoryBlog = ({
  isModalOpen,
  handleCancel,
  handleCreate,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleCreate({
        name: values.name,
      });
      form.resetFields();
    } catch (error) {
      // Xử lý lỗi nếu muốn
    }
  };

  return (
    <Modal
      title="Tạo danh mục blog mới"
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
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input placeholder="Nhập tên danh mục blog" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateCategoryBlog;
