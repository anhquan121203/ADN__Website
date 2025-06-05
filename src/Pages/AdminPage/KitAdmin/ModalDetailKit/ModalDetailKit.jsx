import {
  Modal,
  Descriptions,
  Typography,
  Tag,
  Empty,
  Divider,
  Space,
  Image,
} from "antd";
import dayjs from "dayjs";

const ModalDetailKit = ({ isModalOpen, handleCancel, selectedKit }) => {
  const { _id, code, status, created_at, updated_at } = selectedKit || {};

   const formatDate = (dateStr) =>
      dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss") : "N/A";

  const renderStatus = (status) => {
    switch (status) {
      case "available":
        return <Tag color="green">Còn hàng</Tag>;
      case "assigned":
        return <Tag color="blue">Đã gắn</Tag>;
      case "used":
        return <Tag color="orange">Đã sử dụng</Tag>;
      case "returned":
        return <Tag color="yellow">Đã trả hàng</Tag>;
      case "damaged":
        return <Tag color="red">Đã hỏng</Tag>;
      default:
        return <Tag color="pink">Không còn</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết dụng cụ"
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
        <Descriptions.Item label="Mã dụng cụ">{code}</Descriptions.Item>
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

export default ModalDetailKit;
