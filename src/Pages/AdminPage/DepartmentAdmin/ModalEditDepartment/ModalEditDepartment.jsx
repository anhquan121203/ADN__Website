import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select } from "antd";

const ModalEditDepartment = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editDepartment,
  managers = [],
  loadingManagers = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen && editDepartment) {
      form.setFieldsValue({
        name: editDepartment.name,
        description: editDepartment.description,
        manager_id:
          typeof editDepartment.manager_id === "object"
            ? editDepartment.manager_id._id
            : editDepartment.manager_id,
      });
    }
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, editDepartment, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleEdit({
        name: values.name,
        description: values.description,
        manager_id: values.manager_id,
      });
      form.resetFields();
    } catch (error) {}
  };

  return (
    <Modal
      title="Chỉnh sửa phòng ban"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên phòng ban"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
        >
          <Input placeholder="Nhập tên phòng ban" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input placeholder="Nhập mô tả phòng ban" />
        </Form.Item>
        <Form.Item
          label="Quản lý phòng ban"
          name="manager_id"
          rules={[{ required: true, message: "Vui lòng chọn quản lý!" }]}
        >
          <Select
            placeholder="Chọn quản lý"
            loading={loadingManagers}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {managers.map((manager) => (
              <Select.Option key={manager._id} value={manager._id}>
                {manager.first_name} {manager.last_name} ({manager.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditDepartment;