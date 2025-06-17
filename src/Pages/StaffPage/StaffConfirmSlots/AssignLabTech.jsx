import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin } from 'antd';
import { useAppointment } from '../../../Hooks/useAppoinment';

const AssignLabTech = ({ appointmentId, onAssigned, assignedLabTechId }) => {
  const {
    getAvailableLabTechs,
    assignLabTech,
    availableLabTechsLoading
  } = useAppointment();

  const [loading, setLoading] = useState(false);
  const [labTechs, setLabTechs] = useState([]);

  useEffect(() => {
    const fetchLabTechs = async () => {
      const res = await getAvailableLabTechs();
      if (res.success) {
        setLabTechs(res.data.data || []);
      }
    };
    fetchLabTechs();
  }, []);

  const handleAssign = async (labTechId) => {
    setLoading(true);
    const res = await assignLabTech(appointmentId, labTechId);
    if (res.success) {
      message.success('Assigned lab technician successfully!');
      if (onAssigned) onAssigned();
    } else {
      message.error('Failed to assign lab technician');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Status',
      dataIndex: ['staff_profile', 'status'],
      key: 'status',
    },
    {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
        assignedLabTechId === record._id ? (
        <span style={{ color: 'green', fontWeight: 'bold' }}>Đã apply</span>
        ) : (
        <Button type="primary" onClick={() => handleAssign(record._id)}>
            Confirm
        </Button>
        )
    )
    }
  ];

  return (
    <div>
      <Table
        dataSource={labTechs}
        columns={columns}
        rowKey="_id"
        loading={availableLabTechsLoading || loading}
        pagination={false}
      />
    </div>
  );
};

export default AssignLabTech;
