import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { useNavigate } from 'react-router-dom';

const StaffConfirmSlots = () => {
  const {
    staffAssignedAppointments,
    staffAssignedPageInfo,
    getStaffAssignedAppointments,
    loading
  } = useAppointment();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
const navigate = useNavigate();
  useEffect(() => {
    getStaffAssignedAppointments({ page, limit });
  }, [page, limit]);

  const columns = [
    {
      title: 'Customer',
      dataIndex: ['user_id', 'email'],
      key: 'customer',
      render: (_, record) => (
        <span>
          {record.user_id?.first_name} {record.user_id?.last_name} <br />
          {record.user_id?.email}
        </span>
      ),
    },
    {
      title: 'Service',
      dataIndex: ['service_id', 'name'],
      key: 'service',
      render: (_, record) => record.service_id?.name,
    },
    {
      title: 'Date',
      dataIndex: 'appointment_date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
        title: 'type',
        dataIndex: 'type',
        key:'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/staff/appointment/view/${record._id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className='p-6'>
    <h2 className="text-xl font-semibold mb-4">Danh sách cuộc hẹn đã phân công</h2>
      <Table
        columns={columns}
        dataSource={staffAssignedAppointments}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: staffAssignedPageInfo.pageNum,
          pageSize: staffAssignedPageInfo.pageSize,
          total: staffAssignedPageInfo.totalItems,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
      />
    </div>
  );
};

export default StaffConfirmSlots;
