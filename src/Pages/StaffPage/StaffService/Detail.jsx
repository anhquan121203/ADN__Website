import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Spin, 
  message, 
  Typography, 
  Divider, 
  Tag, 
  Table, 
  Empty 
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import useStaff from '../../../Hooks/useStaff';
import moment from 'moment';

const { Title, Text } = Typography;

const Detail = ({ id, isModal, onClose }) => {
  const { fetchServiceById, fetchChildServices, loading } = useStaff();
  const [service, setService] = useState(null);
  const [childServices, setChildServices] = useState([]);
  const [loadingChild, setLoadingChild] = useState(false);

  useEffect(() => {
    loadServiceDetails();
  }, [id]);

  const loadServiceDetails = async () => {
    try {
      const result = await fetchServiceById(id);
      if (result.success) {
        setService(result.data.data);
        loadChildServices(id);
      } else {
        message.error('Failed to load service details');
      }
    } catch (error) {
      message.error('An error occurred while loading service details');
    }
  };

  const loadChildServices = async (parentId) => {
    try {
      setLoadingChild(true);
      const result = await fetchChildServices(parentId);
      if (result.success) {
        setChildServices(result.data.data);
      } else {
        message.error('Failed to load child services');
      }
    } catch (error) {
      message.error('An error occurred while loading child services');
    } finally {
      setLoadingChild(false);
    }
  };

  // Remove handleBack function since we're using modal now

  return (
    <div className={isModal ? '' : 'p-6'}>
      {!isModal && <Title level={2}>Service Details</Title>}
      
      {service ? (
        <>
          <Card className="mb-6 shadow-sm">
            <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Service ID" span={3}>
                {service._id}
              </Descriptions.Item>
              
              <Descriptions.Item label="Name">
                {service.name}
              </Descriptions.Item>
              
              <Descriptions.Item label="Type">
                <Tag color={service.type === 'civil' ? 'blue' : 'purple'}>
                  {service.type === 'civil' ? 'Civil' : 'Administrative'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Status">
                {service.is_active ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>
                ) : (
                  <Tag icon={<CloseCircleOutlined />} color="error">Inactive</Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Sample Method">
                {service.sample_method === 'self_collected' && (
                  <Tag color="green">Self Collected</Tag>
                )}
                {service.sample_method === 'facility_collected' && (
                  <Tag color="orange">Facility Collected</Tag>
                )}
                {service.sample_method === 'home_collected' && (
                  <Tag color="cyan">Home Collected</Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Price">
                ${service.price?.toFixed(2) || '0.00'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Estimated Time">
                {service.estimated_time ? (
                  <Tag icon={<ClockCircleOutlined />} color="processing">
                    {service.estimated_time} minutes
                  </Tag>
                ) : (
                  'Not specified'
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Parent Service" span={3}>
                {!service.parent_service_id ? 'None (This is a parent service)' : (service.parent_service_id.name || 'None (This is a parent service)')}
              </Descriptions.Item>
              
              <Descriptions.Item label="Description" span={3}>
                {service.description || 'No description provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Created At">
                {moment(service.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="Updated At">
                {moment(service.updated_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          
          <Divider orientation="left">Child Services</Divider>
          
          {loadingChild ? (
            <div className="flex justify-center items-center p-12">
              <Spin />
            </div>
          ) : childServices && childServices.length > 0 ? (
            <Card className="shadow-sm">
              <Table 
                columns={childColumns} 
                dataSource={childServices} 
                rowKey="_id"
                pagination={false}
              />
            </Card>
          ) : (
            <Empty description="No child services found" />
          )}
        </>
      ) : (
        <div className="flex justify-center items-center p-12">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Detail;

const childColumns = [
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
    render: (price) => `$${price?.toFixed(2) || '0.00'}`,
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
]