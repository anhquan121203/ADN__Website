import React, { useEffect } from "react";
import { Modal, Button, Form, Input } from "antd";

const ModalEditCategoryBlog = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  loading = false,
  editCategory,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen && editCategory) {
      form.setFieldsValue({ name: editCategory.name });
    }
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, editCategory, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleEdit({ ...editCategory, name: values.name });
      form.resetFields();
    } catch (error) {
      // Xử lý lỗi nếu muốn
    }
  };

  return (
    <Modal
      title="Chỉnh sửa danh mục blog"
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
          Lưu lại
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

export default ModalEditCategoryBlog;
