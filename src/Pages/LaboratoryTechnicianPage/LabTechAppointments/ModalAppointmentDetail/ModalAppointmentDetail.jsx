import React, { useEffect, useState } from 'react';
import { Modal, Card, Tag, Typography, Row, Col, Spin, message, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';
import { useAppointment } from '../../../../Hooks/useAppoinment';

const { Title, Text } = Typography;

const ModalAppointmentDetail = ({ open, onClose, appointmentId }) => {
  const { getAppointmentDetail, selectedAppointment, loading } = useAppointment();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (open && appointmentId) {
      fetchAppointmentDetail();
    }
  }, [open, appointmentId]);

  const fetchAppointmentDetail = async () => {
    setLocalLoading(true);
    try {
      const result = await getAppointmentDetail(appointmentId);
      if (!result.success) {
        message.error('Không thể tải chi tiết cuộc hẹn');
      }
    } catch (error) {
      message.error('Lỗi khi tải chi tiết cuộc hẹn');
    } finally {
      setLocalLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'blue';
      case 'sample_collected': return 'orange';
      case 'sample_received': return 'green';
      case 'processing': return 'purple';
      case 'completed': return 'success';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'unpaid': return 'orange';
      case 'refunded': return 'blue';
      default: return 'default';
    }
  };

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return 'N/A';
    const { year, month, day, start_time, end_time } = timeSlot;
    const date = `${day}/${month}/${year}`;
    const startTime = `${String(start_time.hour).padStart(2, '0')}:${String(start_time.minute).padStart(2, '0')}`;
    const endTime = `${String(end_time.hour).padStart(2, '0')}:${String(end_time.minute).padStart(2, '0')}`;
    return `${date} (${startTime} - ${endTime})`;
  };

  if (!selectedAppointment && (loading || localLoading)) {
    return (
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="Chi tiết cuộc hẹn"
        width={900}
      >
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (!selectedAppointment) {
    return null;
  }

  const appointment = selectedAppointment;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <Title level={4} className="mb-0">Chi tiết cuộc hẹn</Title>
          <Tag color="blue">{appointment._id?.slice(-8)}</Tag>
        </div>
      }
      width={1000}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Thông tin cơ bản cuộc hẹn */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <span>Thông tin cuộc hẹn</span>
            </div>
          } 
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text type="secondary">Mã cuộc hẹn:</Text>
              <div><Text code>{appointment._id}</Text></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Loại:</Text>
              <div><Tag color={appointment.type === 'facility' ? 'blue' : 'orange'}>{appointment.type === 'facility' ? 'Tại cơ sở' : 'Tại nhà'}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Địa chỉ lấy mẫu:</Text>
              <div>{appointment.collection_address || 'Không có'}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Ngày hẹn:</Text>
              <div>{new Date(appointment.appointment_date).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Trạng thái:</Text>
              <div><Tag color={getStatusColor(appointment.status)}>{(() => {
                switch (appointment.status) {
                  case 'confirmed': return 'Đã xác nhận';
                  case 'sample_collected': return 'Đã thu mẫu';
                  case 'sample_received': return 'Đã nhận mẫu';
                  case 'processing': return 'Đang xử lý';
                  case 'completed': return 'Hoàn thành';
                  case 'cancelled': return 'Đã hủy';
                  default: return appointment.status;
                }
              })()}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Thanh toán:</Text>
              <div><Tag color={getPaymentStatusColor(appointment.payment_status)}>{appointment.payment_status === 'paid' ? 'Đã thanh toán' : appointment.payment_status === 'unpaid' ? 'Chưa thanh toán' : appointment.payment_status === 'refunded' ? 'Đã hoàn tiền' : 'Không rõ'}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Ngày tạo:</Text>
              <div>{new Date(appointment.created_at).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Cập nhật lần cuối:</Text>
              <div>{new Date(appointment.updated_at).toLocaleString()}</div>
            </Col>
          </Row>
        </Card>

        {/* Thông tin khách hàng */}
        {appointment.user_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Thông tin khách hàng</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã khách hàng:</Text>
                <div><Text code>{appointment.user_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Họ tên:</Text>
                <div><strong>{appointment.user_id.first_name} {appointment.user_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.user_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Số điện thoại:</Text>
                <div>{appointment.user_id.phone_number}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Thông tin dịch vụ */}
        {appointment.service_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <ToolOutlined />
                <span>Thông tin dịch vụ</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Tên dịch vụ:</Text>
                <div><strong>{appointment.service_id.name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Giá:</Text>
                <div><Tag color="green">{appointment.service_id.price} VND</Tag></div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Thông tin ca */}
        {appointment.slot_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Thông tin ca hẹn</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã ca:</Text>
                <div><Text code>{appointment.slot_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Trạng thái:</Text>
                <div><Tag color="blue">{appointment.slot_id.status}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Giới hạn số lượng:</Text>
                <div>{appointment.slot_id.appointment_limit}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Số lượng đã phân công:</Text>
                <div>{appointment.slot_id.assigned_count}</div>
              </Col>
              <Col span={16}>
                <Text type="secondary">Khung giờ:</Text>
                <div>
                  {appointment.slot_id.time_slots?.map((timeSlot, index) => (
                    <Tag key={index} color="purple">
                      {formatTimeSlot(timeSlot)}
                    </Tag>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Thông tin nhân viên */}
        {appointment.staff_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Thông tin nhân viên được phân công</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã nhân viên:</Text>
                <div><Text code>{appointment.staff_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Tên nhân viên:</Text>
                <div><strong>{appointment.staff_id.first_name} {appointment.staff_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.staff_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Số điện thoại:</Text>
                <div>{appointment.staff_id.phone_number}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Thông tin kỹ thuật viên */}
        {appointment.laboratory_technician_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Thông tin kỹ thuật viên xét nghiệm</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã KTV:</Text>
                <div><Text code>{appointment.laboratory_technician_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Tên KTV:</Text>
                <div><strong>{appointment.laboratory_technician_id.first_name} {appointment.laboratory_technician_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.laboratory_technician_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Số điện thoại:</Text>
                <div>{appointment.laboratory_technician_id.phone_number}</div>
              </Col>
            </Row>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default ModalAppointmentDetail;
