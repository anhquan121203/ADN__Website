import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, message, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../../Feartures/staff/staffSlice';
import Search from './Search';
import moment from 'moment';

const View = () => {
  const dispatch = useDispatch();
  // Fix the selector to handle undefined state
  const staffState = useSelector((state) => state.staff) || {};
  const { appointments, loading, error } = staffState;
  
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [searchParams, pagination.current, pagination.pageSize]);

  const fetchAppointments = async () => {
    try {
      const params = {
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      
      await dispatch(getAppointments(params)).unwrap();
    } catch (err) {
      message.error('Failed to fetch appointments');
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    setPagination(prev => ({
      ...prev,
      current: 1 // Reset to first page when searching
    }));
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  };

  const getStatusTag = (status) => {
    const statusColors = {
      pending: 'gold',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    const statusLabels = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return (
      <Tag color={statusColors[status] || 'default'}>
        {statusLabels[status] || status}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span className="text-xs">{id.substring(0, 8)}...</span>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div>
          <div className="font-medium">{customer?.name || 'Không có'}</div>
          <div className="text-xs text-gray-500">{customer?.email || 'Không có'}</div>
        </div>
      ),
    },
    {
      title: 'Loại lịch hẹn',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      render: (type) => {
        const typeLabels = {
          self: 'Tự đến',
          facility: 'Tại cơ sở',
          home: 'Tại nhà'
        };
        return <span className="capitalize">{typeLabels[type] || 'Không có'}</span>;
      },
    },
    {
      title: 'Ngày & Giờ',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (date) => (
        <div>
          <div>{moment(date).format('DD/MM/YYYY')}</div>
          <div className="text-xs text-gray-500">{moment(date).format('HH:mm')}</div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ lấy mẫu',
      dataIndex: 'collection_address',
      key: 'collection_address',
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip title={address}>
          <span>{address || 'Không có'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            className="text-blue-500 hover:text-blue-700"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-green-500 hover:text-green-700"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            className="text-red-500 hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h1>
      </div>
      
      <Search onSearch={handleSearch} />
      
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">
            {error}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={appointments?.data?.pageData || []}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: appointments?.data?.pageInfo?.totalItems || 0,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} mục`,
            }}
            onChange={handleTableChange}
            className="w-full"
            scroll={{ x: 'max-content' }}
          />
        )}
      </div>
    </div>
  );
};

export default View;
