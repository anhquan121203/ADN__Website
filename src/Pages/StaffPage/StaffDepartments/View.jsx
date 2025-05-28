import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Spin, message, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useStaff from '../../../Hooks/useStaff';
import Search from './Search';
import moment from 'moment';
import Detail from './Detail';

const { Title, Text } = Typography;

const View = () => {
  const { fetchDepartments, fetchDepartmentById, loading } = useStaff();
  const [departments, setDepartments] = useState(null);
  const [searchParams, setSearchParams] = useState({
    is_deleted: false,
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadDepartments = async () => {
    try {
      const params = {
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      
      const result = await fetchDepartments(params);
      
      if (result.success && result.data) {
        setDepartments(result.data);
        if (result.data?.pageInfo?.totalItems) {
          setPagination(prev => ({
            ...prev,
            total: result.data.pageInfo.totalItems
          }));
        }
      }
    } catch (err) {
      message.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [searchParams, pagination.current, pagination.pageSize]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Add handler for viewing details
  const handleViewDetails = async (departmentId) => {
    try {
      const result = await fetchDepartmentById(departmentId);
      if (result.success) {
        setSelectedDepartment(result.data.data);
        setModalVisible(true);
      } else {
        message.error('Failed to load department details');
      }
    } catch (err) {
      message.error('An error occurred while loading department details');
    }
  };

  const handleTableChange = (pagination, sorter) => {
    setPagination(pagination);
    
    // Handle sorting
    if (sorter && sorter.field) {
      setSearchParams(prev => ({
        ...prev,
        sort_by: sorter.field,
        sort_order: sorter.order === 'ascend' ? 'asc' : 'desc'
      }));
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Manager',
      dataIndex: 'manager_id',
      key: 'manager',
      render: (manager) => (
        <span>{`${manager.first_name} ${manager.last_name}`}</span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          className='bg-black text-white'
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record._id)}
          size="large"
        >
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Department Management</Title>
      </div>
      
      <Search onSearch={handleSearch} />
      
      <Card className="shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={departments?.data?.pageData || []}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: departments?.data?.pageInfo?.totalItems || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
      <Detail
        department={selectedDepartment}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        loading={loading}
      />
    </div>
  );
};

export default View;
