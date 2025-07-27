import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button, 
  Card, 
  Row, 
  Col, 
  Divider,
  message,
  Spin,
  Typography,
  Space,
  Tag
} from 'antd';
import { 
  ExperimentOutlined, 
  SaveOutlined, 
  PercentageOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import useResult from '../../../../Hooks/useResult';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ModalEditResult = ({ open, onClose, resultData, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { updateResultData, updateResultLoading } = useResult();

  useEffect(() => {
    if (open && resultData) {
      // Điền dữ liệu hiện tại vào form
      form.setFieldsValue({
        is_match: resultData.is_match,
        probability: resultData.result_data?.probability || 0,
        // dna_match_percentage: resultData.result_data?.dna_match_percentage || 0,
        confidence_interval: resultData.result_data?.confidence_interval || '',
        markers_tested: resultData.result_data?.markers_tested || 0,
        markers_matched: resultData.result_data?.markers_matched || 0,
        notes: resultData.notes || ''
      });
    }
  }, [open, resultData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        is_match: values.is_match,
        result_data: {
          probability: values.probability,
        //   dna_match_percentage: values.dna_match_percentage,
          confidence_interval: values.confidence_interval,
          markers_tested: values.markers_tested,
          markers_matched: values.markers_matched
        },
        notes: values.notes
      };

      const result = await updateResultData(resultData._id, updateData);
      
      if (result.success) {
        toast.success('Cập nhật kết quả xét nghiệm thành công!');
        form.resetFields();
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error('Cập nhật kết quả thất bại: ' + (result.errors.message || 'Có lỗi xảy ra'));
      }
    } catch (error) {
      console.error('Error updating result:', error);
      toast.error('Có lỗi xảy ra khi cập nhật kết quả');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const validatePercentage = (_, value) => {
    if (value < 0 || value > 100) {
      return Promise.reject(new Error('Giá trị phải từ 0 đến 100'));
    }
    return Promise.resolve();
  };

  const validateMarkersMatched = (_, value) => {
    const markersTested = form.getFieldValue('markers_tested');
    if (value > markersTested) {
      return Promise.reject(new Error('Số markers trùng khớp không được lớn hơn số markers được kiểm tra'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExperimentOutlined className="text-purple-600" />
          <span>Cập nhật kết quả xét nghiệm ADN</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Spin spinning={loading || updateResultLoading}>
        {resultData && (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <Card size="small" className="bg-gray-50">
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">Mã kết quả:</Text>
                  <div><Text code>{resultData._id?.slice(-8)}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Mã cuộc hẹn:</Text>
                  <div><Text code>{resultData.appointment_id?._id?.slice(-8)}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Kỹ thuật viên:</Text>
                  <div>{resultData.laboratory_technician_id?.first_name} {resultData.laboratory_technician_id?.last_name}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Trạng thái hiện tại:</Text>
                  <div>
                    <Tag color={resultData.is_match ? 'success' : 'error'}>
                      {resultData.is_match ? 'Có quan hệ huyết thống' : 'Không có quan hệ huyết thống'}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>

            <Divider />

            {/* Form cập nhật */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Row gutter={[24, 16]}>
                <Col span={24}>
                  <Form.Item
                    name="is_match"
                    label={
                      <Space>
                        <CheckCircleOutlined />
                        <span>Kết quả so khớp ADN</span>
                      </Space>
                    }
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Có quan hệ huyết thống"
                      unCheckedChildren="Không có quan hệ huyết thống"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="probability"
                    label={
                      <Space>
                        <PercentageOutlined />
                        <span>Xác suất (%)</span>
                      </Space>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập xác suất' },
                      { validator: validatePercentage }
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      precision={2}
                      className="w-full"
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="dna_match_percentage"
                    label={
                      <Space>
                        <PercentageOutlined />
                        <span>Tỷ lệ trùng khớp ADN (%)</span>
                      </Space>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập tỷ lệ trùng khớp' },
                      { validator: validatePercentage }
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      precision={2}
                      className="w-full"
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="markers_tested"
                    label={
                      <Space>
                        <InfoCircleOutlined />
                        <span>Số markers được kiểm tra</span>
                      </Space>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập số markers được kiểm tra' },
                      { type: 'number', min: 1, message: 'Số markers phải lớn hơn 0' }
                    ]}
                  >
                    <InputNumber
                      min={1}
                      className="w-full"
                      placeholder="Ví dụ: 24"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="markers_matched"
                    label={
                      <Space>
                        <CheckCircleOutlined />
                        <span>Số markers trùng khớp</span>
                      </Space>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập số markers trùng khớp' },
                      { type: 'number', min: 0, message: 'Số markers phải lớn hơn hoặc bằng 0' },
                      { validator: validateMarkersMatched }
                    ]}
                  >
                    <InputNumber
                      min={0}
                      className="w-full"
                      placeholder="Ví dụ: 22"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="confidence_interval"
                    label={
                      <Space>
                        <InfoCircleOutlined />
                        <span>Khoảng tin cậy</span>
                      </Space>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập khoảng tin cậy' }
                    ]}
                  >
                    <Input
                      placeholder="Ví dụ: 99.9% - 100%"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="notes"
                    label="Ghi chú bổ sung"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập ghi chú hoặc thông tin bổ sung về kết quả xét nghiệm..."
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <div className="flex justify-end gap-3">
                <Button onClick={handleCancel}>
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading || updateResultLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Cập nhật kết quả
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalEditResult;
