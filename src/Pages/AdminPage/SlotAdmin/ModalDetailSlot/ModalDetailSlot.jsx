import {
  Button,
  Form,
  Modal,
  Typography,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

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
      const name = `${staff.user_id?.first_name ?? ""} ${staff.user_id?.last_name ?? ""}`.trim();
      return (
        <div key={staff._id || index} style={{ marginBottom: 8 }}>
          <Typography.Text strong>Nhân viên {index + 1}: {name}</Typography.Text>
          <div> Mã NV: {staff.employee_id ?? "N/A"}</div>
          <div> Chức vụ: {staff.job_title ?? "N/A"}</div>
        </div>
      );
    });
  };

  const renderTimeSlot = () => {
    const ts = selectedSlot?.time_slots?.[0];
    if (!ts) return "N/A";

    const dateStr = `${ts.day}/${ts.month}/${ts.year}`;
    const start = `${ts.start_time.hour.toString().padStart(2, "0")}:${ts.start_time.minute.toString().padStart(2, "0")}`;
    const end = `${ts.end_time.hour.toString().padStart(2, "0")}:${ts.end_time.minute.toString().padStart(2, "0")}`;

    return `${dateStr} (${start} - ${end})`;
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
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Thông tin nhân viên">
          {renderStaffDetails()}
        </Form.Item>

        <Form.Item label="Giới hạn cuộc hẹn">
          <Typography.Text>{selectedSlot?.appointment_limit ?? "N/A"}</Typography.Text>
        </Form.Item>

        <Form.Item label="Thời gian">
          <Typography.Text>{renderTimeSlot()}</Typography.Text>
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Typography.Text>
            {selectedSlot?.status === "available" ? "Có sẵn" : "Đã đặt"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Ngày tạo">
          <Typography.Text>
            {selectedSlot?.created_at
              ? dayjs(selectedSlot.created_at).format("DD/MM/YYYY HH:mm")
              : "N/A"}
          </Typography.Text>
        </Form.Item>

        <Form.Item label="Cập nhật lần cuối">
          <Typography.Text>
            {selectedSlot?.updated_at
              ? dayjs(selectedSlot.updated_at).format("DD/MM/YYYY HH:mm")
              : "N/A"}
          </Typography.Text>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailSlot;
