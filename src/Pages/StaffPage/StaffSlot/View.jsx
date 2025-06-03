import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Spin, message, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useStaff from '../../../Hooks/useStaff';
import Search from './Search';
import moment from 'moment';
import ModalDetails from './ModalDetails';

const { Title, Text } = Typography;

const View = () => {
  const { fetchSlots, loading } = useStaff();
  const [slots, setSlots] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const statusColors = {
    available: 'success',
    booked: 'warning',
    unavailable: 'error'
  };

  const statusLabels = {
    available: 'Có sẵn',
    booked: 'Đã đặt',
    unavailable: 'Không khả dụng'
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'staff_profile_ids',
      key: 'staff',
      render: (staff) => (
        <div>
          {staff.map((member) => (
            <div key={member._id} className="mb-2">
              <div>
                <Text strong>{`${member.user_id.first_name} ${member.user_id.last_name}`}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {member.employee_id} - {member.job_title}
              </Text>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {member.user_id.email}
                </Text>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Khung giờ',
      dataIndex: 'time_slots',
      key: 'time_slots',
      render: (slots) => (
        <div>
          {slots?.map((slot) => (
            <div key={slot._id} className="mb-2">
              <Text>{`${slot.year}-${String(slot.month).padStart(2, '0')}-${String(slot.day).padStart(2, '0')}`}</Text>
              <br />
              <Text type="secondary">
                {`${String(slot.start_time.hour).padStart(2, '0')}:${String(slot.start_time.minute).padStart(2, '0')} - 
                  ${String(slot.end_time.hour).padStart(2, '0')}:${String(slot.end_time.minute).padStart(2, '0')}`}
              </Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Giới hạn lịch hẹn',
      dataIndex: 'appointment_limit',
      key: 'limit',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status]}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          className='bg-black text-white'
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedSlot(record);
            setIsDetailModalOpen(true);
          }}
          size='large'
        >
        </Button>
      ),
    },
  ];

  const loadSlots = async () => {
    try {
      const params = {
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      
      const result = await fetchSlots(params);
      
      if (result.success) {
        setSlots(result.data);
        if (result.data?.pageInfo) {
          setPagination(prev => ({
            ...prev,
            total: result.data.pageInfo.totalItems
          }));
        }
      }
    } catch (err) {
      message.error('Failed to fetch slots');
    }
  };

  useEffect(() => {
    loadSlots();
  }, [searchParams, pagination.current, pagination.pageSize]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Quản lý ca làm việc</Title>
        <Text type="secondary">Xem và quản lý khung giờ làm việc của nhân viên</Text>
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
            dataSource={slots?.data?.pageData || []}
            rowKey="_id"
            pagination={{
              ...pagination,
              total: slots?.data?.pageInfo?.totalItems || 0,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} mục`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
      <ModalDetails
        visible={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedSlot(null);
        }}
        slot={selectedSlot}
      />
    </div>
  );
};

export default View;
