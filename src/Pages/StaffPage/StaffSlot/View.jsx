import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Spin, message } from 'antd';
import useStaff from '../../../Hooks/useStaff';
import Search from './Search';
import moment from 'moment';

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

  const statusColors = {
    available: 'success',
    booked: 'warning',
    unavailable: 'error'
  };

  const columns = [
    {
      title: 'Staff Members',
      dataIndex: 'staff_profile_ids',
      key: 'staff',
      render: (staff) => (
        <div>
          {staff.map((member) => (
            <div key={member._id}>
              {`${member.user_id.first_name} ${member.user_id.last_name}`}
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {member.employee_id} - {member.job_title}
              </Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Time Period',
      key: 'time_period',
      render: (_, record) => (
        <>
          <div>{moment(record.start_time).format('YYYY-MM-DD')}</div>
          <div>to</div>
          <div>{moment(record.end_time).format('YYYY-MM-DD')}</div>
        </>
      ),
    },
    {
      title: 'Pattern',
      dataIndex: 'pattern',
      key: 'pattern',
      render: (pattern) => (
        <Tag color="blue">
          {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Days',
      dataIndex: 'days_of_week',
      key: 'days',
      render: (days) => {
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => dayNames[day - 1]).join(', ');
      },
    },
    {
      title: 'Appointment Limit',
      dataIndex: 'appointment_limit',
      key: 'limit',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
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
        <Title level={2}>Slot Management</Title>
        <Text type="secondary">View and manage staff time slots</Text>
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
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </div>
  );
};

export default View;
