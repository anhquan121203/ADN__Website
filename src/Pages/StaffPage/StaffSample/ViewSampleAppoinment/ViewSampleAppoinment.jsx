import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Tag, Spin, Empty, Divider, Typography, Image, Button, message, Checkbox, Space } from 'antd';
import { FaUser, FaBirthdayCake, FaIdCard, FaMapMarkerAlt, FaFlask, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaBoxes } from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { fetchSamplesByAppointment } from '../../../../Feartures/sample/sampleSlice';
import  useSample  from '../../../../Hooks/useSample';

const { Title, Text } = Typography;

const ViewSampleAppoinment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { receiveSamples } = useSample();
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const { samples, isLoading, error } = useSelector((state) => ({
    samples: state.sample.samples || [],
    isLoading: state.sample.isLoading,
    error: state.sample.error
  }));

  // Filter samples that can be received (pending or sample_collected status)
  const receivableSamples = Array.isArray(samples) ? samples.filter(sample => 
    sample.status === 'pending' || sample.status === 'sample_collected'
  ) : [];

  // Check if a sample is selected
  const isSampleSelected = useCallback((sampleId) => {
    return selectedSamples.includes(sampleId);
  }, [selectedSamples]);

  // Toggle sample selection
  const toggleSampleSelection = (sampleId) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId)
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    );
  };

  // Select/deselect all samples
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedSamples(receivableSamples.map(sample => sample._id));
    } else {
      setSelectedSamples([]);
    }
  };

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadSamples = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        await dispatch(fetchSamplesByAppointment(appointmentId)).unwrap();
      } catch (error) {
        console.error('Error loading samples:', error);
        setErrorMessage(error?.message || 'Có lỗi xảy ra khi tải dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      loadSamples();
    }
  }, [appointmentId, dispatch]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Chờ xử lý' },
      processing: { color: 'blue', text: 'Đang xử lý' },
      completed: { color: 'green', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
      sample_collected: { color: 'geekblue', text: 'Đã lấy mẫu' },
      sample_received: { color: 'cyan', text: 'Đã nhận mẫu' },
      in_progress: { color: 'purple', text: 'Đang phân tích' },
      awaiting_results: { color: 'gold', text: 'Chờ kết quả' },
      results_available: { color: 'lime', text: 'Có kết quả' },
      delivered: { color: 'green', text: 'Đã giao kết quả' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const getTypeTag = (type) => {
    const typeMap = {
      blood: { color: 'red', text: 'Máu' },
      saliva: { color: 'blue', text: 'Nước bọt' },
      tissue: { color: 'green', text: 'Mô' },
      other: { color: 'default', text: 'Khác' }
    };
    
    const typeInfo = typeMap[type] || { color: 'default', text: type };
    return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleReceiveSamples = async () => {
    if (selectedSamples.length === 0) return;
    
    try {
      setIsReceiving(true);
      
      const result = await receiveSamples(selectedSamples);
      
      if (result.success) {
        message.success(`Đã tiếp nhận thành công ${selectedSamples.length} mẫu`);
        // Refresh the samples list and clear selection
        await dispatch(fetchSamplesByAppointment(appointmentId)).unwrap();
        setSelectedSamples([]);
      } else {
        message.error(result.error || 'Có lỗi xảy ra khi tiếp nhận mẫu');
      }
    } catch (error) {
      console.error('Error receiving samples:', error);
      message.error('Có lỗi xảy ra khi tiếp nhận mẫu');
    } finally {
      setIsReceiving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!samples || samples.length === 0) {
    return (
      <Empty 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
        description="Không có mẫu nào cho đơn hẹn này"
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          type="text" 
          icon={<FaArrowLeft />} 
          onClick={handleBack}
        >
          Quay lại
        </Button>
        
        <Space>
          {receivableSamples.length > 0 && (
            <Checkbox
              onChange={(e) => toggleSelectAll(e.target.checked)}
              checked={selectedSamples.length > 0 && selectedSamples.length === receivableSamples.length}
              indeterminate={selectedSamples.length > 0 && selectedSamples.length < receivableSamples.length}
              className="mr-2"
            >
              Chọn tất cả ({receivableSamples.length} mẫu có thể tiếp nhận)
            </Checkbox>
          )}
          
          <Button
            type="primary"
            icon={<FaBoxes />}
            onClick={handleReceiveSamples}
            disabled={selectedSamples.length < 2}
            loading={isReceiving}
          >
            Tiếp nhận mẫu đã chọn ({selectedSamples.length})
          </Button>
        </Space>
      </div>
      
      <Row gutter={[16, 16]}>
        {samples.map((sample) => (
          <Col xs={24} md={12} key={sample._id}>
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <Space>
                    {(sample.status === 'pending' || sample.status === 'sample_collected') && (
                      <Checkbox 
                        checked={isSampleSelected(sample._id)}
                        onChange={() => toggleSampleSelection(sample._id)}
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                    <span>Mẫu: {sample.kit_id?.code || 'N/A'}</span>
                  </Space>
                  <div>
                    {getStatusTag(sample.status)}
                    {getTypeTag(sample.type)}
                  </div>
                </div>
              }
              className="h-full shadow-sm hover:shadow-md transition-shadow"
              style={{ height: '100%' }}
            >
              <div className="space-y-3">
                <div className="flex items-start">
                  {sample.person_info?.image_url && (
                    <div className="mr-4">
                      <Image
                        width={100}
                        height={100}
                        src={sample.person_info.image_url}
                        alt="Ảnh đại diện"
                        className="rounded object-cover"
                        fallback="https://via.placeholder.com/100"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaUser className="text-gray-500 mr-2" />
                      <Text strong>Họ tên:</Text>
                      <Text className="ml-2">{sample.person_info?.name || 'N/A'}</Text>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <FaBirthdayCake className="text-gray-500 mr-2" />
                      <Text strong>Ngày sinh:</Text>
                      <Text className="ml-2">
                        {sample.person_info?.dob ? formatDate(sample.person_info.dob) : 'N/A'}
                      </Text>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <FaIdCard className="text-gray-500 mr-2" />
                      <Text strong>CMND/CCCD:</Text>
                      <Text className="ml-2">{sample.person_info?.identity_document || 'N/A'}</Text>
                    </div>
                    
                    <div className="flex items-start mb-2">
                      <FaMapMarkerAlt className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <Text strong>Nơi sinh:</Text>
                        <Text className="ml-2">{sample.person_info?.birth_place || 'N/A'}</Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <FaFlask className="text-gray-500 mr-2" />
                      <Text strong>Loại mẫu:</Text>
                      <Text className="ml-2" style={{ textTransform: 'capitalize' }}>
                        {sample.type || 'N/A'}
                      </Text>
                    </div>
                    
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <Text strong>Ngày lấy mẫu:</Text>
                      <Text className="ml-2">
                        {sample.collection_date ? formatDate(sample.collection_date) : 'N/A'}
                      </Text>
                    </div>
                  </div>
                </div>
                
                <Divider className="my-3" />
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <Text type="secondary" className="block">Mã mẫu</Text>
                    <Text strong>{sample._id || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block">Phương thức lấy mẫu</Text>
                    <Text strong>
                      {sample.collection_method === 'self' ? 'Tự lấy mẫu' : 'Nhân viên lấy mẫu'}
                    </Text>
                  </div>
                </div>
                
                {/* {sample.status === 'pending' || sample.status === 'sample_collected' ? (
                  <Button
                    type="primary"
                    icon={<FaCheckCircle />}
                    loading={isReceiving}
                    onClick={() => handleReceiveSamples()}
                    block
                    className="mt-2"
                  >
                    Tiếp nhận mẫu
                  </Button>
                ) : sample.status === 'sample_received' ? (
                  <div className="text-green-600 text-center py-2">
                    <FaCheckCircle className="inline-block mr-2" />
                    Đã tiếp nhận
                  </div>
                ) : null} */}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewSampleAppoinment;
