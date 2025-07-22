import React from 'react';
import { Modal, Button, Descriptions, Progress, Divider, Card } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useResult from '../../../../../Hooks/useResult';

const ModalViewResult = ({ 
  open, 
  onClose, 
  appointmentId, 
  appointmentStatus 
}) => {
  const { 
    resultData, 
    resultLoading, 
    getResultByAppointment 
  } = useResult();

  // Handle View Result
  const handleViewResult = async () => {
    try {
      const res = await getResultByAppointment(appointmentId);
      console.log('API Response:', res); // Debug log
      
      if (res && res.success) {
        toast.success('Kết quả đã được tải thành công!');
      } else {
        console.log('API returned but failed:', res);
        toast.error("Không thể tải kết quả test");
      }
    } catch (error) {
      console.error('Error loading result:', error);
      toast.error("Có lỗi xảy ra khi tải kết quả");
    }
  };

  // Handle Download PDF
  const handleDownloadPDF = async () => {
    try {
      if (resultData?.report_url) {
        window.open(resultData.report_url, '_blank');
        toast.success('Đang mở file PDF...');
      } else {
        // Alternative download method
        const response = await fetch(`/api/results/${appointmentId}/download-pdf`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `DNA_Result_${appointmentId}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          toast.success('Tải PDF thành công!');
        } else {
          toast.error("Không tìm thấy link tải PDF");
        }
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Có lỗi xảy ra khi tải PDF");
    }
  };

  // Load result when modal opens
  React.useEffect(() => {
    if (open && appointmentId && !resultData && !resultLoading) {
      handleViewResult();
    }
  }, [open, appointmentId, resultData, resultLoading]);

  // Debug log for resultData
  React.useEffect(() => {
    console.log('Current resultData:', resultData);
  }, [resultData]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-600" />
          <span>Kết quả xét nghiệm DNA</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700"
          disabled={!resultData}
        >
          Tải PDF
        </Button>
      ]}
      width={900}
      centered
    >
      {resultLoading ? (
        <div className="text-center py-8">
          <Progress type="circle" percent={50} />
          <p className="mt-4 text-gray-500">Đang tải kết quả...</p>
        </div>
      ) : resultData ? (
        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">Thông tin khách hàng</h4>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên khách hàng">
                {resultData.customer_id ? `${resultData.customer_id.first_name} ${resultData.customer_id.last_name}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {resultData.customer_id?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {resultData.customer_id?.phone_number || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {resultData.customer_id?.dob ? 
                  new Date(resultData.customer_id.dob).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {resultData.customer_id?.address || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Sample Details */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">Chi tiết mẫu xét nghiệm</h4>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã appointment">
                {resultData.appointment_id?._id || appointmentId}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày lấy mẫu">
                {resultData.sample_ids?.[0]?.collection_date ? 
                  new Date(resultData.sample_ids[0].collection_date).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Loại mẫu">
                {resultData.sample_ids?.map(sample => sample.type).join(', ') || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng mẫu">
                {resultData.sample_ids?.[0]?.status || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {resultData.notes || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* DNA Match Results */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">Kết quả so khớp DNA</h4>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tỷ lệ trùng khớp">
                <span className={`text-lg font-bold ${
                  parseFloat(resultData.result_data?.dna_match_percentage) >= 99.5 
                    ? 'text-green-600' 
                    : parseFloat(resultData.result_data?.dna_match_percentage) >= 95
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {resultData.result_data?.dna_match_percentage || '0'}%
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Kết luận">
                <span className={`font-semibold ${
                  resultData.is_match 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {resultData.is_match ? 'Có khả năng quan hệ huyết thống' : 'Không có quan hệ huyết thống'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Độ tin cậy">
                {resultData.result_data?.confidence_interval || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Xác suất">
                {resultData.result_data?.probability ? `${resultData.result_data.probability}%` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Markers được test">
                {resultData.result_data?.markers_tested || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Markers trùng khớp">
                {resultData.result_data?.markers_matched || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hoàn thành">
                {resultData.completed_at ? 
                  new Date(resultData.completed_at).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Kỹ thuật viên phụ trách">
                {resultData.laboratory_technician_id ? 
                  `${resultData.laboratory_technician_id.first_name} ${resultData.laboratory_technician_id.last_name}` : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Additional Results if any */}
          {resultData.sample_ids && resultData.sample_ids.length > 0 && (
            <>
              <Divider />
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Chi tiết người được xét nghiệm</h4>
                <div className="space-y-4">
                  {resultData.sample_ids.map((sample, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tên: {sample.person_info?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Quan hệ: {sample.person_info?.relationship || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Ngày sinh: {sample.person_info?.dob ? new Date(sample.person_info.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Nơi sinh: {sample.person_info?.birth_place || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Quốc tịch: {sample.person_info?.nationality || 'N/A'}</p>
                          <p className="text-sm text-gray-600">CMND/CCCD: {sample.person_info?.identity_document || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Loại mẫu: <span className="font-medium">{sample.type}</span></p>
                        <p className="text-sm text-gray-600">Phương pháp lấy mẫu: <span className="font-medium">{sample.collection_method}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có kết quả xét nghiệm</p>
        </div>
      )}
    </Modal>
  );
};

export default ModalViewResult;
