import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tooltip, Card, Tag, Typography, Checkbox } from 'antd';
import { 
  ArrowLeftOutlined, 
  EyeOutlined, 
  ExclamationCircleOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';
import useSample from '../../../../Hooks/useSample';
import useResult from '../../../../Hooks/useResult';
import ModalDetailSample from './ModalDetailSample/ModalDetailSample';
import ModalViewResult from './ModalViewResult/ModalViewResult';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const getInitial = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

const ViewSampleAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getSamplesByAppointment, uploadPersonImage, submitSamples } = useSample();
  const { getResultByAppointment, currentResult, resultLoading } = useResult();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  
  // Auto-clear notification sau 3s
  useEffect(() => {
    if (notification) {
      const id = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(id);
    }
  }, [notification]);

  // Fetch samples
  const fetchSamples = async () => {
    setLoading(true);
    try {
      const res = await getSamplesByAppointment(appointmentId);
      if (res.success) {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data && Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setSamples(data);
      } else {
        setSamples([]);
      }
    } catch {
      setSamples([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchSamples();
  }, [appointmentId]);

  // Handle view result - just open the modal
  const handleViewResult = () => {
    setResultModalOpen(true);
  };

  // Handle view sample detail
  const handleViewSampleDetail = (sampleId) => {
    setSelectedSampleId(sampleId);
    setModalOpen(true);
  };

  // Handle checkbox change
  const handleCheckboxChange = (sampleId, checked) => {
    setSelectedSampleIds(prev =>
      checked ? [...prev, sampleId] : prev.filter(id => id !== sampleId)
    );
  };

  // Handle submit
  const handleSubmitSamples = async () => {
    if (!selectedSampleIds.length) {
      setNotification({ message: 'Please select at least one sample!', type: 'error' });
      return;
    }
    
    // Get the first selected sample to use its collection date
    const firstSample = samples.find(sample => sample._id === selectedSampleIds[0]);
    if (!firstSample?.collection_date) {
      setNotification({ message: 'Selected sample has no collection date!', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    const res = await submitSamples(selectedSampleIds, firstSample.collection_date);
    if (res.success) {
      setNotification({ message: 'Submit successful!', type: 'success' });
      setSelectedSampleIds([]);
      fetchSamples();
    } else {
      setNotification({ message: 'Submit failed!', type: 'error' });
    }
    setSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'collected': return 'blue';
      case 'received': return 'green';
      case 'processing': return 'purple';
      case 'completed': return 'success';
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  
  const sampleArray = Array.isArray(samples) ? samples : [];
  if (!sampleArray.length) {
    return <div className="p-6">No samples found.</div>;
  }

  // If appointment is collected AND kit is used, hide all batch controls
  const appointmentStatus = sampleArray[0]?.appointment_id?.status;
  const kitStatus = sampleArray[0]?.kit_id?.status;
  const paymentStatus = sampleArray[0]?.appointment_id?.payment_status;
  const isBatchCompleted = appointmentStatus === 'sample_collected' || appointmentStatus === 'sample_received' || kitStatus === 'used' || appointmentStatus === 'completed';

  const columns = [
    {
      title: 'Select',
      key: 'select',
      width: 60,
      render: (_, record) => {
        if (isBatchCompleted) return null;
        return (
          <Checkbox
            checked={selectedSampleIds.includes(record._id)}
            onChange={(e) => handleCheckboxChange(record._id, e.target.checked)}
          />
        );
      }
    },
    {
      title: 'Sample ID',
      dataIndex: '_id',
      key: 'sampleId',
      render: (id) => (
        <Text code>{id.slice(-8)}</Text>
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
      render: (_, record) => {
        const person = record.person_info || {};
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              {person.image_url ? (
                <img
                  src={person.image_url}
                  alt="Person"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-lg text-gray-400">
                  {getInitial(person.name)}
                </div>
              )}
            </div>
            <div>
              <div><strong>{person.name}</strong></div>
              <div>
                <Text type="secondary">
                  {person.relationship} | 
                  {person.dob ? new Date(person.dob).toLocaleDateString() : ''}
                </Text>
              </div>
            </div>
          </div>
        );
      }
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
      {/* Toast notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
            notification.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Return
          </Button>
          <Title level={3} className="mb-0">
            Sample List for Appointment
          </Title>
        </div>

        <div className="flex items-center gap-3">
          {/* View Result Button - Only show if appointment is completed */}
          {appointmentStatus === "completed" && (
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={handleViewResult}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            >
              Xem kết quả test
            </Button>
          )}

          {appointmentStatus === "sample_received" && paymentStatus !== "paid" && paymentStatus !== "cancelled" && (
            <Button
              type="primary"
              size="large"
              onClick={() =>
                navigate("/payment", {
                  state: {
                    appointmentId,
                    sampleIds: sampleArray.map((s) => s._id),
                  },
                })
              }
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thanh toán
            </Button>
          )}
        </div>
      </div>

      {/* Batch submit controls */}
      {!isBatchCompleted && (
        <Card className="mb-6" size="small">
          <div className="flex items-center justify-between">
            <Text className="text-blue-800">
              <strong>Select samples to submit in batch</strong>
            </Text>
            <Button
              type="primary"
              loading={submitting}
              disabled={!selectedSampleIds.length}
              onClick={handleSubmitSamples}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              {submitting ? 'Submitting...' : `Submit Selected (${selectedSampleIds.length})`}
            </Button>
          </div>
        </Card>
      )}

      {/* Samples Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={sampleArray}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} samples`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Summary Card */}
      <Card className="mt-6" size="small">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{sampleArray.length}</div>
            <div className="text-gray-500">Total Samples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sampleArray.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sampleArray.filter(s => s.status === 'received').length}
            </div>
            <div className="text-gray-500">Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(sampleArray.map(s => s.type)).size}
            </div>
            <div className="text-gray-500">Sample Types</div>
          </div>
        </div>
      </Card>

      {/* Modal View Result */}
      <ModalViewResult
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        appointmentId={appointmentId}
        appointmentStatus={appointmentStatus}
      />

      {/* Modal Detail Sample */}
      <ModalDetailSample
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sampleId={selectedSampleId}
        onImageUploadSuccess={fetchSamples}
      />
    </div>
  );
};

export default ViewSampleAppointment;
