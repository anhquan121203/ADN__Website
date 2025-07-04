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
        message.error('Failed to load appointment details');
      }
    } catch (error) {
      message.error('Error loading appointment details');
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
        title="Appointment Details"
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
          <Title level={4} className="mb-0">Appointment Details</Title>
          <Tag color="blue">{appointment._id?.slice(-8)}</Tag>
        </div>
      }
      width={1000}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Basic Appointment Information */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <span>Appointment Information</span>
            </div>
          } 
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text type="secondary">Appointment ID:</Text>
              <div><Text code>{appointment._id}</Text></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Type:</Text>
              <div><Tag color={appointment.type === 'facility' ? 'blue' : 'orange'}>{appointment.type.toUpperCase()}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Collection Address:</Text>
              <div>{appointment.collection_address || 'N/A'}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Appointment Date:</Text>
              <div>{new Date(appointment.appointment_date).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Status:</Text>
              <div><Tag color={getStatusColor(appointment.status)}>{appointment.status.toUpperCase()}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Payment Status:</Text>
              <div><Tag color={getPaymentStatusColor(appointment.payment_status)}>{appointment.payment_status?.toUpperCase() || 'UNKNOWN'}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Created:</Text>
              <div>{new Date(appointment.created_at).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Last Updated:</Text>
              <div>{new Date(appointment.updated_at).toLocaleString()}</div>
            </Col>
          </Row>
        </Card>

        {/* Customer Information */}
        {appointment.user_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Customer Information</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Customer ID:</Text>
                <div><Text code>{appointment.user_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Full Name:</Text>
                <div><strong>{appointment.user_id.first_name} {appointment.user_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.user_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Phone Number:</Text>
                <div>{appointment.user_id.phone_number}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Service Information */}
        {appointment.service_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <ToolOutlined />
                <span>Service Information</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Service Name:</Text>
                <div><strong>{appointment.service_id.name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Price:</Text>
                <div><Tag color="green">${appointment.service_id.price}</Tag></div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Slot Information */}
        {appointment.slot_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Time Slot Information</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Slot ID:</Text>
                <div><Text code>{appointment.slot_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Status:</Text>
                <div><Tag color="blue">{appointment.slot_id.status}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Appointment Limit:</Text>
                <div>{appointment.slot_id.appointment_limit}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Assigned Count:</Text>
                <div>{appointment.slot_id.assigned_count}</div>
              </Col>
              <Col span={16}>
                <Text type="secondary">Time Slots:</Text>
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

        {/* Staff Information */}
        {appointment.staff_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Assigned Staff Information</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Staff ID:</Text>
                <div><Text code>{appointment.staff_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Staff Name:</Text>
                <div><strong>{appointment.staff_id.first_name} {appointment.staff_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.staff_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Phone Number:</Text>
                <div>{appointment.staff_id.phone_number}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Laboratory Technician Information */}
        {appointment.laboratory_technician_id && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Laboratory Technician Information</span>
              </div>
            } 
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Lab Tech ID:</Text>
                <div><Text code>{appointment.laboratory_technician_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Lab Tech Name:</Text>
                <div><strong>{appointment.laboratory_technician_id.first_name} {appointment.laboratory_technician_id.last_name}</strong></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Email:</Text>
                <div>{appointment.laboratory_technician_id.email}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Phone Number:</Text>
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
