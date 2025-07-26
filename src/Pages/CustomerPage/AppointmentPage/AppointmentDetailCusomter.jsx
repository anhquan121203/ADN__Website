import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Spin, Button, Timeline, Avatar, Row, Col, Divider } from "antd";
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, HomeOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useAppointment } from "../../../Hooks/useAppoinment";

const AppointmentDetailCustomer = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getAppointmentDetail } = useAppointment();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      try {
        setLoading(true);
        const result = await getAppointmentDetail(appointmentId);
        if (result.success) {
          setAppointment(result.data.data);
        }
      } catch (error) {
        console.error("Error fetching appointment detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetail();
    }
  }, [appointmentId]);

  const translateStatus = (status) => {
    const statusMap = {
      pending: { text: "Đang chờ", color: "orange" },
      confirmed: { text: "Đã xác nhận", color: "blue" },
      in_progress: { text: "Đang thực hiện", color: "processing" },
      completed: { text: "Hoàn thành", color: "green" },
      cancelled: { text: "Đã hủy", color: "red" }
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  const translatePaymentStatus = (status) => {
    const statusMap = {
      pending: { text: "Chưa thanh toán", color: "orange" },
      partial: { text: "Thanh toán một phần", color: "blue" },
      paid: { text: "Đã thanh toán", color: "green" }
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  const translateType = (type) => {
    const typeMap = {
      facility: "Tại cơ sở",
      home: "Tại nhà",
      self: "Tự lấy mẫu"
    };
    return typeMap[type] || type;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getSlotTimeInfo = (slot) => {
    if (!slot?.time_slots?.[0]) return "--";
    const timeSlot = slot.time_slots[0];
    return `${timeSlot.day}/${timeSlot.month}/${timeSlot.year} (${timeSlot.start_time.hour}:${String(timeSlot.start_time.minute).padStart(2, '0')} - ${timeSlot.end_time.hour}:${String(timeSlot.end_time.minute).padStart(2, '0')})`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center p-8">
        <h3>Không tìm thấy thông tin lịch hẹn</h3>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  const status = translateStatus(appointment.status);
  const paymentStatus = translatePaymentStatus(appointment.payment_status);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết lịch hẹn</h1>
        <p className="text-gray-600">Mã lịch hẹn: {appointment._id}</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Main Information */}
        <Col xs={24} lg={16}>
          {/* Service Information */}
          <Card title="Thông tin dịch vụ" className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                {appointment.service_id?.image_url && (
                  <img 
                    src={appointment.service_id.image_url} 
                    alt="Service" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </Col>
              <Col xs={24} sm={16}>
                <h3 className="text-lg font-semibold mb-2">{appointment.service_id?.name}</h3>
                <p className="text-gray-600 mb-2">Giá: {appointment.service_id?.price?.toLocaleString()} đ</p>
                <p className="text-gray-600">Loại: {translateType(appointment.type)}</p>
              </Col>
            </Row>
          </Card>

          {/* Appointment Details */}
          <Card title="Chi tiết lịch hẹn" className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="mb-3">
                  <CalendarOutlined className="mr-2 text-blue-500" />
                  <strong>Ngày hẹn:</strong> {formatDateTime(appointment.appointment_date)}
                </div>
                <div className="mb-3">
                  <CalendarOutlined className="mr-2 text-blue-500" />
                  <strong>Khung giờ:</strong> {getSlotTimeInfo(appointment.slot_id)}
                </div>
                <div className="mb-3">
                  <strong>Trạng thái:</strong> 
                  <Tag color={status.color} className="ml-2">{status.text}</Tag>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                {appointment.type === 'home' && (
                  <div className="mb-3">
                    <HomeOutlined className="mr-2 text-green-500" />
                    <strong>Địa chỉ lấy mẫu:</strong> {appointment.collection_address}
                  </div>
                )}
                <div className="mb-3">
                  <strong>Thanh toán:</strong> 
                  <Tag color={paymentStatus.color} className="ml-2">{paymentStatus.text}</Tag>
                </div>
                <div className="mb-3">
                  <strong>Ngày tạo:</strong> {formatDateTime(appointment.created_at)}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Payment Information */}
          <Card title="Thông tin thanh toán" className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tổng tiền</div>
                  <div className="text-xl font-bold text-blue-600">
                    {appointment.total_amount?.toLocaleString()} đ
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tiền cọc</div>
                  <div className="text-xl font-bold text-orange-600">
                    {appointment.deposit_amount?.toLocaleString()} đ
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Đã thanh toán</div>
                  <div className="text-xl font-bold text-green-600">
                    {appointment.amount_paid?.toLocaleString()} đ
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Staff and User Information */}
        <Col xs={24} lg={8}>
          {/* User Information */}
          <Card title="Thông tin khách hàng" className="mb-6">
            <div className="text-center mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="mb-2" />
              <h4 className="font-semibold">
                {appointment.user_id?.first_name} {appointment.user_id?.last_name}
              </h4>
            </div>
            <div className="space-y-2">
              <div>
                <MailOutlined className="mr-2 text-blue-500" />
                {appointment.user_id?.email}
              </div>
              <div>
                <PhoneOutlined className="mr-2 text-green-500" />
                {appointment.user_id?.phone_number}
              </div>
            </div>
          </Card>

          {/* Staff Information */}
          {appointment.staff_id && (
            <Card title="Nhân viên phụ trách" className="mb-6">
              <div className="text-center mb-4">
                <Avatar size={48} icon={<UserOutlined />} className="mb-2" />
                <h5 className="font-semibold">
                  {appointment.staff_id.first_name} {appointment.staff_id.last_name}
                </h5>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <MailOutlined className="mr-2 text-blue-500" />
                  {appointment.staff_id.email}
                </div>
                <div>
                  <PhoneOutlined className="mr-2 text-green-500" />
                  {appointment.staff_id.phone_number}
                </div>
              </div>
            </Card>
          )}

          {/* Lab Technician Information */}
          {appointment.laboratory_technician_id && (
            <Card title="Kỹ thuật viên xét nghiệm" className="mb-6">
              <div className="text-center mb-4">
                <Avatar size={48} icon={<UserOutlined />} className="mb-2" />
                <h5 className="font-semibold">
                  {appointment.laboratory_technician_id.first_name} {appointment.laboratory_technician_id.last_name}
                </h5>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <MailOutlined className="mr-2 text-blue-500" />
                  {appointment.laboratory_technician_id.email}
                </div>
                <div>
                  <PhoneOutlined className="mr-2 text-green-500" />
                  {appointment.laboratory_technician_id.phone_number}
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Notes and Check-in Logs */}
      {(appointment.notes?.length > 0 || appointment.checkin_logs?.length > 0) && (
        <Row gutter={[24, 24]}>
          {/* Notes */}
          {appointment.notes?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card title="Ghi chú">
                <div className="space-y-2">
                  {appointment.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      {note}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          )}

          {/* Check-in Logs */}
          {appointment.checkin_logs?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card title="Lịch sử check-in">
                <Timeline>
                  {appointment.checkin_logs.map((log, index) => (
                    <Timeline.Item key={index}>
                      <div className="mb-1">
                        <strong>{formatDateTime(log.time)}</strong>
                      </div>
                      <div className="text-gray-600 mb-1">
                        Nhân viên: {log.staff_id}
                      </div>
                      <div className="text-sm">{log.note}</div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default AppointmentDetailCustomer;
