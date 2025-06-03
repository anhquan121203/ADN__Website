import React from 'react';
import { Modal, Descriptions, Typography, Divider, Tag } from 'antd';
import moment from 'moment';

const { Text, Title } = Typography;

const ModalDetails = ({ visible, onCancel, slot }) => {
  if (!slot) return null;

  const statusColors = {
    available: 'success',
    booked: 'warning',
    unavailable: 'error'
  };

  const statusLabels = {
    available: 'Có sẵn',
    booked: 'Đã đặt',
    unavailable: 'Không khả dụng'
  };

  return (
    <Modal
      title="Chi tiết ca làm việc"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className="p-4">
        <Title level={4}>Nhân viên</Title>
        {slot.staff_profile_ids.map((staff) => (
          <div key={staff._id} className="mb-4">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ và tên" span={2}>
                {`${staff.user_id.first_name} ${staff.user_id.last_name}`}
              </Descriptions.Item>
              <Descriptions.Item label="ID Nhân Viên">
                {staff.employee_id}
              </Descriptions.Item>
              <Descriptions.Item label="Chức danh">
                {staff.job_title}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ))}

        <Divider />

        <Title level={4}>Time Slots</Title>
        {slot.time_slots.map((timeSlot) => (
          <div key={timeSlot._id} className="mb-4">
            <Descriptions bordered size="small">
              <Descriptions.Item label="Ngày" span={3}>
                {`${timeSlot.year}-${String(timeSlot.month).padStart(2, '0')}-${String(timeSlot.day).padStart(2, '0')}`}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian bắt đầu">
                {`${String(timeSlot.start_time.hour).padStart(2, '0')}:${String(timeSlot.start_time.minute).padStart(2, '0')}`}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian kết thúc">
                {`${String(timeSlot.end_time.hour).padStart(2, '0')}:${String(timeSlot.end_time.minute).padStart(2, '0')}`}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ))}

        <Divider />

        <Descriptions bordered>
          <Descriptions.Item label="Giới hạn cuộc hẹn" span={3}>
            {slot.appointment_limit}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={3}>
            <Tag color={statusColors[slot.status]}>
              {statusLabels[slot.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={3}>
            {moment(slot.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật" span={3}>
            {moment(slot.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ModalDetails;
