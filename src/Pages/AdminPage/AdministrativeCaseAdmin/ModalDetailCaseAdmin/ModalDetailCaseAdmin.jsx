import { Modal, Descriptions, Tag, Divider } from "antd";
import dayjs from "dayjs";

const ModalDetailCaseAdmin = ({ isModalOpen, handleCancel, selectedCase }) => {
  if (!selectedCase) return null;

  const {
    case_number,
    case_type,
    urgency,
    request_id,
    requesting_agency,
    agency_address,
    agency_contact_name,
    agency_contact_email,
    agency_contact_phone,
    court_order_number,
    authorization_code,
    authorization_date,
    legal_purpose,
    case_description,
    expected_participants,
    participants,
    documents,
    status,
    scheduled_at,
    completed_at,
    is_deleted,
    created_at,
    updated_at,
    agency_notes,
    internal_notes,
    created_by_user_id,
    assigned_staff_id,
  } = selectedCase || {};

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss") : "N/A";

  const renderCaseType = (case_type) => {
    switch (case_type) {
      case "paternity":
        return <Tag color="gold">Quan hệ cha con</Tag>; 
      case "maternity":
        return <Tag color="cyan">Quan hệ mẹ con</Tag>; 
      case "sibling":
        return <Tag color="green">Quan hệ anh chị em ruột</Tag>; 
      case "kinship":
        return <Tag color="blue">Quan hệ họ hàng</Tag>; 
      case "immigration":
        return <Tag color="purple">Nhập cư</Tag>; 
      case "inheritance":
        return <Tag color="volcano">Thừa kế</Tag>; 
      case "criminal_case":
        return <Tag color="red">Vụ án hình sự</Tag>; 
      case "civil_case":
        return <Tag color="orange">Vụ án dân sự</Tag>; 
      case "missing_person":
        return <Tag color="magenta">Người mất tích</Tag>; 
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="orange">Đang chờ</Tag>;
      case "approved":
        return <Tag color="blue">Đã duyệt</Tag>;
      case "completed":
        return <Tag color="green">Hoàn tất</Tag>;
      case "rejected":
        return <Tag color="red">Từ chối</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const renderRoleTag = (role) => {
    const colorMap = {
      admin: "blue",
      staff: "purple",
      manager: "gold",
      customer: "default",
    };
    return <Tag color={colorMap[role] || "default"}>{role}</Tag>;
  };

  return (
    <Modal
      title="Chi tiết hồ sơ"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <Descriptions
        bordered
        column={2}
        size="middle"
        labelStyle={{ width: "25%", fontWeight: 500 }}
        contentStyle={{ width: "75%" }}
      >
        <Descriptions.Item label="Mã hồ sơ">{case_number}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderStatus(status)}
        </Descriptions.Item>

        <Descriptions.Item label="Loại hồ sơ">
          {renderCaseType(case_type) || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Mức độ ưu tiên">
          {urgency || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Tên cơ quan yêu cầu">
          {requesting_agency || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ cơ quan">
          {agency_address || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Người liên hệ cơ quan">
          {agency_contact_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email cơ quan">
          {agency_contact_email}
        </Descriptions.Item>

        <Descriptions.Item label="SĐT cơ quan">
          {agency_contact_phone}
        </Descriptions.Item>
        <Descriptions.Item label="Mã quyết định của Tòa">
          {court_order_number || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Mã ủy quyền">
          {authorization_code || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày ủy quyền">
          {formatDate(authorization_date)}
        </Descriptions.Item>

        <Descriptions.Item label="Số người dự kiến">
          {expected_participants}
        </Descriptions.Item>
        <Descriptions.Item label="Pháp lý">{legal_purpose}</Descriptions.Item>

        <Descriptions.Item label="Mô tả vụ việc" span={2}>
          {case_description}
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú cơ quan" span={2}>
          {agency_notes || "Không có"}
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú nội bộ" span={2}>
          {internal_notes || "Không có"}
        </Descriptions.Item>

        <Descriptions.Item label="Lịch hẹn lấy mẫu">
          {formatDate(scheduled_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Hoàn tất lấy mẫu">
          {formatDate(completed_at)}
        </Descriptions.Item>

        <Descriptions.Item label="Người tạo hồ sơ" span={2}>
          {created_by_user_id?.first_name} {created_by_user_id?.last_name} (
          {created_by_user_id?.email}) {renderRoleTag(created_by_user_id?.role)}
        </Descriptions.Item>

        <Descriptions.Item label="Nhân viên xử lý" span={2}>
          {assigned_staff_id?.first_name} {assigned_staff_id?.last_name} (
          {assigned_staff_id?.email}) {renderRoleTag(assigned_staff_id?.role)}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {formatDate(created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật">
          {formatDate(updated_at)}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái xóa">
          {is_deleted ? (
            <Tag color="red">Đã xóa</Tag>
          ) : (
            <Tag color="green">Còn hiệu lực</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      {/* Danh sách người xét nghiệm============================================================== */}
      {participants?.length > 0 && (
        <>
         <Divider orientation="left">Danh sách người xét nghiệm</Divider>
          <Descriptions bordered column={1} size="middle">
            {participants.map((p, index) => (
              <Descriptions.Item
                key={p._id}
                label={`#${index + 1} - ${p.name}`}
              >
                <div>
                  <strong>Quan hệ:</strong> {p.relationship}
                </div>
                <div>
                  <strong>CMND/CCCD:</strong> {p.id_number}
                </div>
                <div>
                  <strong>Điện thoại:</strong> {p.phone}
                </div>
                <div>
                  <strong>Địa chỉ:</strong> {p.address}
                </div>
                <div>
                  <strong>Bắt buộc:</strong> {p.is_required ? "Có" : "Không"}
                </div>
                <div>
                  <strong>Đồng ý:</strong>{" "}
                  {p.consent_provided ? "Đã đồng ý" : "Chưa đồng ý"}
                </div>
                <div>
                  <strong>Đã lấy mẫu:</strong>{" "}
                  {p.sample_collected ? "Rồi" : "Chưa"}
                </div>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}

      {/* Tài liệu đính kèm============================================================== */}
      {documents?.length > 0 && (
        <>
        <Divider orientation="left">Danh sách tài liệu đính kèm</Divider>
          <Descriptions bordered column={1} size="middle">
            {documents.map((doc, index) => (
              <Descriptions.Item
                key={doc._id}
                label={`#${index + 1} - ${doc.name}`}
              >
                <div>
                  <strong>Loại:</strong> {doc.type}
                </div>
                <div>
                  <strong>Link:</strong>{" "}
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tải xuống
                  </a>
                </div>
                <div>
                  <strong>Xác thực:</strong>{" "}
                  {doc.verified ? "Đã xác thực" : "Chưa xác thực"}
                </div>
                <div>
                  <strong>Ngày tải lên:</strong> {formatDate(doc.uploaded_at)}
                </div>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <button onClick={handleCancel} className="ant-btn">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetailCaseAdmin;
