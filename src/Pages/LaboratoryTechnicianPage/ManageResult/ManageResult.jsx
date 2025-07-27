import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, message, Spin, Typography, Input, DatePicker, Select } from 'antd';
import { EyeOutlined, SearchOutlined, ReloadOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAppointment from '../../../Hooks/useAppoinment';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ManageResult = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    dateRange: null,
    status: 'testing', // Default status filter
  });

  const { getLabTechAssignedAppointments } = useAppointment();
  const navigate = useNavigate();

  // Helper function to get status display name
  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'testing':
        return 'Đang xét nghiệm';
      case 'completed':
        return 'Đã hoàn thành';
      case 'complete':
        return 'Hoàn thành';
      default:
        return 'Đang xét nghiệm';
    }
  };

  // Fetch appointments with fixed filters
  const fetchAppointments = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        pageNum: page,
        pageSize: pageSize,
        status: filters.status || 'testing',
        payment_status: 'paid',
      };

      // Add optional params
      if (filters.search) {
        params.search = filters.search;
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.start_date = filters.dateRange[0].format('YYYY-MM-DD');
        params.end_date = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const result = await getLabTechAssignedAppointments(params);
      
      if (result.success) {
        // Fix: API has nested structure result.data.data.pageData
        const appointmentsData = result.data?.data?.pageData || result.data?.pageData || [];
        const pageInfo = result.data?.data?.pageInfo || result.data?.pageInfo || {};
        
        setAppointments(appointmentsData);
        setPagination({
          current: page,
          pageSize,
          total: pageInfo.totalItems || appointmentsData.length,
        });
      } else {
        toast.error(result.error || 'Không thể tải danh sách cuộc hẹn');
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách cuộc hẹn');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Add useEffect to refetch when filters change
  useEffect(() => {
    if (filters.search !== '' || filters.dateRange !== null || filters.status !== 'testing') {
      fetchAppointments(1, pagination.pageSize);
    }
  }, [filters.search, filters.dateRange, filters.status]);

  const handleTableChange = (paginationInfo) => {
    fetchAppointments(paginationInfo.current, paginationInfo.pageSize);
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchAppointments(1, pagination.pageSize);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      dateRange: null,
      status: 'testing', // Reset to default status
    });
    setPagination({ ...pagination, current: 1 });
    setTimeout(() => {
      fetchAppointments(1, pagination.pageSize);
    }, 100);
  };

  const handleViewSamples = (appointmentId) => {
    navigate(`/laboratory_technician/view-samples/${appointmentId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'orange';
      case 'confirmed': return 'blue';
      case 'in_progress': return 'purple';
      case 'testing': return 'cyan';
      case 'completed': return 'green';
      case 'complete': return 'gold';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'orange';
      case 'paid': return 'green';
      case 'failed': return 'red';
      case 'refunded': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      fixed: 'left',
      render: (id) => (
        <code className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
          {id?.slice(-8)}
        </code>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 text-sm">
            {record.user_id?.first_name} {record.user_id?.last_name}
          </div>
          <div className="text-gray-500 text-xs truncate max-w-[180px]">
            {record.user_id?.email}
          </div>
          {record.user_id?.phone_number && (
            <div className="text-gray-500 text-xs">
              {record.user_id.phone_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['service_id', 'name'],
      key: 'service',
      width: 160,
      render: (serviceName, record) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-800 text-sm">{serviceName}</div>
          <div className="text-green-600 text-xs font-semibold">
            {record.service_id?.price} VND
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày & Giờ',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      width: 130,
      render: (date) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-800">
            {moment(date).format('DD/MM/YYYY')}
          </div>
          <div className="text-gray-500 text-xs">
            {moment(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="text-xs font-medium px-2 py-1">
          {(() => {
            switch (status?.toLowerCase()) {
              case 'pending': return 'CHỜ XỬ LÝ';
              case 'confirmed': return 'ĐÃ XÁC NHẬN';
              case 'in_progress': return 'ĐANG TIẾN HÀNH';
              case 'testing': return 'ĐANG XÉT NGHIỆM';
              case 'completed': return 'ĐÃ HOÀN THÀNH';
              case 'complete': return 'HOÀN THÀNH';
              case 'cancelled': return 'ĐÃ HỦY';
              default: return status?.toUpperCase();
            }
          })()}
        </Tag>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 100,
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)} className="text-xs font-medium px-2 py-1">
          {(() => {
            switch (status?.toLowerCase()) {
              case 'pending': return 'CHỜ XỬ LÝ';
              case 'paid': return 'ĐÃ THANH TOÁN';
              case 'failed': return 'THẤT BẠI';
              case 'refunded': return 'ĐÃ HOÀN TIỀN';
              default: return status?.toUpperCase();
            }
          })()}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewSamples(record._id)}
          className="bg-blue-500 hover:bg-blue-600 border-blue-500 text-xs"
        >
          Xem mẫu
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 max-w-full mx-auto min-h-screen">
      <Card className="shadow-sm border-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <Title level={3} className="mb-2 text-gray-800">
              <ExperimentOutlined className="mr-2 text-purple-600" />
              Quản lý kết quả xét nghiệm - {getStatusDisplayName(filters.status)}
            </Title>
            <p className="text-gray-600 text-sm md:text-base">
              Quản lý các cuộc hẹn có trạng thái {getStatusDisplayName(filters.status).toLowerCase()} và đã thanh toán để tạo kết quả
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 border-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Tìm kiếm</label>
              <Input
                placeholder="Tìm kiếm theo tên khách hàng, email hoặc mã cuộc hẹn"
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onPressEnter={handleSearch}
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Trạng thái</label>
              <Select
                className="w-full"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                placeholder="Chọn trạng thái"
              >
                <Select.Option value="testing">Đang xét nghiệm</Select.Option>
                <Select.Option value="completed">Đã hoàn thành</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Khoảng thời gian</label>
              <RangePicker
                className="w-full rounded-lg"
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                format="DD/MM/YYYY"
              />
            </div>
            <div className="flex items-end gap-3">
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 border-blue-500 rounded-lg px-6"
              >
                Tìm kiếm
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                className="rounded-lg px-6"
              >
                Đặt lại
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{pagination.total || 0}</div>
            <div className="text-gray-600 text-sm font-medium">Tổng số cuộc hẹn {getStatusDisplayName(filters.status)}</div>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">
              {appointments.filter(apt => apt.status === filters.status).length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Trạng thái hiện tại</div>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {appointments.filter(apt => apt.payment_status === 'paid').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Đã thanh toán</div>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">
              {appointments.filter(apt => apt.laboratory_technician_id).length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Đã phân công KTV</div>
          </Card>
        </div>

        {/* Table */}
        <Spin spinning={loading}>
          {appointments.length === 0 && !loading ? (
            <Card className="text-center py-12 border-dashed border-2 border-gray-200">
              <div className="text-gray-400 mb-2">
                <ExperimentOutlined style={{ fontSize: '48px' }} />
              </div>
              <p className="text-gray-500 text-lg">Không tìm thấy cuộc hẹn nào</p>
              <p className="text-gray-400 text-sm">Thử điều chỉnh tiêu chí tìm kiếm của bạn</p>
            </Card>
          ) : (
            <Card className="shadow-sm border-0">
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={appointments}
                  rowKey="_id"
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} cuộc hẹn`,
                    responsive: true,
                    className: "custom-pagination",
                  }}
                  onChange={handleTableChange}
                  scroll={{ x: 1200, y: 600 }}
                  size="middle"
                  className="min-w-full custom-table"
                  rowClassName="hover:bg-blue-50 transition-colors duration-200"
                />
              </div>
            </Card>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ManageResult;
