import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, InboxOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { useNavigate } from 'react-router-dom';
import ModalRequestKit from './ModalRequestKit/ModalRequestKit';

const StaffConfirmSlots = () => {
  const {
    staffAssignedAppointments,
    staffAssignedPageInfo,
    getStaffAssignedAppointments,
    loading
  } = useAppointment();

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    getStaffAssignedAppointments({ pageNum, pageSize });
  }, [pageNum, pageSize]);

  const handleReceiveKit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleModalSuccess = () => {
    // Refresh the appointments list
    getStaffAssignedAppointments({ pageNum, pageSize });
  };

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
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate(`/staff/appointment/view/${record._id}`)}
            />
          </Tooltip>

          {record.type === 'facility' && record.status !== 'sample_collected' && record.status !== 'sample_received' && (
            <Tooltip title="Nhận bộ dụng cụ">
              <Button
                type="text"
                icon={<InboxOutlined />}
                onClick={() => handleReceiveKit(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}

          {record.type === 'facility' && (record.status === 'sample_collected' || record.status === 'sample_received') && (
            <Tooltip title="Xem mẫu">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/staff/appointment/samples/${record._id}`)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
        </Space>
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
            setPageNum(p);
            setPageSize(ps);
          },
        }}
      />

      <ModalRequestKit
        open={modalOpen}
        onClose={handleModalClose}
        appointmentId={selectedAppointment?._id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default StaffConfirmSlots;
