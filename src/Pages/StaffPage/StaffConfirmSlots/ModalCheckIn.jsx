import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import useAppointment from '../../../Hooks/useAppoinment';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const ModalCheckIn = ({ open, onClose, appointmentId, onSuccess }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { checkIn } = useAppointment();

  const handleCheckIn = async () => {
    if (!note.trim()) {
      toast.error('Vui lòng nhập ghi chú check-in');
      return;
    }

    setLoading(true);
    try {
      const result = await checkIn(appointmentId, note.trim());
      if (result.success) {
        toast.success('Check-in thành công!');
        setNote('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Check-in thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNote('');
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CheckCircleOutlined className="text-green-600" />
          <span>Check-in tại địa điểm</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="checkin"
          type="primary"
          loading={loading}
          onClick={handleCheckIn}
          icon={<CheckCircleOutlined />}
        >
          Check-in
        </Button>,
      ]}
      width={500}
    >
      <div className="py-4">
        <p className="mb-4 text-gray-600">
          Ghi lại thông tin check-in tại địa điểm cuộc hẹn. Điều này đặc biệt hữu ích cho các cuộc hẹn tại nhà 
          để xác nhận nhân viên đã đến nơi.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú check-in <span className="text-red-500">*</span>
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú về tình trạng check-in (ví dụ: Đã đến địa điểm, khách hàng có mặt)"
            rows={4}
            maxLength={500}
            showCount
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Thông tin check-in sẽ được lưu lại để theo dõi tiến trình thực hiện cuộc hẹn.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCheckIn;
