import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
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
      message.success('Phân công kỹ thuật viên xét nghiệm thành công!');
      if (onAssigned) onAssigned();
    } else {
      message.error('Phân công kỹ thuật viên xét nghiệm thất bại');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Họ tên',
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
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Trạng thái',
      dataIndex: ['staff_profile', 'status'],
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        assignedLabTechId === record._id ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>Đã phân công</span>
        ) : (
          <Button type="primary" onClick={() => handleAssign(record._id)}>
            Xác nhận
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
