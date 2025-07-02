import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tooltip, Card, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import useSample from '../../../../Hooks/useSample';
import ModalDetailSample from './ModalDetailSample/ModalDetailSample';

const { Title, Text } = Typography;

const ViewSamplesByAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getSamplesByAppointment, loading } = useSample();
  
  const [samples, setSamples] = useState([]);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [selectedSamples, setSelectedSamples] = useState([]);
  useEffect(() => {
    fetchSamples();
  }, [appointmentId]);

  const fetchSamples = async () => {
    setIsLoading(true);
    try {
      const result = await getSamplesByAppointment(appointmentId);
      if (result.success) {
        const data = Array.isArray(result.data) ? result.data : result.data?.data || [];
        setSamples(data);
        
        // Get appointment info from the first sample
        if (data.length > 0) {
          setAppointmentInfo(data[0].appointment_id);
        }
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSampleDetail = (sampleId) => {
    setSelectedSampleId(sampleId);
    setModalOpen(true);
  };

  const handleSampleSelect = (sampleId, checked) => {
    if (checked) {
      setSelectedSamples(prev => [...prev, sampleId]);
    } else {
      setSelectedSamples(prev => prev.filter(id => id !== sampleId));
    }
  };

  const handlePayment = () => {
    navigate('/payment', {
      state: {
        appointmentId,
        sampleIds: selectedSamples,
      },
    });
  };

  // Check if payment button should be shown
  const showPaymentButton = appointmentInfo?.status === 'sample_received';
  const receivedSamples = samples.filter(sample => sample.status === 'received');
  const selectedReceivedSamples = selectedSamples.filter(sampleId => {
    const sample = samples.find(s => s._id === sampleId);
    return sample && sample.status === 'received';
  });
  const canPay = selectedReceivedSamples.length >= 2;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'collected': return 'blue';
      case 'processing': return 'purple';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'blood': return 'red';
      case 'saliva': return 'blue';
      case 'hair': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      width: 60,
      render: (_, record) => {
        const isReceived = record.status === 'received';
        const isSelected = selectedSamples.includes(record._id);
        return showPaymentButton && isReceived ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => handleSampleSelect(record._id, e.target.checked)}
            className="w-4 h-4"
          />
        ) : null;
      }
    },
    {
      title: 'Sample ID',
      dataIndex: '_id',
      key: 'sampleId',
      render: (id) => (
        <Text code>{id}</Text>
      )
    },
    {
      title: 'Kit Code',
      dataIndex: ['kit_id', 'code'],
      key: 'kitCode',
      render: (_, record) => (
        <Tag color="cyan">{record.kit_id?.code}</Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getTypeColor(type)}>{type.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Person Info',
      key: 'personInfo',
      render: (_, record) => (
        <div>
          <div><strong>{record.person_info?.name}</strong></div>
          <div>
            <Text type="secondary">
              {record.person_info?.relationship} | 
              {new Date(record.person_info?.dob).toLocaleDateString()}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Collection Method',
      dataIndex: 'collection_method',
      key: 'collectionMethod',
      render: (method) => (
        <Tag>{method}</Tag>
      )
    },
    {
      title: 'Collection Date',
      dataIndex: 'collection_date',
      key: 'collectionDate',
      render: (date) => (
        <div>
          {new Date(date).toLocaleDateString()}<br/>
          <Text type="secondary">{new Date(date).toLocaleTimeString()}</Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết mẫu">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewSampleDetail(record._id)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Danh sách mẫu của cuộc hẹn
          </Title>
        </div>
        
        
      </div>

      {/* Appointment Info Card */}
      {appointmentInfo && (
        <Card className="mb-6" size="small">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Text type="secondary">Appointment ID:</Text>
              <div><Text code>{appointmentInfo._id}</Text></div>
            </div>
            <div>
              <Text type="secondary">Ngày hẹn:</Text>
              <div>{new Date(appointmentInfo.appointment_date).toLocaleDateString()}</div>
            </div>
            <div>
              <Text type="secondary">Loại:</Text>
              <div><Tag>{appointmentInfo.type}</Tag></div>
            </div>
            <div>
              <Text type="secondary">Trạng thái:</Text>
              <div>
                <Tag color={getStatusColor(appointmentInfo.status)}>
                  {appointmentInfo.status}
                </Tag>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Samples Table */}
      <Card>
        {showPaymentButton && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800">
              <strong>Chọn ít nhất 2 mẫu có trạng thái "RECEIVED" để thanh toán</strong>
            </Text>
            <div className="mt-2">
              <Text type="secondary">
                Đã chọn: {selectedReceivedSamples.length} / {receivedSamples.length} mẫu có thể thanh toán
              </Text>
            </div>
          </div>
        )}
        {/* Payment Button */}
        {showPaymentButton && (
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}
            disabled={!canPay}
            className="bg-green-600 hover:bg-green-700 border-green-600 mb-2 -mt-3"
          >
            Thanh toán ({selectedReceivedSamples.length} mẫu)
          </Button>
        )}
        <Table
          columns={columns}
          dataSource={samples}
          rowKey="_id"
          loading={isLoading || loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} mẫu`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Summary Card */}
      <Card className="mt-6" size="small">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{samples.length}</div>
            <div className="text-gray-500">Tổng số mẫu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {samples.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-gray-500">Đang chờ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {samples.filter(s => s.status === 'received').length}
            </div>
            <div className="text-gray-500">Đã nhận</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(samples.map(s => s.type)).size}
            </div>
            <div className="text-gray-500">Loại mẫu</div>
          </div>
        </div>
      </Card>

      {/* Modal Detail Sample */}
      <ModalDetailSample
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sampleId={selectedSampleId}
      />
    </div>
  );
};

export default ViewSamplesByAppointment;
