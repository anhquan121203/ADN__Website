import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ModalCreateCaseAdmin = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleAdd(values); // Gửi JSON đơn giản

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo hồ sơ thành công");
      }
    } catch (error) {
      toast.error("Tạo hồ sơ không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo hồ sơ mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo hồ sơ
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã hồ sơ"
          name="case_number"
          rules={[{ required: true, message: "Vui lòng nhập mã hồ sơ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã ủy quyền"
          name="authorization_code"
          rules={[{ required: true, message: "Vui lòng nhập mã ủy quyền!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên người liên hệ cơ quan"
          name="agency_contact_name"
          rules={[
            { required: true, message: "Vui lòng nhập tên người liên hệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email cơ quan"
          name="agency_contact_email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email cơ quan!",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại cơ quan"
          name="agency_contact_phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateCaseAdmin;
