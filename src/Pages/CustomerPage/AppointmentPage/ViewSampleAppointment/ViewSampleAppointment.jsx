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
import ModalDetailSample from './ModalDetailSample/ModalDetailSample';
import ModalViewResult from './ModalViewResult/ModalViewResult';

const { Title, Text } = Typography;

const getInitial = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

const ViewSampleAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getSamplesByAppointment, submitSamples } = useSample();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  // Tự động ẩn thông báo sau 3s
  useEffect(() => {
    if (notification) {
      const id = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(id);
    }
  }, [notification]);

  // Lấy danh sách mẫu
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

  // Xem kết quả - chỉ mở modal
  const handleViewResult = () => {
    setResultModalOpen(true);
  };

  // Xem chi tiết mẫu
  const handleViewSampleDetail = (sampleId) => {
    setSelectedSampleId(sampleId);
    setModalOpen(true);
  };

  // Xử lý chọn checkbox
  const handleCheckboxChange = (sampleId, checked) => {
    setSelectedSampleIds(prev =>
      checked ? [...prev, sampleId] : prev.filter(id => id !== sampleId)
    );
  };

  // Xử lý gửi mẫu
  const handleSubmitSamples = async () => {
    if (!selectedSampleIds.length) {
      setNotification({ message: 'Vui lòng chọn ít nhất một mẫu!', type: 'error' });
      return;
    }
    
    // Lấy mẫu đầu tiên để lấy ngày lấy mẫu
    const firstSample = samples.find(sample => sample._id === selectedSampleIds[0]);
    if (!firstSample?.collection_date) {
      setNotification({ message: 'Mẫu được chọn không có ngày lấy mẫu!', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    const res = await submitSamples(selectedSampleIds, firstSample.collection_date);
    if (res.success) {
      setNotification({ message: 'Gửi mẫu thành công!', type: 'success' });
      setSelectedSampleIds([]);
      fetchSamples();
    } else {
      setNotification({ message: 'Gửi mẫu thất bại!', type: 'error' });
    }
    setSubmitting(false);
  };

  // Hàm lấy màu và phiên dịch cho trạng thái mẫu
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange'; // Chờ xử lý
      case 'collected': return 'blue'; // Đã lấy mẫu
      case 'received': return 'green'; // Đã nhận mẫu
      case 'processing': return 'purple'; // Đang xử lý
      case 'completed': return 'success'; // Hoàn thành
      case 'failed': return 'red'; // Thất bại
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'collected': return 'Đã lấy mẫu';
      case 'received': return 'Đã nhận mẫu';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  // Hàm lấy màu và phiên dịch cho loại mẫu
  const getTypeColor = (type) => {
    switch (type) {
      case 'blood': return 'red'; // Máu
      case 'saliva': return 'blue'; // Nước bọt
      case 'hair': return 'green'; // Tóc
      default: return 'default';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'blood': return 'Máu';
      case 'saliva': return 'Nước bọt';
      case 'hair': return 'Tóc';
      default: return type;
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }
  
  const sampleArray = Array.isArray(samples) ? samples : [];
  if (!sampleArray.length) {
    return <div className="p-6">Không tìm thấy mẫu nào.</div>;
  }

  // Nếu lịch hẹn đã lấy mẫu và kit đã sử dụng thì ẩn các nút gửi mẫu
  const appointmentStatus = sampleArray[0]?.appointment_id?.status;
  const kitStatus = sampleArray[0]?.kit_id?.status;
  const paymentStatus = sampleArray[0]?.appointment_id?.payment_status;
  const isBatchCompleted = appointmentStatus === 'sample_collected' || appointmentStatus === 'sample_received' || kitStatus === 'used' || appointmentStatus === 'completed';

  const columns = [
    {
      title: 'Chọn',
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
      title: 'Mã mẫu',
      dataIndex: '_id',
      key: 'sampleId',
      render: (id) => (
        <Text code>{id.slice(-8)}</Text>
      )
    },
    {
      title: 'Mã bộ kit',
      dataIndex: ['kit_id', 'code'],
      key: 'kitCode',
      render: (_, record) => (
        <Tag color="cyan">{record.kit_id?.code}</Tag>
      )
    },
    {
      title: 'Loại mẫu',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {getTypeLabel(type)}
        </Tag>
      )
    },
    {
      title: 'Thông tin người lấy mẫu',
      key: 'personInfo',
      render: (_, record) => {
        const person = record.person_info || {};
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              {person.image_url ? (
                <img
                  src={person.image_url}
                  alt="Người lấy mẫu"
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
      title: 'Phương pháp lấy mẫu',
      dataIndex: 'collection_method',
      key: 'collectionMethod',
      render: (method) => (
        <Tag>{method}</Tag>
      )
    },
    {
      title: 'Ngày lấy mẫu',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
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
      {/* Thông báo */}
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

      {/* Tiêu đề */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Danh sách mẫu của lịch hẹn
          </Title>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút xem kết quả - chỉ hiện khi lịch hẹn đã hoàn thành */}
          {appointmentStatus === "completed" && (
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={handleViewResult}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            >
              Xem kết quả xét nghiệm
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

      {/* Gửi mẫu hàng loạt */}
      {!isBatchCompleted && (
        <Card className="mb-6" size="small">
          <div className="flex items-center justify-between">
            <Text className="text-blue-800">
              <strong>Chọn mẫu để gửi hàng loạt</strong>
            </Text>
            <Button
              type="primary"
              loading={submitting}
              disabled={!selectedSampleIds.length}
              onClick={handleSubmitSamples}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              {submitting ? 'Đang gửi...' : `Gửi mẫu đã chọn (${selectedSampleIds.length})`}
            </Button>
          </div>
        </Card>
      )}

      {/* Bảng mẫu */}
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
              `${range[0]}-${range[1]} trong tổng ${total} mẫu`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Thống kê */}
      <Card className="mt-6" size="small">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{sampleArray.length}</div>
            <div className="text-gray-500">Tổng số mẫu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sampleArray.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-gray-500">Chờ xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sampleArray.filter(s => s.status === 'received').length}
            </div>
            <div className="text-gray-500">Đã nhận</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(sampleArray.map(s => s.type)).size}
            </div>
            <div className="text-gray-500">Loại mẫu</div>
          </div>
        </div>
      </Card>

      {/* Modal xem kết quả */}
      <ModalViewResult
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        appointmentId={appointmentId}
        appointmentStatus={appointmentStatus}
      />

      {/* Modal chi tiết mẫu */}
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
