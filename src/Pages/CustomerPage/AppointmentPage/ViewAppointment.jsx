import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import AppointmentFilter from "./AppointmentFilter";
import { useAppointment } from "../../../Hooks/useAppoinment";
import useAuth from "../../../Hooks/useAuth";
import ModalApplyKit from "./ModalApplyKit/ModalApplyKit";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Dịch vụ",
    dataIndex: ["service_id", "name"],
    key: "service",
  },
  {
    title: "Ngày hẹn",
    dataIndex: "appointment_date",
    key: "appointment_date",
    render: (date) => date ? new Date(date).toLocaleDateString() : "",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color={status === "pending" ? "orange" : status === "completed" ? "green" : "blue"}>{status}</Tag>,
  },
  {
    title: "Loại lấy mẫu",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Địa chỉ lấy mẫu",
    dataIndex: "collection_address",
    key: "collection_address",
  },
  {
      title: "Nhân viên phụ trách",
      key: "staff",
      render: (_, record) => {
        const staff = record.staff_id;
        return staff ? (
          <div>
            {staff.first_name} {staff.last_name} – {staff.email}
          </div>
        ) : (
          <Tag color="red">Chưa phân công</Tag>
        );
      },
    },
    {
      title: "Kỹ thuật viên xét nghiệm",
      key: "labtech",
      render: (_, record) => {
        const tech = record.laboratory_technician_id;
        return tech ? (
          <div>
            {tech.first_name} {tech.last_name} – {tech.email}
          </div>
        ) : (
          <Tag color="red">Chưa phân công</Tag>
        );
      },
    },
];

export default function ViewAppointment() {
  const { appointments, loading, pageInfo, getAppointments } = useAppointment();
  const { userId } = useAuth();
  const [filters, setFilters] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    getAppointments({
      pageNum,
      pageSize: 10,
      user_id: userId,
      ...filters,
    });
    // eslint-disable-next-line
  }, [filters, pageNum, userId]);

  const handleFilter = (filterValues) => {
    setPageNum(1);
    setFilters(filterValues);
  };

  const columnsWithKit = [
    ...columns,
    {
      title: "Hành động",
      key: "requestKit",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setSelectedAppointmentId(record._id);
              setShowModal(true);
            }}
          >
            Request Kit
          </button>
          <button
            onClick={() => navigate(`/customer/appointment/sample/${record._id}`)}
            style={{ marginLeft: 8 }}
          >
            View Sample
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AppointmentFilter onFilter={handleFilter} />
      <Table
        columns={columnsWithKit}
        dataSource={appointments}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pageInfo?.pageNum || 1,
          pageSize: pageInfo?.pageSize || 10,
          total: pageInfo?.totalItems || 0,
          onChange: (page) => setPageNum(page),
        }}
      />
      <ModalApplyKit
        open={showModal}
        onClose={() => setShowModal(false)}
        appointmentId={selectedAppointmentId}
      />
    </div>
  );
}
