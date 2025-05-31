import { Button, Descriptions, Form, Modal, Tag } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import "./ModalDetailSlot.css";

const ModalDetailSlot = ({ isModalOpen, handleCancel, selectedSlot }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedSlot) {
      form.setFieldsValue(selectedSlot);
    }
  }, [selectedSlot, form]);

  const renderStaffDetails = () => {
    if (!selectedSlot?.staff_profile_ids?.length) return "N/A";

    return selectedSlot.staff_profile_ids.map((staff, index) => {
      const name = `${staff.user_id?.first_name ?? ""} ${
        staff.user_id?.last_name ?? ""
      }`.trim();
      return (
        <div key={staff._id || index} className="staff-info">
          <div className="staff-title">
            Nhân viên {index + 1}: {name || "N/A"}
          </div>
          <div>Mã NV: {staff.employee_id ?? "N/A"}</div>
          <div>Chức vụ: {staff.job_title ?? "N/A"}</div>
        </div>
      );
    });
  };

  const renderTimeSlot = () => {
    const ts = selectedSlot?.time_slots?.[0];
    if (!ts) return "N/A";

    const dateStr = `${ts.day}/${ts.month}/${ts.year}`;
    const start = `${ts.start_time.hour
      .toString()
      .padStart(2, "0")}:${ts.start_time.minute.toString().padStart(2, "0")}`;
    const end = `${ts.end_time.hour
      .toString()
      .padStart(2, "0")}:${ts.end_time.minute.toString().padStart(2, "0")}`;

    return `${dateStr} (${start} - ${end})`;
  };

    const renderStatus = (status) => {
  switch (status) {
    case "available":
      return <Tag color="green">Còn trống</Tag>;
    case "booked":
      return <Tag color="red">Đã đặt</Tag>;
    case "unavailable":
      return <Tag color="pink">Không còn trống</Tag>;
    default:
      return <Tag>N/A</Tag>;
  }
};



  return (
    <Modal
      title="Chi tiết Slot"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
      className="modal-detail-slot"
      width={900}
    >
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Thông tin nhân viên" span={2}>
          {renderStaffDetails()}
        </Descriptions.Item>

        <Descriptions.Item label="Giới hạn cuộc hẹn">
          {selectedSlot?.appointment_limit ?? "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian">
          <div className="time-slot">{renderTimeSlot()}</div>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {selectedSlot?.created_at
            ? dayjs(selectedSlot.created_at).format("DD/MM/YYYY HH:mm")
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày cập nhật">
          {selectedSlot?.updated_at
            ? dayjs(selectedSlot.updated_at).format("DD/MM/YYYY HH:mm")
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          {renderStatus(selectedSlot?.status)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalDetailSlot;
