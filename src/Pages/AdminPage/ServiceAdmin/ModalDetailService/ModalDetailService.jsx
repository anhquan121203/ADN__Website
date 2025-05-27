import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { useEffect } from "react";

const ModalDetailService = ({ isModalOpen, handleCancel, selectedService }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedService) {
      form.setFieldsValue(selectedService);
    }
  }, [selectedService, form]);

  return (
    <Modal
      title="Chi tiết sản phẩm"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item label="Tên">
          <Typography.Text>{selectedService?.name ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Email">
          <Typography.Text>
            {selectedService?.description ?? "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Loại">
          <Typography.Text>{selectedService?.type ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Phương thức">
          <Typography.Text>
            {selectedService?.sample_method ?? "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Thời gian ước tính">
          <Typography.Text>
            {selectedService?.estimated_time ?? "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Giá tiền">
          <Typography.Text>{selectedService?.price ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Ngày tạo">
          <Typography.Text>
            {selectedService?.created_at ?? "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Typography.Text>
            {selectedService?.is_active ? "Hoạt động" : "Bị khóa"}
          </Typography.Text>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailService;
