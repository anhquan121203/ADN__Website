import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip, Input, Select, DatePicker, Form, Row, Col } from 'antd';
import { EyeOutlined, InboxOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { useNavigate } from 'react-router-dom';
import ModalRequestKit from './ModalRequestKit/ModalRequestKit';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'sample_assigned', label: 'Đã phân mẫu' },
  { value: 'sample_collected', label: 'Đã thu mẫu' },
  { value: 'sample_received', label: 'Đã nhận mẫu' },
  { value: 'testing', label: 'Đang xét nghiệm' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'self', label: 'Tự đến' },
  { value: 'facility', label: 'Tại cơ sở' },
  { value: 'home', label: 'Tại nhà' },
];

const StaffConfirmSlots = () => {
  const {
    staffAssignedAppointments,
    staffAssignedPageInfo,
    getStaffAssignedAppointments,
    loading
  } = useAppointment();

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [dateRange, setDateRange] = useState([]); // [start, end]
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState({});

  // Only fetch when filterParams changes (i.e. when user clicks search)
  useEffect(() => {
    getStaffAssignedAppointments({
      pageNum,
      pageSize,
      ...filterParams
    });
  }, [pageNum, pageSize, filterParams]);

  const handleSearch = () => {
    const params = {};
    if (status) params.status = status;
    if (type) params.type = type;
    if (dateRange && dateRange.length === 2) {
      params.start_date = dayjs(dateRange[0]).format('YYYY-MM-DD');
      params.end_date = dayjs(dateRange[1]).format('YYYY-MM-DD');
    }
    if (searchTerm) params.search_term = searchTerm;
    setPageNum(1); // reset to first page on new search
    setFilterParams(params);
  };

  const handleReset = () => {
    setStatus('');
    setType('');
    setDateRange([]);
    setSearchTerm('');
    setPageNum(1);
    setFilterParams({});
  };

  const handleReceiveKit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleModalSuccess = () => {
    getStaffAssignedAppointments({ pageNum, pageSize, ...filterParams });
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['user_id', 'email'],
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.user_id?.first_name} {record.user_id?.last_name}
          </div>
          <div className="text-sm text-gray-500">
            {record.user_id?.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['service_id', 'name'],
      key: 'service',
      width: 150,
      render: (_, record) => (
        <span className="text-gray-900">
          {record.service_id?.name}
        </span>
      ),
    },
    {
      title: 'Ngày đặt lịch',
      dataIndex: 'appointment_date',
      key: 'date',
      width: 150,
      render: (date) => (
        <span className="text-gray-700">
          {new Date(date).toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeColors = {
          'self': 'bg-blue-100 text-blue-800',
          'facility': 'bg-green-100 text-green-800',
          'home': 'bg-purple-100 text-purple-800'
        };
        const typeLabels = {
          'self': 'Tự đến',
          'facility': 'Tại cơ sở',
          'home': 'Tại nhà'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
            {typeLabels[type] || type}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusColors = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'confirmed': 'bg-blue-100 text-blue-800',
          'sample_assigned': 'bg-indigo-100 text-indigo-800',
          'sample_collected': 'bg-orange-100 text-orange-800',
          'sample_received': 'bg-cyan-100 text-cyan-800',
          'testing': 'bg-purple-100 text-purple-800',
          'completed': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800'
        };
        const statusLabels = {
          'pending': 'Chờ xác nhận',
          'confirmed': 'Đã xác nhận',
          'sample_assigned': 'Đã phân mẫu',
          'sample_collected': 'Đã thu mẫu',
          'sample_received': 'Đã nhận mẫu',
          'testing': 'Đang xét nghiệm',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusLabels[status] || status}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate(`/staff/appointment/view/${record._id}`)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>

          {record.type === 'facility' && record.status !== 'sample_collected' && record.status !== 'sample_received' && (
            <Tooltip title="Nhận bộ dụng cụ">
              <Button
                type="text"
                icon={<InboxOutlined />}
                onClick={() => handleReceiveKit(record)}
                className="text-orange-600 hover:text-orange-800"
              />
            </Tooltip>
          )}

          {record.type === 'facility' && (record.status === 'sample_collected' || record.status === 'sample_received') && (
            <Tooltip title="Xem mẫu">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/staff/appointment/samples/${record._id}`)}
                className="text-green-600 hover:text-green-800"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <h2 className="text-xl font-semibold mb-6">Danh sách cuộc hẹn đã phân công</h2>
      
      {/* Filter Form */}
        <Form className="bg-white p-4 mb-4 w-full max-w-[1200px] mx-auto">
          <Row gutter={[16, 16]} align="bottom">
            <Col span={6}>
              <Form.Item label="Trạng thái" className="mb-3">
                <Select 
                  value={status} 
                  onChange={setStatus} 
                  placeholder="Chọn trạng thái"
                  allowClear
                  style={{ width: '100%' }}
                >
                  {statusOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Loại" className="mb-3">
                <Select 
                  value={type} 
                  onChange={setType} 
                  placeholder="Chọn loại"
                  allowClear
                  style={{ width: '100%' }}
                >
                  {typeOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Khoảng ngày" className="mb-3">
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                  allowEmpty={[true, true]}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Tìm kiếm" className="mb-3">
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên khách hàng, địa chỉ..."
                  allowClear
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  size="middle"
                >
                  Tìm kiếm
                </Button>
                <Button onClick={handleReset} size="middle">
                  Đặt lại
                </Button>
              </div>
            </Col>
          </Row>
        </Form>      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Table
          columns={columns}
          dataSource={staffAssignedAppointments}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: staffAssignedPageInfo.pageNum,
            pageSize: staffAssignedPageInfo.pageSize,
            total: staffAssignedPageInfo.totalItems,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} mục`,
            onChange: (p, ps) => {
              setPageNum(p);
              setPageSize(ps);
            },
          }}
          scroll={{ x: 800 }}
        />
      </div>

      <ModalRequestKit
        open={modalOpen}
        onClose={handleModalClose}
        appointmentId={selectedAppointment?._id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default StaffConfirmSlots;
