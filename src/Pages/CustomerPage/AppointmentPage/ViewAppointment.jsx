import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import AppointmentFilter from "./AppointmentFilter";
import { useAppointment } from "../../../Hooks/useAppoinment";
import useAuth from "../../../Hooks/useAuth";

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
    dataIndex: ["slot_id", "staff_profile_ids"],
    key: "staff",
    render: (staffs) =>
      staffs && staffs.length > 0
        ? staffs.map((s) => (
            <div key={s._id}>
              {s.user_id.first_name} {s.user_id.last_name}
            </div>
          ))
        : "",
  },
];

export default function ViewAppointment() {
  const { appointments, loading, pageInfo, getAppointments } = useAppointment();
  const { userId } = useAuth();
  const [filters, setFilters] = useState({});
  const [pageNum, setPageNum] = useState(1);

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

  return (
    <div>
      <AppointmentFilter onFilter={handleFilter} />
      <Table
        columns={columns}
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
    </div>
  );
}
