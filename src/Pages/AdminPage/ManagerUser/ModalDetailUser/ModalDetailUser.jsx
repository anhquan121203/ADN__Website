import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

const ModalDetailUser = ({ isModalOpen, handleCancel, selectedUser }) => {
  const [form] = Form.useForm();

  const {
    first_name,
    last_name,
    email,
    phone_numer,
    gender,
    role,
    status,
    avatar_url,
    created_at,
    updated_at,
  } = selectedUser || {};

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss") : "N/A";

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue(selectedUser);
    }
  }, [selectedUser, form]);

  const renderGender = (gender) => {
    switch (gender) {
      case "male":
        return <Tag color="green">Name</Tag>;
      case "female":
        return <Tag color="red">Nữ</Tag>;
      default:
        return <Tag color="pink">Giới tính khác</Tag>;
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case true:
        return <Tag color="green">Hoạt động</Tag>;
      case false:
        return <Tag color="red">Đã khóa</Tag>;
      default:
        return <Tag color="pink">Không có trạng thái</Tag>;
    }
  };

  const renderRole = (role) => {
    switch (role) {
      case "customer":
        return <Tag color="green">Khách hàng</Tag>;
      case "staff":
        return <Tag color="blue">Nhân viên</Tag>;
      case "manager":
        return <Tag color="red">Quản lý</Tag>;
      case "laboratory_technician":
        return <Tag color="orange">Xét nghiệm viên</Tag>;
      default:
        return <Tag color="pink">Không có trạng thái</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết người dùng"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={2}
        labelStyle={{ width: "20%" }}
        contentStyle={{ width: "20%" }}
        size="middle"
      >
        <Descriptions.Item label="Ảnh đại diện" span={2}>
          <Image
            style={{ width: 100, height: 100, objectFit: "cover" }}
            src={avatar_url || "https://via.placeholder.com/100"}
          />
        </Descriptions.Item>
        
        <Descriptions.Item label="Họ và tên">
          {first_name} {last_name}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính">
          {renderGender(gender)}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {phone_numer || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phân quyền">
          {renderRole(role)}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          {renderStatus(status)}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {formatDate(created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {formatDate(updated_at)}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ textAlign: "right" }}>
        <button onClick={handleCancel} className="ant-btn">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetailUser;
