import {
  Modal,
  Descriptions,
  Typography,
  Tag,
  Empty,
  Divider,
  Space,
} from "antd";
import dayjs from "dayjs";

const ModalDetailService = ({ isModalOpen, handleCancel, selectedService }) => {
  const {
    _id,
    name,
    type,
    is_active,
    sample_method,
    price,
    estimated_time,
    parent_service_id,
    description,
    created_at,
    updated_at,
  } = selectedService || {};

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss") : "N/A";

  const renderSampleMethod = (method) => {
    switch (method) {
      case "self_collected":
        return <Tag color="blue">Tự thu hồi</Tag>;
      case "facility_collected":
        return <Tag color="green">Cơ sở thu hồi</Tag>;
      case "home_collected":
        return <Tag color="cyan">Thu hồi tại nhà</Tag>;
      default:
        return "N/A";
    }
  };

  const renderType = (type) => {
    switch (type) {
      case "civil":
        return <Tag color="blue">Dân sự</Tag>;
      case "administrative":
        return <Tag color="purple">Hành chính</Tag>;
      default:
        return "N/A";
    }
  };

  const renderStatus = (active) =>
    active ? (
      <Tag color="green">Hoạt động</Tag>
    ) : (
      <Tag color="red">Bị khóa</Tag>
    );

  return (
    <Modal
      title="Service Details"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={2}
        labelStyle={{ width: "30%" }}
        contentStyle={{ width: "70%" }}
        size="middle"
      >
        <Descriptions.Item label="ID Dịch vụ">{_id}</Descriptions.Item>
        <Descriptions.Item label="Loại">{renderType(type)}</Descriptions.Item>

        <Descriptions.Item label="Tên">{name || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderStatus(is_active)}
        </Descriptions.Item>

        <Descriptions.Item label="Phương thức">
          {renderSampleMethod(sample_method)}
        </Descriptions.Item>
        <Descriptions.Item label="Giá tiền">
          {price ? `${Number(price).toLocaleString()} VNĐ` : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Dịch vụ cha">
          {typeof parent_service_id === "object"
            ? parent_service_id.name
            : parent_service_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian ước tính">
          {estimated_time ? (
            <Tag color="blue">
              🕐 {estimated_time} minutes
            </Tag>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Mô tả" span={2}>
          {description || "N/A"}
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

export default ModalDetailService;
