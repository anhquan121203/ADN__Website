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

const ModalRequestResultAdmin = ({ isModalOpen, handleCancel, handleAdd, resultId  }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleAdd({
        resultId,
        ...values,
      });

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo yêu cầu thành công");
      }
    } catch (error) {
      toast.error("Tạo yêu cầu không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo yêu cầu"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo yêu cầu cấp giấy xét nghiệm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="delivery_address"
          rules={[{ required: true, message: "Vui lòng mô tả thiết bị!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalRequestResultAdmin;
