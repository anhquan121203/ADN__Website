// src/Pages/Appointment/AppointmentViewDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Button, Tag, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { Table } from 'antd';
import AssignLabTech from './AssignLabTech';

const AppointmentViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAppointmentDetail, getStaffSlots, confirmAppointmentSlot } = useAppointment();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [showAssignLabTech, setShowAssignLabTech] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await getAppointmentDetail(id);
      if (res.success) {
        setDetail(res.data.data);
      } else {
        message.error('Không thể tải chi tiết cuộc hẹn');
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString('vi-VN') : '';

  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsLoading(true);
      const res = await getStaffSlots();
      if (res.success) {
        setSlots(res.data.data || []);
      }
      setSlotsLoading(false);
    };
    fetchSlots();
  }, [id]);

  const handleConfirm = (slotId) => {
  setSelectedSlotId(slotId);
  setConfirmVisible(true);
};

const isSlotAssigned = (slotId) => {
  return detail?.slot_id?._id === slotId;
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} className="mb-4">
        Quay lại
      </Button>

      <Card title="Chi tiết cuộc hẹn">
        {loading ? (
          <Spin />
        ) : detail ? (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Khách hàng">
              {detail.user_id?.first_name} {detail.user_id?.last_name}
              <br />
              {detail.user_id?.email} - {detail.user_id?.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color="blue">{detail.status}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày hẹn">
              {formatDate(detail.appointment_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(detail.created_at)}
            </Descriptions.Item>

            <Descriptions.Item label="Loại hình">
              {detail.type === 'home' ? 'Tại nhà' : detail.type === 'facility' ? 'Tại phòng khám' : 'Tự lấy mẫu'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {detail.payment_status === 'paid' ? (
                <Tag color="green">Đã thanh toán</Tag>
              ) : (
                <Tag color="red">Chưa thanh toán</Tag>
              )}
            </Descriptions.Item>

            {detail.collection_address && (
              <Descriptions.Item label="Địa chỉ lấy mẫu" span={2}>
                {detail.collection_address}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Dịch vụ" span={2}>
              {detail.service_id?.name} – {detail.service_id?.price.toLocaleString()} VNĐ
            </Descriptions.Item>

            {detail.staff_id && (
              <Descriptions.Item label="Nhân viên phụ trách" span={2}>
                {detail.staff_id.first_name} {detail.staff_id.last_name} – {detail.staff_id.email}
              </Descriptions.Item>
            )}
            {detail.laboratory_technician_id && (
                <Descriptions.Item label="Kỹ thuật viên xét nghiệm" span={2}>
                    {detail.laboratory_technician_id.first_name} {detail.laboratory_technician_id.last_name} – {detail.laboratory_technician_id.email}
                </Descriptions.Item>
            )}
            {detail.slot_id && (
              <Descriptions.Item label="Khung giờ" span={2}>
                {detail.slot_id.time_slots?.map((slot) => (
                  <div key={slot._id}>
                    {slot.day}/{slot.month }/{slot.year} – {slot.start_time.hour}h
                    {slot.start_time.minute.toString().padStart(2, '0')} đến {slot.end_time.hour}h
                    {slot.end_time.minute.toString().padStart(2, '0')}
                  </div>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <p>Không tìm thấy dữ liệu.</p>
        )}
      </Card>
      <Card title="Danh sách khung giờ" className="mt-6">
        <Table
          dataSource={slots}
          loading={slotsLoading}
          rowKey="_id"
          columns={[
            {
              title: 'Ngày',
              dataIndex: 'time_slots',
              key: 'date',
              render: (time_slots) =>
                time_slots && time_slots.length > 0
                  ? `${time_slots[0].day}/${time_slots[0].month}/${time_slots[0].year}`
                  : '',
            },
            {
              title: 'Khung giờ',
              dataIndex: 'time_slots',
              key: 'slot',
              render: (time_slots) =>
                time_slots && time_slots.length > 0
                  ? `${time_slots[0].start_time.hour}h${time_slots[0].start_time.minute
                      .toString()
                      .padStart(2, '0')} - ${time_slots[0].end_time.hour}h${time_slots[0].end_time.minute
                      .toString()
                      .padStart(2, '0')}`
                  : '',
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                isSlotAssigned(record._id) ? (
  <Tag color="green">Đã apply</Tag>
) : (
  <Button type="primary" onClick={() => handleConfirm(record._id)}>
    Confirm
  </Button>
)
              )
            },
          ]}
        />
      </Card>

      <Modal
  title="Xác nhận khung giờ"
  open={confirmVisible}
  onCancel={() => setConfirmVisible(false)}
  onOk={async () => {
    const res = await confirmAppointmentSlot(id, selectedSlotId);
    if (res.success) {
      message.success('Đã xác nhận khung giờ!');
      setConfirmVisible(false);
      // Gợi ý: reload lại chi tiết nếu cần
      const updated = await getAppointmentDetail(id);
      if (updated.success) {
        setDetail(updated.data.data);
      }
    } else {
      message.error('Xác nhận thất bại');
    }
  }}
  okText="Xác nhận"
  cancelText="Hủy"
  centered
>
  Bạn có chắc chắn muốn xác nhận cuộc hẹn với khung giờ này?
</Modal>

      <Button
        type="dashed"
        className="mt-4"
        onClick={() => setShowAssignLabTech((prev) => !prev)}
      >
        {showAssignLabTech ? 'Hide Lab Technician Assignment' : 'Assign Lab Technician'}
      </Button>
      {showAssignLabTech && (
        <Card
          title="Assign Laboratory Technician"
          className="mt-4"
          bordered
        >
          <AssignLabTech
            appointmentId={id}
            assignedLabTechId={detail?.laboratory_technician_id?._id}
            onAssigned={ async () => {
            const updated = await getAppointmentDetail(id);
            if (updated.success) {
            setDetail(updated.data.data);
            }
              setShowAssignLabTech(false);
            }}
          />
        </Card>
      )}
  </div>
  );
};

export default AppointmentViewDetail;
