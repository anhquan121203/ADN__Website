import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, message, Card, Typography, Tooltip, Empty, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useStaff from '../../../Hooks/useStaff';
import Search from './Search';
import ServiceDetail from './Detail';

const { Title, Text } = Typography;

const View = () => {
  const { fetchServices, loading } = useStaff();
  const [services, setServices] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({ is_active: true });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });


  const loadServices = async () => {
    try {
      const params = {
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      
      const result = await fetchServices(params);
      
      // Update services state with the data from API
      if (result.success && result.data) {
        setServices(result.data);
        
        // Update pagination total when data is received
        if (result.data?.pageInfo?.totalItems) {
          setPagination(prev => ({
            ...prev,
            total: result.data.pageInfo.totalItems
          }));
        }
      }
    } catch (err) {
      message.error('Failed to fetch services');
    }
  };
  
  useEffect(() => {
    loadServices();
  }, [searchParams, pagination.current, pagination.pageSize]);

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

  const handleViewDetails = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedServiceId(null);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'civil' ? 'blue' : 'purple'}>
          {type === 'civil' ? 'Civil' : 'Administrative'}
        </Tag>
      ),
    },
    {
      title: 'Sample Method',
      dataIndex: 'sample_method',
      key: 'sample_method',
      render: (method) => {
        const colors = {
          self_collected: 'green',
          facility_collected: 'orange',
          home_collected: 'cyan'
        };
        const labels = {
          self_collected: 'Self Collected',
          facility_collected: 'Facility Collected',
          home_collected: 'Home Collected'
        };
        return <Tag color={colors[method]}>{labels[method]}</Tag>;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip title={description}>
          <Text ellipsis style={{ maxWidth: 200 }}>{description}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
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
        <Title level={2}>Service Management</Title>
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
            dataSource={services?.data?.pageData || []}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: services?.data?.pageInfo?.totalItems || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>

      <Modal
        title="Service Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        width={1000}
        footer={null}
      >
        {selectedServiceId && (
          <ServiceDetail id={selectedServiceId} isModal={true} onClose={handleModalClose} />
        )}
      </Modal>
    </div>
  );
};

export default View;
