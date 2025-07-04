import React, { useEffect, useState } from 'react';
import { Modal, Card, Tag, Typography, Row, Col, Button, Upload, message, Spin, Image } from 'antd';
import { UploadOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import useSample from '../../../../../Hooks/useSample';

const { Title, Text } = Typography;

const ModalDetailSample = ({ open, onClose, sampleId, onImageUploadSuccess }) => {
  const { getSampleById, uploadPersonImage, selectedSample, loading } = useSample();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (open && sampleId) {
      fetchSampleDetail();
    }
  }, [open, sampleId]);

  useEffect(() => {
    if (selectedSample) {
      // Set existing image preview if available
      if (selectedSample.person_info?.image_url) {
        setImagePreview(selectedSample.person_info.image_url);
      }
    }
  }, [selectedSample]);

  const fetchSampleDetail = async () => {
    try {
      const result = await getSampleById(sampleId);
      if (!result.success) {
        message.error('Không thể tải thông tin mẫu');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải thông tin mẫu');
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadPersonImage(sampleId, file);
      if (result.success) {
        message.success('Upload ảnh thành công!');
        // Refresh sample data to get updated image
        await fetchSampleDetail();
        // Call callback to refresh parent component
        if (onImageUploadSuccess) {
          onImageUploadSuccess();
        }
      } else {
        message.error('Upload ảnh thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    
    handleImageUpload(file);
    return false;
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

  const handleClose = () => {
    setImagePreview(null);
    onClose();
  };

  if (!selectedSample && loading) {
    return (
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        title="Chi tiết mẫu"
        width={800}
      >
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (!selectedSample) {
    return null;
  }

  const sample = selectedSample;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>
      ]}
      title={
        <div className="flex items-center gap-2">
          <Title level={4} className="mb-0">Chi tiết mẫu</Title>
          <Tag color="blue">{sample._id?.slice(-8)}</Tag>
        </div>
      }
      width={900}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Basic Sample Information */}
        <Card title="Thông tin mẫu" size="small">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text type="secondary">Mã mẫu:</Text>
              <div><Text code>{sample._id}</Text></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Mã kit:</Text>
              <div><Tag color="cyan">{sample.kit_id?.code}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Loại mẫu:</Text>
              <div><Tag color={getTypeColor(sample.type)}>{sample.type.toUpperCase()}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Phương thức thu thập:</Text>
              <div><Tag>{sample.collection_method}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Trạng thái:</Text>
              <div><Tag color={getStatusColor(sample.status)}>{sample.status.toUpperCase()}</Tag></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Ngày thu thập:</Text>
              <div>{new Date(sample.collection_date).toLocaleString()}</div>
            </Col>
            {sample.received_date && (
              <Col span={8}>
                <Text type="secondary">Ngày nhận:</Text>
                <div>{new Date(sample.received_date).toLocaleString()}</div>
              </Col>
            )}
          </Row>
        </Card>

        {/* Person Information with Image Upload */}
        <Card title="Thông tin người" size="small">
          <Row gutter={[24, 16]}>
            {/* Person Image Section */}
            <Col span={8}>
              <div className="text-center">
                <div className="mb-3">
                  {imagePreview ? (
                    <Image
                      width={120}
                      height={120}
                      src={imagePreview}
                      alt="Person"
                      className="rounded-full object-cover"
                      style={{ border: '2px solid #d9d9d9' }}
                    />
                  ) : (
                    <div className="w-30 h-30 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <UserOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                    </div>
                  )}
                </div>
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={uploading}
                    size="small"
                  >
                    {imagePreview ? 'Thay đổi ảnh' : 'Upload ảnh'}
                  </Button>
                </Upload>
              </div>
            </Col>

            {/* Person Details */}
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Họ và tên:</Text>
                  <div><strong>{sample.person_info?.name}</strong></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Ngày sinh:</Text>
                  <div>{new Date(sample.person_info?.dob).toLocaleDateString()}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Mối quan hệ:</Text>
                  <div>{sample.person_info?.relationship}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Nơi sinh:</Text>
                  <div>{sample.person_info?.birth_place}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Quốc tịch:</Text>
                  <div>{sample.person_info?.nationality}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">CMND/CCCD:</Text>
                  <div><Text code>{sample.person_info?.identity_document}</Text></div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Appointment Information */}
        {sample.appointment_id && (
          <Card title="Thông tin cuộc hẹn" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã cuộc hẹn:</Text>
                <div><Text code>{sample.appointment_id._id?.slice(-8)}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Ngày hẹn:</Text>
                <div>{new Date(sample.appointment_id.appointment_date).toLocaleDateString()}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Loại:</Text>
                <div><Tag>{sample.appointment_id.type}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Trạng thái cuộc hẹn:</Text>
                <div>
                  <Tag color={getStatusColor(sample.appointment_id.status)}>
                    {sample.appointment_id.status}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Ngày tạo:</Text>
                <div>{new Date(sample.appointment_id.created_at).toLocaleString()}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Cập nhật lần cuối:</Text>
                <div>{new Date(sample.appointment_id.updated_at).toLocaleString()}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Kit Information */}
        {sample.kit_id && (
          <Card title="Thông tin kit" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">Mã kit:</Text>
                <div><Tag color="cyan">{sample.kit_id.code}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Trạng thái kit:</Text>
                <div><Tag color="blue">{sample.kit_id.status}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Ngày tạo kit:</Text>
                <div>{new Date(sample.kit_id.created_at).toLocaleString()}</div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Metadata */}
        <Card title="Thông tin khác" size="small">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text type="secondary">Ngày tạo:</Text>
              <div>{new Date(sample.created_at).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Cập nhật lần cuối:</Text>
              <div>{new Date(sample.updated_at).toLocaleString()}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Người tạo:</Text>
              <div><Text code>{sample.created_by?.slice(-8)}</Text></div>
            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  );
};

export default ModalDetailSample;
