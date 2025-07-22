import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, Button, message, Space, Typography, 
  Card, Row, Col, Tag, Switch, InputNumber, Select
} from 'antd';
import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useResult from '../../../../Hooks/useResult';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateResultModal = ({ open, onClose, onSuccess, samples, appointmentId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { createResult } = useResult();

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      form.resetFields();
      // Set default values
      form.setFieldsValue({
        is_match: true,
        confidence_level: 'high',
        markers_tested: 24,
        markers_matched: 24,
        dna_match_percentage: 99.99,
        confidence_interval: '99.9% - 100%'
      });
    }
  }, [open, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare the result data according to the API structure
      const resultData = {
        sample_ids: samples.map(sample => sample._id),
        appointment_id: appointmentId,
        is_match: values.is_match,
        result_data: {
          probability: values.probability || 99.99,
          confidence_interval: values.confidence_interval || "99.9% - 100%",
          markers_tested: values.markers_tested || 24,
          markers_matched: values.markers_matched || 24,
          dna_match_percentage: values.dna_match_percentage || 99.99,
          confidence_level: values.confidence_level || "high"
        }
      };

      // Call the createResult function from useResult hook
      const result = await createResult(resultData);
      
      if (result.success) {
        toast.success('Tạo kết quả xét nghiệm thành công!');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Không thể tạo kết quả xét nghiệm');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tạo kết quả xét nghiệm');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-purple-600" />
          <span>Tạo Kết Quả Xét Nghiệm</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="space-y-4">
        {/* Info Alert */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <ExperimentOutlined className="text-blue-600 mt-1" />
            <div>
              <Text strong className="text-blue-800">Tạo Kết Quả Xét Nghiệm</Text>
              <div className="text-blue-700 mt-1">
                Tạo kết quả xét nghiệm mới với tự động tạo báo cáo PDF.
                Báo cáo sẽ bao gồm thông tin chi tiết về xét nghiệm và kết quả.
              </div>
            </div>
          </div>
        </Card>

        {/* Sample Information */}
        <Card title="Thông Tin Mẫu" size="small">
          <div className="space-y-2">
            {samples.map((sample) => (
              <div key={sample._id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-3">
                  <code className="text-xs bg-white px-2 py-1 rounded">
                    {sample._id?.slice(-8)}
                  </code>
                  <Tag color={getTypeColor(sample.type)} size="small">
                    {sample.type?.toUpperCase()}
                  </Tag>
                  <Tag color="cyan" size="small">
                    {sample.kit_id?.code}
                  </Tag>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm flex items-center">
                    <UserOutlined className="mr-1" />
                    {sample.person_info?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sample.person_info?.relationship}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Result Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="is_match"
                label="Kết Quả Khớp DNA"
                rules={[{ required: true, message: 'Vui lòng chọn kết quả khớp' }]}
              >
                <Switch
                  checkedChildren="Khớp"
                  unCheckedChildren="Không Khớp"
                  defaultChecked
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confidence_level"
                label="Mức Độ Tin Cậy"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ tin cậy' }]}
              >
                <Select placeholder="Chọn mức độ tin cậy">
                  <Option value="low">Thấp</Option>
                  <Option value="medium">Trung Bình</Option>
                  <Option value="high">Cao</Option>
                  <Option value="very_high">Rất Cao</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="probability"
                label="Xác Suất (%)"
                rules={[{ required: true, message: 'Vui lòng nhập xác suất' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.01}
                  className="w-full"
                  placeholder="99.99"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dna_match_percentage"
                label="Phần Trăm Khớp DNA (%)"
                rules={[{ required: true, message: 'Vui lòng nhập phần trăm khớp DNA' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.01}
                  className="w-full"
                  placeholder="99.99"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="markers_tested"
                label="Markers Đã Kiểm Tra"
                rules={[{ required: true, message: 'Vui lòng nhập số markers đã kiểm tra' }]}
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  placeholder="24"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="markers_matched"
                label="Markers Khớp"
                rules={[{ required: true, message: 'Vui lòng nhập số markers khớp' }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="24"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="confidence_interval"
            label="Khoảng Tin Cậy"
            rules={[{ required: true, message: 'Vui lòng nhập khoảng tin cậy' }]}
          >
            <Input placeholder="99.9% - 100%" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi Chú Thêm (Tùy Chọn)"
          >
            <TextArea
              rows={4}
              placeholder="Nhập bất kỳ ghi chú thêm nào về kết quả xét nghiệm..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<FileTextOutlined />}
              >
                Tạo Kết Quả & Tạo PDF
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateResultModal;
