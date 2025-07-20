import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Tag, Card, message, Spin, Typography, 
  Row, Col, Statistic, Breadcrumb, Modal, Divider, Badge, Avatar
} from 'antd';
import { 
  ArrowLeftOutlined, ExperimentOutlined, UserOutlined, 
  CalendarOutlined, FileTextOutlined, PlusOutlined, EyeOutlined,
  DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined,
  InfoCircleOutlined, PercentageOutlined, SafetyOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import useSample from '../../../Hooks/useSample';
import useAppointment from '../../../Hooks/useAppoinment';
import useResult from '../../../Hooks/useResult';
import CreateResultModal from './CreateResultModal/CreateResultModal';
import moment from 'moment';

const { Title, Text } = Typography;

const ViewSamples = () => {
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);
  const [appointment, setAppointment] = useState({});
  const [createResultModalOpen, setCreateResultModalOpen] = useState(false);
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [resultViewModalOpen, setResultViewModalOpen] = useState(false);

  const { appointmentId } = useParams();
  const { getSamplesByAppointment } = useSample();
  const { getAppointmentDetail } = useAppointment();
  const { getResultByAppointment, currentResult, resultLoading, resetCurrentResultState } = useResult();
  const navigate = useNavigate();

  // Fetch appointment details, samples, and result
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch appointment details
      const appointmentResult = await getAppointmentDetail(appointmentId);
      if (appointmentResult.success) {
        // Handle nested response structure
        let appointmentData = appointmentResult.data;
        if (appointmentResult.data?.data) {
          appointmentData = appointmentResult.data.data;
        }
        setAppointment(appointmentData);
        
        // Fetch test result if appointment is completed
        if (appointmentData?.status === 'completed') {
          await getResultByAppointment(appointmentId);
        }
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
  console.log('Fetching data...', appointment);
  useEffect(() => {
    if (appointmentId) {
      fetchData();
      
      // Always try to fetch result regardless of appointment status
      // This is a fallback in case appointment status loading is delayed
      const tryFetchResult = async () => {
        try {
          const resultResponse = await getResultByAppointment(appointmentId);
          console.log('Fallback result fetch:', resultResponse);
        } catch (error) {
          console.log('Fallback result fetch failed:', error);
        }
      };
      
      // Try after a small delay to ensure appointment is loaded first
      setTimeout(tryFetchResult, 1000);
    }
    return () => {
      resetCurrentResultState();
    };
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

  const handleViewResult = () => {
    setResultViewModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (currentResult?.data?.report_url) {
      window.open(currentResult.data.report_url, '_blank');
    }
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
            Tên: {record.person_info?.name || 'N/A'}
          </div>
          <div className="text-gray-500 text-xs">
            Quan Hệ: {record.person_info?.relationship || 'N/A'}
          </div>
          <div className="text-gray-500 text-xs">
            {/* Age: {record.person_info?.age || 'N/A'} */}
            Tuổi: {moment().diff(record.person_info?.dob, 'years')}
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
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   width: 130,
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <div>
    //       {(record.status === 'testing' || record.status === 'processing') && (
    //         <Button
    //           type="primary"
    //           size="small"
    //           icon={<FileTextOutlined />}
    //           onClick={() => handleCreateResult([record])}
    //           className="bg-green-500 hover:bg-green-600 border-green-500 text-xs"
    //         >
    //           Create Result
    //         </Button>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  // Filter samples that can have results created
  // Ensure samples is always an array before filtering
  const samplesArray = Array.isArray(samples) ? samples : [];
  const testingSamples = samplesArray.filter(
    sample => sample.status === 'testing' || sample.status === 'processing'
  );

  // Check if appointment has result
  // Show result if we have currentResult data, regardless of appointment status loading state
  const hasResult = currentResult?.data && (appointment.status === 'completed' || currentResult.success);

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
          <div className="flex gap-3 mt-4 lg:mt-0">
            {testingSamples.length > 0 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => handleCreateResult(testingSamples)}
                className="w-full lg:w-auto bg-green-500 hover:bg-green-600 border-green-500"
              >
                <span className="hidden md:inline">Create All Results</span>
                <span className="md:hidden">Create Results</span>
              </Button>
            )}
          </div>
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

        {/* Test Result Banner - Only show if result exists */}
        {hasResult && (
          <Card className="mb-6 border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <div className="flex items-center">
                  <Badge 
                    status={currentResult.data.is_match ? "success" : "error"} 
                    className="mr-3"
                  />
                  <div>
                    <Title level={4} className="mb-1 text-gray-800">
                      {currentResult.data.is_match ? (
                        <><CheckCircleOutlined className="text-green-500 mr-2" />DNA Match Found</>
                      ) : (
                        <><CloseCircleOutlined className="text-red-500 mr-2" />No DNA Match</>
                      )}
                    </Title>
                    <Text className="text-gray-600">
                      Result completed on {moment(currentResult.data.completed_at).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12} className="text-right">
                <Space>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={handleViewResult}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    View Results
                  </Button>
                  <Button
                    type="default"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadReport}
                    className="border-green-500 text-green-500 hover:bg-green-50"
                  >
                    Download Report
                  </Button>
                </Space>
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

        {/* Result View Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <ExperimentOutlined className="mr-2 text-purple-600" />
              Test Result Details
            </div>
          }
          open={resultViewModalOpen}
          onCancel={() => setResultViewModalOpen(false)}
          footer={[
            <Button key="download" icon={<DownloadOutlined />} onClick={handleDownloadReport}>
              Download Report
            </Button>,
            <Button key="close" onClick={() => setResultViewModalOpen(false)}>
              Close
            </Button>
          ]}
          width={800}
          className="result-modal"
        >
          <Spin spinning={resultLoading}>
            {currentResult?.data && (
              <div className="space-y-6">
                {/* Match Result */}
                <Card className="border-0 shadow-sm">
                  <div className="text-center">
                    <div className={`text-6xl mb-4 ${currentResult.data.is_match ? 'text-green-500' : 'text-red-500'}`}>
                      {currentResult.data.is_match ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </div>
                    <Title level={2} className={currentResult.data.is_match ? 'text-green-600' : 'text-red-600'}>
                      {currentResult.data.is_match ? 'DNA Match Confirmed' : 'No DNA Match Found'}
                    </Title>
                    <Text className="text-lg text-gray-600">
                      Confidence Level: <strong>{currentResult.data.result_data.confidence_level?.toUpperCase()}</strong>
                    </Text>
                  </div>
                </Card>

                {/* Test Results Data */}
                <Card title="Test Results Data" className="border-0 shadow-sm">
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <Statistic
                        title="Probability"
                        value={currentResult.data.result_data.probability}
                        suffix="%"
                        prefix={<PercentageOutlined />}
                        valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic
                        title="DNA Match Percentage"
                        value={currentResult.data.result_data.dna_match_percentage}
                        suffix="%"
                        prefix={<SafetyOutlined />}
                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic
                        title="Markers Tested"
                        value={currentResult.data.result_data.markers_tested}
                        prefix={<InfoCircleOutlined />}
                        valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic
                        title="Markers Matched"
                        value={currentResult.data.result_data.markers_matched}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#fa541c', fontSize: '20px' }}
                      />
                    </Col>
                  </Row>
                  <Divider />
                  <div className="text-center">
                    <Text strong className="text-lg">
                      Confidence Interval: {currentResult.data.result_data.confidence_interval}
                    </Text>
                  </div>
                </Card>

                {/* Sample Information */}
                <Card title="Sample Information" className="border-0 shadow-sm">
                  <Row gutter={[16, 16]}>
                    {currentResult.data.sample_ids?.map((sample, index) => (
                      <Col xs={24} md={12} key={sample._id}>
                        <Card size="small" className="bg-gray-50">
                          <div className="flex items-center mb-3">
                            <Avatar 
                              src={sample.person_info?.image_url} 
                              size={40} 
                              icon={<UserOutlined />}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-semibold text-gray-800">
                                {sample.person_info?.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {sample.person_info?.relationship}
                              </div>
                            </div>
                          </div>
                          <Row gutter={[8, 8]}>
                            <Col span={12}>
                              <Text type="secondary" className="text-xs">Sample Type:</Text>
                              <div><Tag color={sample.type === 'saliva' ? 'blue' : 'green'}>{sample.type?.toUpperCase()}</Tag></div>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" className="text-xs">Status:</Text>
                              <div><Tag color="success">{sample.status?.toUpperCase()}</Tag></div>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" className="text-xs">Age:</Text>
                              <div className="text-sm">{moment().diff(sample.person_info?.dob, 'years')} years</div>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" className="text-xs">Collection:</Text>
                              <div className="text-sm">{moment(sample.collection_date).format('DD/MM/YY')}</div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>

                {/* Laboratory Information */}
                <Card title="Laboratory Information" className="border-0 shadow-sm">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <div className="space-y-2">
                        <Text type="secondary">Laboratory Technician:</Text>
                        <div className="font-semibold">
                          {currentResult.data.laboratory_technician_id?.first_name} {currentResult.data.laboratory_technician_id?.last_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentResult.data.laboratory_technician_id?.email}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="space-y-2">
                        <Text type="secondary">Test Completion:</Text>
                        <div className="font-semibold">
                          {moment(currentResult.data.completed_at).format('DD/MM/YYYY HH:mm')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Report generated and available for download
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            )}
          </Spin>
        </Modal>
      </Card>
    </div>
  );
};

export default ViewSamples;
