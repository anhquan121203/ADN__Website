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

const typeLabels = {
  civil: 'Dân sự',
  administrative: 'Hành chính'
};

const sampleMethodLabels = {
  self_collected: 'Tự lấy mẫu',
  facility_collected: 'Lấy tại cơ sở',
  home_collected: 'Lấy tại nhà'
};

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
      {!isModal && <Title level={2}>Chi tiết dịch vụ</Title>}
      
      {service ? (
        <>
          <Card className="mb-6 shadow-sm">
            <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Mã dịch vụ" span={3}>
                {service._id}
              </Descriptions.Item>
              
              <Descriptions.Item label="Tên dịch vụ">
                {service.name}
              </Descriptions.Item>
              
              <Descriptions.Item label="Loại">
                <Tag color={service.type === 'civil' ? 'blue' : 'purple'}>
                  {typeLabels[service.type] || service.type}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Trạng thái">
                {service.is_active ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">Đang hoạt động</Tag>
                ) : (
                  <Tag icon={<CloseCircleOutlined />} color="error">Ngừng hoạt động</Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Phương thức lấy mẫu">
                {service.sample_method && (
                  <Tag color={
                    service.sample_method === 'self_collected' ? 'green' :
                    service.sample_method === 'facility_collected' ? 'orange' : 'cyan'
                  }>
                    {sampleMethodLabels[service.sample_method]}
                  </Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Giá">
                {service.price ? `${service.price.toFixed(2)}đ` : '0.00đ'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Thời gian dự kiến">
                {service.estimated_time ? (
                  <Tag icon={<ClockCircleOutlined />} color="processing">
                    {service.estimated_time} phút
                  </Tag>
                ) : (
                  'Chưa xác định'
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Dịch vụ cha" span={3}>
                {!service.parent_service_id ? 'Không (Đây là dịch vụ cha)' : (service.parent_service_id.name || 'Không (Đây là dịch vụ cha)')}
              </Descriptions.Item>
              
              <Descriptions.Item label="Mô tả" span={3}>
                {service.description || 'Không có mô tả'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày tạo">
                {moment(service.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày cập nhật">
                {moment(service.updated_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          
          <Divider orientation="left">Dịch vụ con</Divider>
          
          {loadingChild ? (
            <div className="flex justify-center items-center p-12">
              <Spin />
            </div>
          ) : childServices && childServices.length > 0 ? (
            <Card className="shadow-sm">
              <Table 
                columns={childColumnsVi} 
                dataSource={childServices} 
                rowKey="_id"
                pagination={false}
              />
            </Card>
          ) : (
            <Empty description="Không tìm thấy dịch vụ con" />
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

// Bảng dịch vụ con tiếng Việt
const childColumnsVi = [
  {
    title: 'Tên dịch vụ',
    dataIndex: 'name',
    key: 'name',
    render: (name) => <Text strong>{name}</Text>,
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (
      <Tag color={type === 'civil' ? 'blue' : 'purple'}>
        {typeLabels[type] || type}
      </Tag>
    ),
  },
  {
    title: 'Phương thức lấy mẫu',
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
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
    render: (price) => `${price?.toFixed(2) || '0.00'}đ`,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (isActive) => (
      <Tag color={isActive ? 'success' : 'error'}>
        {isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
      </Tag>
    ),
  },
]