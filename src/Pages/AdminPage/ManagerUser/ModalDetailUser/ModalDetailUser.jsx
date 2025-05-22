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

const ModalDetailUser = ({ isModalOpen, handleCancel, selectedUser }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue(selectedUser);
    }
  }, [selectedUser, form]);

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
        <Form.Item label="Họ tên">
          <Typography.Text>{`${selectedUser?.first_name ?? "N/A"} ${
            selectedUser?.last_name ?? ""
          }`}</Typography.Text>
        </Form.Item>

        <Form.Item label="Email">
          <Typography.Text>{selectedUser?.email ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Số điện thoại">
          <Typography.Text>
            {selectedUser?.phone_number ?? "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Giới tính">
          <Typography.Text>{selectedUser?.gender ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Vai trò">
          <Typography.Text>{selectedUser?.role ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Typography.Text>
            {selectedUser?.status ? "Hoạt động" : "Bị khóa"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Image
            style={{ width: 100, height: 100, objectFit: "cover" }}
            src={selectedUser?.avatar_url || "https://via.placeholder.com/100"}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailUser;
