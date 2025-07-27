import React, { useState } from 'react';
import { Modal, Input, Button, Select } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import useAppointment from '../../../Hooks/useAppoinment';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Option } = Select;

const ModalAddNote = ({ open, onClose, appointmentId, onSuccess }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNote } = useAppointment();

  // Các template ghi chú phổ biến
  const noteTemplates = [
    'Khách hàng không có ở nhà, sẽ quay lại vào 3h chiều',
    'Khách hàng yêu cầu dời lịch sang tuần tới do bận việc',
    'Địa chỉ không chính xác, đã liên hệ khách hàng để xác nhận',
    'Khách hàng đã sẵn sàng, tiến hành lấy mẫu',
    'Có vấn đề với thiết bị, cần hỗ trợ kỹ thuật',
  ];

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error('Vui lòng nhập nội dung ghi chú');
      return;
    }

    setLoading(true);
    try {
      const result = await addNote(appointmentId, note.trim());
      if (result.success) {
        toast.success('Đã thêm ghi chú thành công!');
        setNote('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Thêm ghi chú thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm ghi chú');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNote('');
    onClose();
  };

  const handleTemplateSelect = (template) => {
    setNote(template);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-600" />
          <span>Thêm ghi chú cuộc hẹn</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="addnote"
          type="primary"
          loading={loading}
          onClick={handleAddNote}
          icon={<FileTextOutlined />}
        >
          Thêm ghi chú
        </Button>,
      ]}
      width={600}
    >
      <div className="py-4">
        <p className="mb-4 text-gray-600">
          Thêm ghi chú cho cuộc hẹn để lưu lại thông tin quan trọng như:
        </p>
        
        <ul className="list-disc list-inside mb-4 text-sm text-gray-600">
          <li>Giao tiếp với khách hàng</li>
          <li>Hướng dẫn đặc biệt</li>
          <li>Các vấn đề gặp phải</li>
          <li>Lý do hoãn lịch</li>
        </ul>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mẫu ghi chú nhanh
          </label>
          <Select
            placeholder="Chọn mẫu ghi chú có sẵn (tùy chọn)"
            style={{ width: '100%' }}
            onChange={handleTemplateSelect}
            allowClear
          >
            {noteTemplates.map((template, index) => (
              <Option key={index} value={template}>
                {template}
              </Option>
            ))}
          </Select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung ghi chú <span className="text-red-500">*</span>
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập nội dung ghi chú chi tiết..."
            rows={4}
            maxLength={1000}
            showCount
          />
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Ghi chú sẽ được lưu vào lịch sử cuộc hẹn và có thể xem lại sau này.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddNote;
