import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, Button, message, Space, Typography, 
  Card, Row, Col, Tag, Switch, InputNumber, Select
} from 'antd';
import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
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
        message.success('Test result created successfully!');
        onSuccess();
        onClose();
      } else {
        message.error(result.error || 'Failed to create test result');
      }
    } catch (error) {
      message.error('An error occurred while creating the test result');
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
          <span>Create Test Result</span>
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
              <Text strong className="text-blue-800">Test Result Creation</Text>
              <div className="text-blue-700 mt-1">
                Create a new test result with automatic PDF report generation. 
                The report will include detailed information about the test and results.
              </div>
            </div>
          </div>
        </Card>

        {/* Sample Information */}
        <Card title="Sample Information" size="small">
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
                label="DNA Match Result"
                rules={[{ required: true, message: 'Please select match result' }]}
              >
                <Switch
                  checkedChildren="Match"
                  unCheckedChildren="No Match"
                  defaultChecked
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confidence_level"
                label="Confidence Level"
                rules={[{ required: true, message: 'Please select confidence level' }]}
              >
                <Select placeholder="Select confidence level">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="very_high">Very High</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="probability"
                label="Probability (%)"
                rules={[{ required: true, message: 'Please enter probability' }]}
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
                label="DNA Match Percentage (%)"
                rules={[{ required: true, message: 'Please enter DNA match percentage' }]}
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
                label="Markers Tested"
                rules={[{ required: true, message: 'Please enter markers tested' }]}
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
                label="Markers Matched"
                rules={[{ required: true, message: 'Please enter markers matched' }]}
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
            label="Confidence Interval"
            rules={[{ required: true, message: 'Please enter confidence interval' }]}
          >
            <Input placeholder="99.9% - 100%" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Additional Notes (Optional)"
          >
            <TextArea
              rows={4}
              placeholder="Enter any additional notes about the test results..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<FileTextOutlined />}
              >
                Create Result & Generate PDF
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateResultModal;
