import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Tag, Card, message, Spin, Typography, 
  Row, Col, Statistic, Breadcrumb, Modal
} from 'antd';
import { 
  ArrowLeftOutlined, ExperimentOutlined, UserOutlined, 
  CalendarOutlined, FileTextOutlined, PlusOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import useSample from '../../../Hooks/useSample';
import useAppointment from '../../../Hooks/useAppoinment';
import CreateResultModal from './CreateResultModal/CreateResultModal';
import moment from 'moment';

const { Title, Text } = Typography;

const ViewSamples = () => {
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [createResultModalOpen, setCreateResultModalOpen] = useState(false);
  const [selectedSamples, setSelectedSamples] = useState([]);

  const { appointmentId } = useParams();
  const { getSamplesByAppointment } = useSample();
  const { getAppointmentDetail } = useAppointment();
  const navigate = useNavigate();

  // Fetch appointment details and samples
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch appointment details
      const appointmentResult = await getAppointmentDetail(appointmentId);
      if (appointmentResult.success) {
        setAppointment(appointmentResult.data);
      }
      // Fetch samples
      const samplesResult = await getSamplesByAppointment(appointmentId);
      if (samplesResult.success) {
        // Handle different possible data structures for samples
        let samplesData = [];
        if (Array.isArray(samplesResult.data)) {
          samplesData = samplesResult.data;
        } else if (samplesResult.data?.samples && Array.isArray(samplesResult.data.samples)) {
          samplesData = samplesResult.data.samples;
        } else if (samplesResult.data?.data && Array.isArray(samplesResult.data.data)) {
          samplesData = samplesResult.data.data;
        }
        
        setSamples(samplesData);
      } else {
        message.error(samplesResult.error || 'Failed to fetch samples');
      }
    } catch (error) {
      message.error('Error fetching data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchData();
    }
  }, [appointmentId]);

  const handleBack = () => {
    navigate('/laboratory_technician/results');
  };

  const handleCreateResult = (samples) => {
    setSelectedSamples(samples);
    setCreateResultModalOpen(true);
  };

  const handleCreateResultSuccess = () => {
    setCreateResultModalOpen(false);
    setSelectedSamples([]);
    fetchData(); // Refresh data
    message.success('Test result created successfully!');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'orange';
      case 'collected': return 'blue';
      case 'received': return 'green';
      case 'processing': return 'purple';
      case 'testing': return 'cyan';
      case 'completed': return 'success';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'blood': return 'red';
      case 'saliva': return 'blue';
      case 'hair': return 'green';
      case 'tissue': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Sample ID',
      dataIndex: '_id',
      key: '_id',
      width: 120,
      fixed: 'left',
      render: (id) => (
        <code className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
          {id?.slice(-8)}
        </code>
      ),
    },
    {
      title: 'Kit Code',
      key: 'kit',
      width: 110,
      render: (_, record) => (
        <Tag color="cyan" className="font-mono text-xs font-medium">
          {record.kit_id?.code || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (type) => (
        <Tag color={getTypeColor(type)} className="text-xs font-medium">
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Person Info',
      key: 'person',
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="font-semibold flex items-center text-sm text-gray-800">
            <UserOutlined className="mr-1 text-blue-500" />
            {record.person_info?.name || 'N/A'}
          </div>
          <div className="text-gray-500 text-xs">
            {record.person_info?.relationship || 'N/A'}
          </div>
          <div className="text-gray-500 text-xs">
            Age: {record.person_info?.age || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="text-xs font-medium px-2 py-1">
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Collection',
      dataIndex: 'collection_date',
      key: 'collection_date',
      width: 120,
      render: (date) => (
        date ? (
          <div className="space-y-1">
            <CalendarOutlined className="mr-1 text-blue-500" />
            <div className="text-sm font-medium text-gray-800">
              {moment(date).format('DD/MM/YYYY')}
            </div>
          </div>
        ) : (
          <Text type="secondary" className="text-xs">Not collected</Text>
        )
      ),
    },
    {
      title: 'Received',
      dataIndex: 'received_date',
      key: 'received_date',
      width: 120,
      render: (date) => (
        date ? (
          <div className="space-y-1">
            <CalendarOutlined className="mr-1 text-green-500" />
            <div className="text-sm font-medium text-gray-800">
              {moment(date).format('DD/MM/YYYY')}
            </div>
          </div>
        ) : (
          <Text type="secondary" className="text-xs">Not received</Text>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <div>
          {(record.status === 'testing' || record.status === 'processing') && (
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleCreateResult([record])}
              className="bg-green-500 hover:bg-green-600 border-green-500 text-xs"
            >
              Create Result
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filter samples that can have results created
  // Ensure samples is always an array before filtering
  const samplesArray = Array.isArray(samples) ? samples : [];
  const testingSamples = samplesArray.filter(
    sample => sample.status === 'testing' || sample.status === 'processing'
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 max-w-[1250px] mx-auto min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6 bg-white px-4 py-2 rounded-lg shadow-sm">
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-600 px-0"
          >
            Manage Results
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="text-gray-500">View Samples</Breadcrumb.Item>
        <Breadcrumb.Item className="text-gray-700 font-medium">
          {appointmentId?.slice(-8)}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card className="shadow-sm border-0">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          <div>
            <Title level={3} className="mb-2 text-gray-800">
              <ExperimentOutlined className="mr-2 text-purple-600" />
              Sample Details
            </Title>
            <p className="text-gray-600 text-sm md:text-base">
              View and manage samples for appointment: 
              <code className="ml-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-mono">
                {appointmentId?.slice(-8)}
              </code>
            </p>
          </div>
          {testingSamples.length > 0 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => handleCreateResult(testingSamples)}
              className="mt-4 lg:mt-0 w-full lg:w-auto bg-green-500 hover:bg-green-600 border-green-500"
            >
              <span className="hidden md:inline">Create Results for All Testing Samples</span>
              <span className="md:hidden">Create All Results</span>
            </Button>
          )}
        </div>

        {/* Appointment Info */}
        {appointment && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Customer"
                  value={appointment.user_id?.first_name + ' ' + appointment.user_id?.last_name || 'N/A'}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff', fontSize: '16px', fontWeight: 'bold' }}
                />
                <div className="text-sm text-gray-600 mt-1">
                  {appointment.user_id?.email || 'No email'}
                </div>
                <div className="text-sm text-gray-600">
                  {appointment.user_id?.phone_number || 'No phone'}
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Service"
                  value={appointment.service_id?.name || 'N/A'}
                  prefix={<ExperimentOutlined />}
                  valueStyle={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}
                />
                <div className="text-sm text-gray-600 mt-1">
                  ${appointment.service_id?.price || '0'}
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Appointment Date"
                  value={moment(appointment.appointment_date).format('DD/MM/YYYY HH:mm')}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#722ed1', fontSize: '16px', fontWeight: 'bold' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Status"
                  value={appointment.status?.toUpperCase() || 'N/A'}
                  valueStyle={{ 
                    color: appointment.status === 'testing' ? '#1890ff' : '#52c41a',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                />
                <div className="text-sm text-gray-600 mt-1">
                  Payment: {appointment.payment_status?.toUpperCase() || 'N/A'}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Sample Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{samplesArray.length}</div>
              <div className="text-gray-700 text-sm font-medium">Total Samples</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="text-2xl md:text-3xl font-bold text-cyan-600">
                {samplesArray.filter(s => s.status === 'testing').length}
              </div>
              <div className="text-gray-700 text-sm font-medium">Testing</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-2xl md:text-3xl font-bold text-green-600">
                {samplesArray.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-gray-700 text-sm font-medium">Completed</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {testingSamples.length}
              </div>
              <div className="text-gray-700 text-sm font-medium">Ready for Results</div>
            </Card>
          </Col>
        </Row>

        {/* Samples Table */}
        <Spin spinning={loading}>
          {samplesArray.length === 0 && !loading ? (
            <Card className="text-center py-12 border-dashed border-2 border-gray-200">
              <div className="text-gray-400 mb-2">
                <ExperimentOutlined style={{ fontSize: '48px' }} />
              </div>
              <p className="text-gray-500 text-lg">No samples found</p>
              <p className="text-gray-400 text-sm">No samples available for this appointment</p>
            </Card>
          ) : (
            <Card className="shadow-sm border-0">
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={samplesArray}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} samples`,
                    responsive: true,
                    className: "custom-pagination",
                  }}
                  scroll={{ x: 1000, y: 500 }}
                  size="middle"
                  className="min-w-full custom-table"
                  rowClassName="hover:bg-blue-50 transition-colors duration-200"
                />
              </div>
            </Card>
          )}
        </Spin>

        {/* Create Result Modal */}
        <CreateResultModal
          open={createResultModalOpen}
          onClose={() => setCreateResultModalOpen(false)}
          onSuccess={handleCreateResultSuccess}
          samples={selectedSamples}
          appointmentId={appointmentId}
        />
      </Card>
    </div>
  );
};

export default ViewSamples;
