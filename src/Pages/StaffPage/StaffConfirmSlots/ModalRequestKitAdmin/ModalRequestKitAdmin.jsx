import React, { useState } from "react";
import { Modal, Select, Input, Button, Form, Space, message, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import useSample from "../../../../Hooks/useSample";

const sampleTypeOptions = [
  { label: "Máu", value: "blood" },
  { label: "Nước bọt", value: "saliva" },
  { label: "Tóc", value: "hair" },
  { label: "Khác", value: "other" }
];

const ModalRequestKitAdmin = ({ open, onClose, appointment, onSuccess }) => {
  const { collectSample, loading } = useSample();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        appointment_id: appointment,
        type: values.type,
        // person_info: values.person_info
      };

      setSubmitting(true);
      const res = await collectSample(appointment, values.type);
      
      if (res.success) {
        message.success("Thu thập mẫu tại cơ sở thành công!");
        form.resetFields();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        message.error(res.error || "Có lỗi xảy ra khi thu thập mẫu");
      }
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Thu thập mẫu hành chính tại cơ sở"
      onOk={handleSubmit}
      okText="Thu thập mẫu"
      cancelText="Hủy"
      confirmLoading={submitting || loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Loại mẫu"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại mẫu" }]}
        >
          <Select
            mode="multiple"
            options={sampleTypeOptions}
            placeholder="Chọn loại mẫu"
          />
        </Form.Item>

        
      </Form>
    </Modal>
  );
};

export default ModalRequestKitAdmin;
