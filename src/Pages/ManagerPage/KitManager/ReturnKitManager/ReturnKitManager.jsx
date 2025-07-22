import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReturnKitManager = ({ isModalOpen, handleCancel, handleReturn, editKit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editKit) {
      form.setFieldsValue({
        ...editKit,
      });
    }
  }, [isModalOpen, editKit]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleReturn(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật dụng cụ thành công");
      }
    } catch (error) {
      toast.error("Cập nhật dụng cụ không thành công!");
    }
  };

  return (
    <Modal
      title="Trả hàng dụng cụ"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Lưu ý"
          name="note"
          rules={[{ required: true, message: "Vui lòng nhập lưu ý khi trả hàng!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReturnKitManager;
