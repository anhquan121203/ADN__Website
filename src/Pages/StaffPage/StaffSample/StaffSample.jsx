import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEdit, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { searchSamples, updateFilters, resetFilters } from '../../../Feartures/sample/sampleSlice';
import FilterSample from './FilterSample';

const StaffSample = () => {
  const dispatch = useDispatch();
  const { isLoading, error, filters } = useSelector((state) => ({
    isLoading: state.sample.isLoading,
    error: state.sample.error,
    filters: state.sample.filters
  }));
  
  const [samples, setSamples] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const [localFilters, setLocalFilters] = useState({
    status: '',
    type: '',
    appointmentId: '',
    kitCode: '',
    personName: '',
    startDate: '',
    endDate: '',
  });

  // Initialize filters from Redux
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch samples when component mounts or filters/page change
  const loadSamples = async () => {
    try {
      const params = {
        ...localFilters,
        page: pagination.current,
        pageSize: pagination.pageSize
      };
      
      const result = await dispatch(searchSamples(params)).unwrap();
      
      if (result && result.data) {
        setSamples(result.data.pageData || []);
        if (result.data.pageInfo) {
          setPagination(prev => ({
            ...prev,
            total: result.data.pageInfo.totalItems || 0
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch samples:', err);
    }
  };

  useEffect(() => {
    loadSamples();
  }, [localFilters, pagination.current, pagination.pageSize]);

  const handleTableChange = (paginationTable) => {
    setPagination({
      current: paginationTable.current,
      pageSize: paginationTable.pageSize,
      total: pagination.total
    });
  };

  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    dispatch(updateFilters({ ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      type: '',
      appointmentId: '',
      kitCode: '',
      personName: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(resetFilters);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    dispatch(resetFilters());
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'orange',
      collected: 'blue',
      processing: 'purple',
      completed: 'green',
      rejected: 'red',
      testing: 'cyan',
      received: 'magenta',
    };

    const statusLabels = {
      pending: 'Chờ xử lý',
      collected: 'Đã thu thập',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      rejected: 'Từ chối',
      testing: 'Đang kiểm tra',
      received: 'Đã nhận',
    };

    return (
      <Tag color={statusColors[status] || 'default'} className="capitalize">
        {statusLabels[status] || status}
      </Tag>
    );
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      blood: 'Máu',
      saliva: 'Nước bọt',
      tissue: 'Mô',
      hair: 'Tóc',
    };
    return typeLabels[type] || type;
  };

  const columns = [
    {
      title: 'Mã mẫu',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => record.code || record._id?.substring(0, 8) || 'N/A',
      sorter: (a, b) => (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: 'Tên người dùng',
      dataIndex: ['person_info', 'name'],
      key: 'personName',
      render: (text) => text || 'N/A',
      sorter: (a, b) => (a.person_info?.name || '').localeCompare(b.person_info?.name || ''),
    },
    {
      title: 'Loại mẫu',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getTypeLabel(type),
      filters: [
        { text: 'Máu', value: 'blood' },
        { text: 'Nước bọt', value: 'saliva' },
        { text: 'Mô', value: 'tissue' },
        { text: 'Tóc', value: 'hair' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Ngày thu thập',
      dataIndex: 'collection_date',
      key: 'collectionDate',
      render: (date) =>
        date ? (
          <Space>
            <FaCalendarAlt className="text-gray-400" />
            {format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </Space>
        ) : (
          'N/A'
        ),
      sorter: (a, b) => new Date(a.collection_date) - new Date(b.collection_date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đã thu thập', value: 'collected' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
              <Tooltip title="Xem mẫu">
                <Button 
                  type="link" 
                  icon={<FaEye />} 
                  onClick={() => handleViewSample(record.appointment_id?._id || record.appointment_id)} 
                />
              </Tooltip>
        </Space>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleViewSample = (appointmentId) => {
    navigate(`/staff/samples/appointment/${appointmentId}`);
  };

  if (isLoading && !samples.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Có lỗi xảy ra khi tải dữ liệu: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý mẫu xét nghiệm</h1>
        <p className="text-gray-600 mt-1">Xem và quản lý các mẫu xét nghiệm trong hệ thống</p>
      </div>

      {/* Filter Section */}
      <FilterSample 
        filters={localFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Samples Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
        <Table
          columns={columns}
          dataSource={Array.isArray(samples) ? samples : []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} mục`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default StaffSample;
