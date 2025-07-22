import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tooltip, Card, Tag, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ExperimentOutlined } from '@ant-design/icons';
import useSample from '../../../../Hooks/useSample';
import ModalDetailSample from '../../../CustomerPage/AppointmentPage/ViewSampleAppointment/ModalDetailSample/ModalDetailSample';
import ModalStartTesting from './ModalStartTesting/ModalStartTesting';
import { toast } from 'react-toastify';
const { Title, Text } = Typography;

const getInitial = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

const LabTechViewSamplesByAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getSamplesByAppointment } = useSample();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [startTestingModalOpen, setStartTestingModalOpen] = useState(false);

  // Fetch samples
  const fetchSamples = useCallback(async () => {
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
  }, [appointmentId, getSamplesByAppointment]);

  useEffect(() => {
    if (appointmentId) fetchSamples();
  }, [appointmentId, fetchSamples]);

  // Handle view sample detail
  const handleViewSampleDetail = (sampleId) => {
    setSelectedSampleId(sampleId);
    setModalOpen(true);
  };

  // Handle start testing modal
  const handleStartTesting = () => {
    const receivedSamples = sampleArray.filter(sample => sample.status === 'received');
    if (receivedSamples.length === 0) {
      toast.warning('Không có mẫu nào với trạng thái "đã nhận" để bắt đầu xét nghiệm');
      return;
    }
    setStartTestingModalOpen(true);
  };

  // Handle start testing success
  const handleStartTestingSuccess = () => {
    fetchSamples(); // Refresh the samples list
    toast.success('Cập nhật mẫu thành công. Đang chuyển về trang mẫu...');
    setTimeout(() => {
      navigate(-1); // Navigate back to the previous page
    }, 1500);
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
    return <div className="p-4 sm:p-6 max-w-full overflow-hidden">Đang tải mẫu...</div>;
  }
  
  const sampleArray = Array.isArray(samples) ? samples : [];
  if (!sampleArray.length) {
    return (
      <div className="p-4 sm:p-6 max-w-full overflow-hidden">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Danh sách mẫu cho cuộc hẹn
          </Title>
        </div>
        <div>Không tìm thấy mẫu nào cho cuộc hẹn này.</div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: 'sampleId',
      width: 80,
      render: (id) => (
        <Tooltip title={id}>
          <Text code>{id.slice(-6)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Mã Kit',
      dataIndex: ['kit_id', 'code'],
      key: 'kitCode',
      width: 100,
      render: (_, record) => (
        <Tag color="cyan" size="small">{record.kit_id?.code}</Tag>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <Tag color={getTypeColor(type)} size="small">
          {type === 'blood' ? 'Máu' : type === 'saliva' ? 'Nước bọt' : type === 'hair' ? 'Tóc' : type}
        </Tag>
      ),
    },
    {
      title: 'Người',
      key: 'personInfo',
      width: 180,
      render: (_, record) => {
        const person = record.person_info || {};
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
              {person.image_url ? (
                <img
                  src={person.image_url}
                  alt="Person"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  {getInitial(person.name)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{person.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {person.relationship}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Phương pháp',
      dataIndex: 'collection_method',
      key: 'collectionMethod',
      width: 90,
      render: (method) => (
        <Tag size="small">{method}</Tag>
      ),
    },
    {
      title: 'Thu thập',
      dataIndex: 'collection_date',
      key: 'collectionDate',
      width: 110,
      render: (date) => (
        <div>
          <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
    {
      title: 'Nhận',
      dataIndex: 'received_date',
      key: 'receivedDate',
      width: 110,
      render: (date) => (
        date ? (
          <div>
            <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        ) : (
          <Text type="secondary" className="text-xs">Chưa nhận</Text>
        )
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => (
        <Tag color={getStatusColor(status)} size="small">
          {(() => {
            switch (status) {
              case 'pending': return 'Chờ xử lý';
              case 'collected': return 'Đã thu thập';
              case 'received': return 'Đã nhận';
              case 'processing': return 'Đang xử lý';
              case 'completed': return 'Hoàn thành';
              case 'failed': return 'Thất bại';
              default: return status;
            }
          })()}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 70,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewSampleDetail(record._id)}
            style={{ color: '#1890ff' }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Danh sách mẫu cho cuộc hẹn
          </Title>
        </div>
        <Button
          type="primary"
          icon={<ExperimentOutlined />}
          onClick={handleStartTesting}
          disabled={sampleArray.filter(sample => sample.status === 'received').length === 0}
        >
          Bắt đầu xét nghiệm
        </Button>
      </div>

      {/* Summary Card */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sampleArray.length}</div>
              <div className="text-gray-500">Tổng số mẫu</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {sampleArray.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-gray-500">Chờ xử lý</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sampleArray.filter(s => s.status === 'received').length}
              </div>
              <div className="text-gray-500">Sẵn sàng xét nghiệm</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(sampleArray.map(s => s.type)).size}
              </div>
              <div className="text-gray-500">Loại mẫu</div>
            </div>
          </Card>
        </Col>
      </Row>

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
              `${range[0]}-${range[1]} của ${total} mẫu`,
            responsive: true,
          }}
          scroll={{ 
            x: 'max-content',
            scrollToFirstRowOnChange: true,
          }}
          size="small"
        />
      </Card>

      {/* Modal Detail Sample */}
      <ModalDetailSample
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sampleId={selectedSampleId}
        onImageUploadSuccess={fetchSamples}
      />

      {/* Modal Start Testing */}
      <ModalStartTesting
        open={startTestingModalOpen}
        onClose={() => setStartTestingModalOpen(false)}
        samples={sampleArray}
        appointmentId={appointmentId}
        onSuccess={handleStartTestingSuccess}
      />
    </div>
  );
};

export default LabTechViewSamplesByAppointment;
