import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, message, Tag, Table, Modal, Input, Row, Col } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useAppointment } from '../../../Hooks/useAppoinment';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAppointmentDetail, getAvailableStaffList, assignStaff } = useAppointment();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    district: '',
    ward: '',
    street: ''
  });

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      try {
        const result = await getAppointmentDetail(id);
        if (result.success) {
          setAppointment(result.data.data);
        } else {
          message.error('Không thể tải thông tin cuộc hẹn');
        }
      } catch (error) {
        message.error('Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetail();
  }, [id]);

  const fetchAvailableStaff = async (searchAddress = null) => {
    setStaffLoading(true);
    try {
      const params = {
        pageNum: 1,
        pageSize: 10,
      };
      
      // Thêm address filter nếu có
      if (searchAddress) {
        params.address = JSON.stringify(searchAddress);
      }
      const result = await getAvailableStaffList(params);      
      if (result.success) {
        const staffData = result.data?.data?.pageData || [];
        setAvailableStaff(staffData);
      } else {
        message.error('Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      console.error('Error:', error); 
      message.error('Đã có lỗi xảy ra');
    } finally {
      setStaffLoading(false);
    }
  };

const handleClickAssign = (staffId) => {
  setSelectedStaffId(staffId);
  setConfirmVisible(true);
};

const handleAssignStaff = async () => {
  try {
    const result = await assignStaff(id, selectedStaffId);
    if (result.success) {
      message.success('Phân công nhân viên thành công');
      setConfirmVisible(false);
      setIsStaffModalVisible(false);
      const updated = await getAppointmentDetail(id);
      if (updated.success) {
        setAppointment(updated.data.data);
      }
    } else {
      message.error('Không thể phân công nhân viên');
    }
  } catch (error) {
    message.error('Đã có lỗi xảy ra');
  }
};

const handleSearchStaff = () => {
  // Chỉ gửi các field có giá trị
  const addressFilter = {};
  if (searchFilters.city.trim()) addressFilter.city = searchFilters.city.trim();
  if (searchFilters.district.trim()) addressFilter.district = searchFilters.district.trim();
  if (searchFilters.ward.trim()) addressFilter.ward = searchFilters.ward.trim();
  if (searchFilters.street.trim()) addressFilter.street = searchFilters.street.trim();
  
  // Nếu có ít nhất 1 filter thì search, không thì load tất cả
  const hasFilters = Object.keys(addressFilter).length > 0;
  fetchAvailableStaff(hasFilters ? addressFilter : null);
};

const handleClearSearch = () => {
  setSearchFilters({
    city: '',
    district: '',
    ward: '',
    street: ''
  });
  fetchAvailableStaff(null);
};

const handleFilterChange = (field, value) => {
  setSearchFilters(prev => ({
    ...prev,
    [field]: value
  }));
};



  const staffColumns = [
    {
      title: 'Họ và tên',
      key: 'name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          'staff': 'Nhân viên',
          'laboratory_technician': 'Kỹ thuật viên',
          'manager': 'Quản lý'
        };
        return (
          <Tag color={role === 'laboratory_technician' ? 'blue' : role === 'manager' ? 'gold' : 'green'}>
            {roleMap[role] || role}
          </Tag>
        );
      }
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (_, record) => {
        const { address } = record;
        if (!address) return 'Không có';
        return `${address.street || ''}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}, ${address.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        const isAssigned = appointment.staff_id && appointment.staff_id._id === record._id;
    return isAssigned ? (
      <Tag color="green">Đã phân công</Tag>
    ) : (
      <Button
        type="primary"
        onClick={() => handleClickAssign(record._id)}
        className="bg-[#00a9a4] hover:bg-[#1c6b68]"
      >
        Phân công
      </Button>
        );
    },
}
  ];

  const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

  const renderStatusTag = (status) => {
    const map = {
      pending: <Tag color="warning">Đang chờ</Tag>,
      confirmed: <Tag color="processing">Đã xác nhận</Tag>,
      completed: <Tag color="success">Hoàn thành</Tag>,
      cancelled: <Tag color="error">Đã hủy</Tag>,
    };
    return map[status?.toLowerCase()] || <Tag>{status}</Tag>;
  };

  const renderPaymentStatus = (status) => {
    return status === 'paid' ? (
      <Tag color="green">Đã thanh toán</Tag>
    ) : (
      <Tag color="red">Chưa thanh toán</Tag>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Quay lại
        </Button>
        <div className="text-center mt-8 text-gray-600 text-lg">
          Không tìm thấy thông tin cuộc hẹn
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
        Quay lại
      </Button>

      <Card title="Thông tin cuộc hẹn" className="mt-4 shadow">
        <Descriptions column={2} bordered labelStyle={{ width: '200px' }}>
          <Descriptions.Item label="Mã cuộc hẹn">{appointment._id}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{renderStatusTag(appointment.status)}</Descriptions.Item>

          <Descriptions.Item label="Ngày hẹn">
            {formatDate(appointment.appointment_date)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{formatDate(appointment.created_at)}</Descriptions.Item>

          <Descriptions.Item label="Cập nhật lần cuối">{formatDate(appointment.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="Loại hình">
            {{
              facility: 'Tại phòng khám',
              home: 'Tại nhà',
              self: 'Tự lấy mẫu',
            }[appointment.type]}
          </Descriptions.Item>

          {appointment.type === 'home' && (
            <Descriptions.Item label="Địa chỉ lấy mẫu" span={2}>
              {appointment.collection_address || 'Không có'}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Trạng thái thanh toán">
            {renderPaymentStatus(appointment.payment_status)}
          </Descriptions.Item>
          <Descriptions.Item label="Dịch vụ">
            {appointment.service_id?.name} ({appointment.service_id?.price} VNĐ)
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin khách hàng" className="mt-6 shadow">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Họ tên">
            {appointment.user_id?.first_name} {appointment.user_id?.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {appointment.user_id?.phone_number}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {appointment.user_id?.email}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {(appointment.staff_id || appointment.laboratory_technician_id) && (
        <Card title="Nhân sự phụ trách" className="mt-6 shadow">
          <Descriptions column={2} bordered>
            {appointment.staff_id && (
              <Descriptions.Item label="Nhân viên">
                {appointment.staff_id?.first_name} {appointment.staff_id?.last_name}
              </Descriptions.Item>
            )}
            {appointment.laboratory_technician_id && (
              <Descriptions.Item label="Kỹ thuật viên">
                {appointment.laboratory_technician_id.user_id?.first_name}{' '}
                {appointment.laboratory_technician_id.user_id?.last_name}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      <Card title="Quản lý nhân viên" className="mt-6 shadow">
        <Button
          type="primary"
          onClick={() => {
            setIsStaffModalVisible(true);
            fetchAvailableStaff(null);
          }}
          className="bg-[#00a9a4] hover:bg-[#1c6b68]"
        >
          Phân công nhân viên
        </Button>

        <Modal
          title="Chọn nhân viên"
          open={isStaffModalVisible}
          onCancel={() => setIsStaffModalVisible(false)}
          footer={null}
          width={1200}
        >
          {/* Search Form */}
          <Card className="mb-4" size="small">
            <Row gutter={16} className="mb-3">
              <Col span={6}>
                <Input
                  placeholder="Thành phố"
                  value={searchFilters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Input
                  placeholder="Quận/Huyện"
                  value={searchFilters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Input
                  placeholder="Phường/Xã"
                  value={searchFilters.ward}
                  onChange={(e) => handleFilterChange('ward', e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Input
                  placeholder="Đường"
                  value={searchFilters.street}
                  onChange={(e) => handleFilterChange('street', e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={handleSearchStaff}
                  className="mr-2"
                >
                  Tìm kiếm
                </Button>
                <Button 
                  icon={<ClearOutlined />}
                  onClick={handleClearSearch}
                >
                  Xóa bộ lọc
                </Button>
              </Col>
            </Row>
          </Card>

          <Table
            columns={staffColumns}
            dataSource={availableStaff}
            rowKey="_id"
            pagination={false}
            loading={staffLoading}
            scroll={{ x: 800 }}
          />
        </Modal>
      </Card>
<Modal
  title="Xác nhận phân công"
  open={confirmVisible}
  onCancel={() => setConfirmVisible(false)}
  onOk={handleAssignStaff}
  okText="Phân công"
  cancelText="Hủy"
  centered
>
  Bạn có chắc chắn muốn phân công nhân viên này vào lịch hẹn?
</Modal>

    </div>
    
  );
};

export default AppointmentDetail;
