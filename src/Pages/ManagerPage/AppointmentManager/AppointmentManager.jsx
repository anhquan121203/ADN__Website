import React, { useEffect, useState } from 'react';
import { Table, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { EyeOutlined } from '@ant-design/icons';
import AppointmentFilter from './AppointmentFilter';
import './AppointmentManager.css';

const AppointmentManager = () => {
  const navigate = useNavigate();
  const { appointments, loading, pageInfo, getAppointments } = useAppointment();
  const [filters, setFilters] = useState({
    pageNum: 1,
    pageSize: 10
  });

  const fetchAppointments = async (params = {}) => {
    await getAppointments({ ...filters, ...params });
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleViewDetail = (id) => {
    navigate(`/manager/appointments/${id}`);
  };

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'user_id',
      key: 'user_name',
      render: (user) => user ? `${user.first_name} ${user.last_name}` : '',
      className: 'font-medium',
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['service_id', 'name'],
      key: 'service_name',
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',     
      render: (type) => {
        let label = '';
        let color = '';
        switch (type) {
          case 'facility':
            label = 'Tại phòng khám';
            color = 'bg-blue-100 text-blue-800';
            break;
          case 'home':
            label = 'Tại nhà';
            color = 'bg-purple-100 text-purple-800';
            break;
          case 'self':
            label = 'Tự lấy mẫu';
            color = 'bg-green-100 text-green-800';
            break;
          default:
            label = type;
            color = 'bg-gray-100 text-gray-800';
        }
        return (
          <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
        'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Đang chờ' },
        'confirmed': { color: 'bg-blue-100 text-blue-800', text: 'Đã xác nhận' },
        'completed': { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' },
        'cancelled': { color: 'bg-red-100 text-red-800', text: 'Đã hủy' },
        'sample_collected': { color: 'bg-purple-100 text-purple-800', text: 'Đã lấy mẫu' },
        'sample_received': { color: 'bg-indigo-100 text-indigo-800', text: 'Đã nhận mẫu' },
        'sample_assigned': { color: 'bg-pink-100 text-pink-800', text: 'Đã phân công mẫu' },
        };
        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
        return (
          <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',      
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record._id)}
          className="bg-[#00a9a4] hover:bg-[#1c6b68] border-none rounded-md flex items-center"
        >
          Chi tiết
        </Button>
      ),
      align: 'center',
    },
  ];
  const handleFilter = (filterValues) => {
    setFilters(prev => ({
      ...prev,
      ...filterValues,
      pageNum: 1, // Reset to first page when filtering
    }));
  };
  return (
    <div className="p-6 container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý lịch hẹn</h1>
        <AppointmentFilter onFilter={handleFilter} />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.totalItems,
            onChange: (page, pageSize) => {
              setFilters(prev => ({
                ...prev,
                pageNum: page,
                pageSize: pageSize
              }));
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} lịch hẹn`,
            className: "p-4"
          }}
          className="ant-table-custom"
          rowClassName="hover:bg-gray-50"
        />
      </div>
    </div>
  );
};

export default AppointmentManager;
