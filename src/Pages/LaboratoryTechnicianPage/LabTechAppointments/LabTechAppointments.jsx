import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip, Card, Tag, Typography, Modal, Row, Col } from 'antd';
import { EyeOutlined, FileSearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../../Hooks/useAppoinment';
import ModalAppointmentDetail from './ModalAppointmentDetail/ModalAppointmentDetail';

const { Title, Text } = Typography;

const LabTechAppointments = () => {
  const navigate = useNavigate();
  const { loading, getLabTechAssignedAppointments } = useAppointment();

  const [appointments, setAppointments] = useState([]);
  const [pageInfo, setPageInfo] = useState({ totalItems: 0 });
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (page = 1, pageSize = 15) => {
    try {
      const params = {
        pageNum: page,
        pageSize: pageSize,
        status: 'sample_received', // You can adjust this based on your requirements
        payment_status: 'paid', // Only fetch paid appointments
      };

      const result = await getLabTechAssignedAppointments(params);
      if (result.success) {
        // Extract data from the API response
        const responseData = result.data.data;
        setAppointments(responseData.pageData || []);
        setPageInfo(responseData.pageInfo || { totalItems: 0 });
        setPagination({
          current: page,
          pageSize: pageSize,
          total: responseData.pageInfo?.totalItems || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleTableChange = (paginationInfo) => {
    fetchAppointments(paginationInfo.current, paginationInfo.pageSize);
  };

  const handleViewDetail = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setModalDetailOpen(true);
  };

  const handleViewSamples = (appointmentId) => {
    navigate(`/laboratory_technician/appointments/${appointmentId}/samples`);
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

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">{record.user_id?.first_name} {record.user_id?.last_name}</div>
          <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '160px' }}>
            {record.user_id?.email}
          </div>
          <div className="text-xs text-gray-500">{record.user_id?.phone_number}</div>
        </div>
      ),
    },
    {
      title: 'Service',
      key: 'service',
      width: 160,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm truncate" style={{ maxWidth: '140px' }}>
            {record.service_id?.name}
          </div>
          <div className="text-xs text-gray-500">{record.service_id?.type}</div>
          <Tag color="green" size="small">{record.service_id?.price} VND</Tag>
        </div>
      ),
    },
    {
      title: 'Staff',
      key: 'staff',
      width: 140,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">{record.staff_id?.first_name} {record.staff_id?.last_name}</div>
          <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '120px' }}>
            {record.staff_id?.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Lab Tech',
      key: 'labTech',
      width: 140,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">{record.laboratory_technician_id?.first_name} {record.laboratory_technician_id?.last_name}</div>
          <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '120px' }}>
            {record.laboratory_technician_id?.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'appointment_date',
      key: 'appointmentDate',
      width: 120,
      render: (date) => (
        <div>
          <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <Tag color={type === 'facility' ? 'blue' : 'orange'} size="small">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} size="small">
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment_status',
      key: 'paymentStatus',
      width: 80,
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)} size="small">
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record._id)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="View Samples">
            <Button
              type="text"
              size="small"
              icon={<FileSearchOutlined />}
              onClick={() => handleViewSamples(record._id)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Title level={2} className="mb-0">
          My Assigned Appointments
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => fetchAppointments(pagination.current, pagination.pageSize)}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pageInfo.totalItems}
              </div>
              <div className="text-gray-500">Total Assignments</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'sample_received').length}
              </div>
              <div className="text-gray-500">Sample Received</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.payment_status === 'paid').length}
              </div>
              <div className="text-gray-500">Paid</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {appointments.filter(apt => apt.type === 'facility').length}
              </div>
              <div className="text-gray-500">Facility Type</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`,
            pageSizeOptions: ['10', '15', '20', '50'],
            responsive: true,
          }}
          onChange={handleTableChange}
          scroll={{ 
            x: 'max-content',
            scrollToFirstRowOnChange: true,
          }}
          size="small"
        />
      </Card>

      {/* Appointment Detail Modal */}
      <ModalAppointmentDetail
        open={modalDetailOpen}
        onClose={() => setModalDetailOpen(false)}
        appointmentId={selectedAppointmentId}
      />
    </div>
  );
};

export default LabTechAppointments;
