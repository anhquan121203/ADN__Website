import {
  Modal,
  Descriptions,
  Typography,
  Tag,
  Divider,
  Space,
  Empty,
} from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ModalDetailStafProfile = ({ isModalOpen, handleCancel, selectedStaff }) => {
  const {
    user_id,
    department_id,
    job_title,
    hire_date,
    employee_id,
    salary,
    status,
    qualifications,
    created_at,
    updated_at,
  } = selectedStaff || {};

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD") : "N/A";

  const renderStatus = (status) => {
    switch (status) {
      case "active":
        return <Tag color="green">Đang hoạt động</Tag>;
      case "on_leave":
        return <Tag color="red">Tạm dừng</Tag>;
      default:
        return <Tag color="default">Dừng hoạt động</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết nhân sự"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={900}
    >
      <Descriptions
        bordered
        column={2}
        labelStyle={{ width: "30%" }}
        contentStyle={{ width: "70%" }}
        size="middle"
      >
        <Descriptions.Item label="Mã nhân sự">
          {employee_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderStatus(status)}
        </Descriptions.Item>

        <Descriptions.Item label="Họ tên">
          {user_id
            ? `${user_id.first_name} ${user_id.last_name}`
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {user_id?.email || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Phòng ban">
          {department_id?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          {job_title || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tuyển dụng">
          {formatDate(hire_date)}
        </Descriptions.Item>
        <Descriptions.Item label="Lương">
          {salary ? `${Number(salary).toLocaleString()} VNĐ` : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {formatDate(created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {formatDate(updated_at)}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Bằng cấp</Divider>
      {qualifications && qualifications.length > 0 ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          {qualifications.map((q) => (
            <Descriptions
              key={q._id}
              bordered
              size="small"
              column={2}
              style={{ background: "#fafafa", padding: 12 }}
            >
              <Descriptions.Item label="Tên bằng cấp">
                {q.name}
              </Descriptions.Item>
              <Descriptions.Item label="Tổ chức cấp">
                {q.institution}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cấp">
                {formatDate(q.issue_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                {formatDate(q.expiry_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {q.description}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Space>
      ) : (
        <Empty description="Không có bằng cấp" />
      )}

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <button onClick={handleCancel} className="ant-btn">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetailStafProfile;
