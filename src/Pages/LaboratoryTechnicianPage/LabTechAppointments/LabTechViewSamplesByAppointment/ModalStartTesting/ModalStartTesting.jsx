import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, message, Space, Typography, Card, Row, Col, Tag, Input } from 'antd';
import { ExperimentOutlined, WarningOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useResult from '../../../../../Hooks/useResult';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ModalStartTesting = ({ open, onClose, samples, onSuccess }) => {
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [notes, setNotes] = useState('');
  const { startTesting, startTestingLoading, startTestingError, resetStartTestingState } = useResult();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedSampleIds([]);
      setCheckAll(false);
      setIndeterminate(false);
      resetStartTestingState();
    }
  }, [open, resetStartTestingState]);

  // Update checkAll state based on selected samples
  useEffect(() => {
    const receivedSamples = samples.filter(sample => sample.status === 'received');
    setIndeterminate(selectedSampleIds.length > 0 && selectedSampleIds.length < receivedSamples.length);
    setCheckAll(selectedSampleIds.length === receivedSamples.length && receivedSamples.length > 0);
  }, [selectedSampleIds, samples]);

  const handleSampleChange = (sampleId, checked) => {
    if (checked) {
      setSelectedSampleIds(prev => [...prev, sampleId]);
    } else {
      setSelectedSampleIds(prev => prev.filter(id => id !== sampleId));
    }
  };

  const handleCheckAllChange = (e) => {
    const receivedSamples = samples.filter(sample => sample.status === 'received');
    if (e.target.checked) {
      setSelectedSampleIds(receivedSamples.map(sample => sample._id));
    } else {
      setSelectedSampleIds([]);
    }
  };

  const handleStartTesting = async () => {
    if (selectedSampleIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một mẫu để bắt đầu xét nghiệm');
      return;
    }

    const testingData = {
      testing_start_date: new Date().toISOString(),
      notes: notes || "Bắt đầu quy trình xét nghiệm DNA",
      sample_ids: selectedSampleIds
    };

    try {
      const result = await startTesting(testingData);
      if (result.success) {
        // Kiểm tra kết quả chi tiết
        const { data } = result;
        const successCount = data.results.filter(r => r.success).length;
        const failedCount = data.results.filter(r => !r.success).length;
        
        if (successCount > 0 && failedCount === 0) {
          // Tất cả thành công
          toast.success(`Đã bắt đầu xét nghiệm thành công cho ${successCount} mẫu!`);
          onSuccess();
          onClose();
        } else if (successCount > 0 && failedCount > 0) {
          // Một phần thành công
          toast.warning(`Đã bắt đầu xét nghiệm cho ${successCount} mẫu, ${failedCount} mẫu thất bại`);
          
          // Hiển thị chi tiết lỗi
          data.results.forEach(result => {
            if (!result.success) {
              toast.error(`Mẫu ${result.id.slice(-6)}: ${result.error}`, {
                autoClose: 8000,
              });
            }
          });
          
          // Đóng modal sau khi hiển thị lỗi
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          // Tất cả thất bại
          toast.error(`Không thể bắt đầu xét nghiệm cho bất kỳ mẫu nào. ${failedCount} mẫu thất bại`);
          
          // Hiển thị chi tiết lỗi
          data.results.forEach(result => {
            if (!result.success) {
              toast.error(`Mẫu ${result.id.slice(-6)}: ${result.error}`, {
                autoClose: 8000,
              });
            }
          });
        }
      } else {
        toast.error(result.error || 'Không thể bắt đầu quy trình xét nghiệm');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi bắt đầu quy trình xét nghiệm');
    }
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

  const receivedSamples = samples.filter(sample => sample.status === 'received');
  const nonReceivedSamples = samples.filter(sample => sample.status !== 'received');

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExperimentOutlined className="text-purple-600" />
          <span>Bắt đầu quy trình xét nghiệm</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="start"
          type="primary"
          icon={<ExperimentOutlined />}
          loading={startTestingLoading}
          disabled={selectedSampleIds.length === 0}
          onClick={handleStartTesting}
        >
          Bắt đầu xét nghiệm ({selectedSampleIds.length} mẫu)
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {/* Info Alert */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <WarningOutlined className="text-blue-600 mt-1" />
            <div>
              <Text strong className="text-blue-800">Thông tin quy trình xét nghiệm</Text>
              <div className="text-blue-700 mt-1">
                Bắt đầu quy trình xét nghiệm sẽ thay đổi trạng thái của các mẫu đã chọn thành "ĐANG XÉT NGHIỆM" 
                và cập nhật trạng thái cuộc hẹn tương ứng. Chỉ các mẫu có trạng thái "ĐÃ NHẬN" mới có thể được xét nghiệm.
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{samples.length}</div>
                <div className="text-gray-500">Tổng số mẫu</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{receivedSamples.length}</div>
                <div className="text-gray-500">Sẵn sàng xét nghiệm</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{selectedSampleIds.length}</div>
                <div className="text-gray-500">Đã chọn</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Notes Input */}
        <div>
          <Title level={5} className="mb-2">Ghi chú xét nghiệm</Title>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú về quy trình xét nghiệm (tùy chọn)"
            rows={3}
            maxLength={500}
            showCount
          />
        </div>

        {/* Samples Selection */}
        {receivedSamples.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Title level={5} className="mb-0">
                Chọn mẫu để xét nghiệm ({receivedSamples.length} có sẵn)
              </Title>
              <Checkbox
                indeterminate={indeterminate}
                onChange={handleCheckAllChange}
                checked={checkAll}
              >
                Chọn tất cả
              </Checkbox>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <Space direction="vertical" size="small" className="w-full">
                {receivedSamples.map((sample) => (
                  <Card key={sample._id} size="small" className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedSampleIds.includes(sample._id)}
                          onChange={(e) => handleSampleChange(sample._id, e.target.checked)}
                        />
                        <div className="flex items-center gap-2">
                          <Text code className="text-xs">{sample._id.slice(-6)}</Text>
                          <Tag color={getTypeColor(sample.type)} size="small">
                            {sample.type === 'blood' ? 'MÁU' : sample.type === 'saliva' ? 'NƯỚC BỌT' : sample.type === 'hair' ? 'TÓC' : sample.type.toUpperCase()}
                          </Tag>
                          <Tag color="cyan" size="small">
                            {sample.kit_id?.code}
                          </Tag>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{sample.person_info?.name}</div>
                        <div className="text-xs text-gray-500">{sample.person_info?.relationship}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          </div>
        )}

        {/* Non-received samples info */}
        {nonReceivedSamples.length > 0 && (
          <div>
            <Title level={5} className="text-orange-600">
              Mẫu chưa sẵn sàng để xét nghiệm ({nonReceivedSamples.length})
            </Title>
            <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-orange-50">
              <Space direction="vertical" size="small" className="w-full">
                {nonReceivedSamples.map((sample) => (
                  <div key={sample._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Text code className="text-xs">{sample._id.slice(-6)}</Text>
                      <Tag color={getTypeColor(sample.type)} size="small">
                        {sample.type === 'blood' ? 'MÁU' : sample.type === 'saliva' ? 'NƯỚC BỌT' : sample.type === 'hair' ? 'TÓC' : sample.type.toUpperCase()}
                      </Tag>
                      <Tag color={getStatusColor(sample.status)} size="small">
                        {(() => {
                          switch (sample.status) {
                            case 'pending': return 'CHỜ XỬ LÝ';
                            case 'collected': return 'ĐÃ THU THẬP';
                            case 'received': return 'ĐÃ NHẬN';
                            case 'processing': return 'ĐANG XỬ LÝ';
                            case 'completed': return 'HOÀN THÀNH';
                            case 'failed': return 'THẤT BẠI';
                            default: return sample.status.toUpperCase();
                          }
                        })()}
                      </Tag>
                    </div>
                    <Text className="text-sm">{sample.person_info?.name}</Text>
                  </div>
                ))}
              </Space>
            </div>
          </div>
        )}

        {/* Error display */}
        {startTestingError && (
          <Card className="bg-red-50 border-red-200">
            <Text type="danger">{startTestingError}</Text>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default ModalStartTesting;
