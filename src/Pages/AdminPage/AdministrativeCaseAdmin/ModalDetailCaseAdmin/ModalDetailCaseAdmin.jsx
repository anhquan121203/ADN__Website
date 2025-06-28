import { Modal, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
// import "./ModalDetailCaseAdmin.css"

const ModalDetailCaseAdmin = ({ isModalOpen, handleCancel, selectedCase }) => {
  if (!selectedCase) return null;

  const {
    _id,
    case_number,
    authorization_code,
    status,
    agency_contact_email,
    agency_contact_name,
    agency_contact_phone,
    applicant_name,
    applicant_email,
    applicant_id,
    is_deleted,
    created_at,
    updated_at,
  } = selectedCase || {};

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss") : "N/A";

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="orange">Đang chờ</Tag>;
      case "approved":
        return <Tag color="green">Đã duyệt</Tag>;
      case "rejected":
        return <Tag color="red">Từ chối</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết hồ sơ"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={2}
        size="middle"
        labelStyle={{ width: "25%", fontWeight: 500 }}
        contentStyle={{ width: "75%" }}
      >
        <Descriptions.Item label="Mã hồ sơ">{case_number}</Descriptions.Item>
        <Descriptions.Item label="Mã ủy quyền" >
          {authorization_code || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          {renderStatus(status)}
        </Descriptions.Item>
        <Descriptions.Item label="Đã xóa">
          {is_deleted ? (
            <Tag color="red">Đã xóa</Tag>
          ) : (
            <Tag color="green">Còn hiệu lực</Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tên người nộp đơn">
          {applicant_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email người nộp">
          {applicant_email || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Tài khoản nộp đơn" span={2}>
          {applicant_id?.first_name} {applicant_id?.last_name} (
          {applicant_id?.email}) -{" "}
          <Tag color={applicant_id?.role === "admin" ? "blue" : "default"}>
            {applicant_id?.role}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Tên người liên hệ cơ quan">
          {agency_contact_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email cơ quan">
          {agency_contact_email || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="SĐT cơ quan">
          {agency_contact_phone || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {formatDate(created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {formatDate(updated_at)}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <button onClick={handleCancel} className="ant-btn">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetailCaseAdmin;
