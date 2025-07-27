import React, { useEffect, useState } from "react";
import { Table, Tag, Dropdown, Menu, Button } from "antd";
import AppointmentFilter from "./AppointmentFilter";
import { useAppointment } from "../../../Hooks/useAppoinment";
import useAuth from "../../../Hooks/useAuth";
import ModalApplyKit from "./ModalApplyKit/ModalApplyKit";
import { useNavigate } from "react-router-dom";
import useResult from "../../../Hooks/useResult";
import ModalRequestResultAdmin from "./ViewSampleAppointment/ModalRequestResultAdmin/ModalRequestResultAdmin";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái", color: "default" },
  { value: "pending", label: "Chờ xác nhận", color: "orange" },
  { value: "confirmed", label: "Đã xác nhận", color: "blue" },
  { value: "sample_assigned", label: "Đã phân mẫu", color: "purple" },
  { value: "sample_collected", label: "Đã lấy mẫu", color: "geekblue" },
  { value: "sample_received", label: "Đã nhận mẫu", color: "cyan" },
  { value: "testing", label: "Đang xét nghiệm", color: "gold" },
  { value: "completed", label: "Hoàn thành", color: "green" },
  { value: "cancelled", label: "Đã hủy", color: "red" },
  { value: "awaiting_authorization", label: "Chờ phê duyệt", color: "magenta" },
  { value: "authorized", label: "Đã phê duyệt", color: "success" },
  {
    value: "ready_for_collection",
    label: "Sẵn sàng trả kết quả",
    color: "lime",
  },
];

const typeOptions = [
  { value: "self", label: "Tự lấy mẫu" },
  { value: "home", label: "Tại nhà" },
  { value: "clinic", label: "Tại cơ sở y tế" },
  { value: "other", label: "Khác" },
];
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
    render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusOption = statusOptions.find(
        (option) => option.value === status
      );
      return (
        <Tag color={statusOption ? statusOption.color : "default"}>
          {statusOption ? statusOption.label : status}
        </Tag>
      );
    },
  },
  {
    title: "Loại lấy mẫu",
    dataIndex: "type",
    key: "type",
    render: (type) => {
      const typeOption = typeOptions.find((option) => option.value === type);
      return typeOption ? typeOption.label : type;
    },
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

  // Khách hàng yêu cầu cấp giấy chứng nhận (Hành chính)
  const { resultAdmin, addRequestResultAdmin } = useResult();
  const [selectedResultAdmin, setSelectedResultAdmin] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // create service
  const openAddModal = (resultId) => {
    setIsAddModalOpen(true);
    setSelectedResultAdmin(resultId);
  };

  const handleAddRequestRedultAdmin = async (data) => {
    try {
      const { resultId, ...resultData } = data;
      const result = await addRequestResultAdmin({ resultId, resultData });
      if (result.success) {
        setIsAddModalOpen(false);
        toast.success("Tạo yêu cầu thành công!");
      }
      return result.data;
    } catch (error) {
      toast.error("Tạo yêu cầu không thành công!");
    }
  };

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
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="detail"
              onClick={() =>
                navigate(`/customer/appointment/detail/${record._id}`)
              }
            >
              Xem chi tiết
            </Menu.Item>
            {(record.type === "self" || record.type === "home") && (
              <Menu.Item
                key="kit"
                onClick={() => {
                  setSelectedAppointmentId(record._id);
                  setShowModal(true);
                }}
              >
                Nhận bộ dụng cụ
              </Menu.Item>
            )}
            <Menu.Item
              key="sample"
              onClick={() =>
                navigate(`/customer/appointment/sample/${record._id}`)
              }
            >
              Xem Mẫu
            </Menu.Item>

            {record.status === "completed" &&
              record.type === "administrative" && (
                <Menu.Item
                  key="requestResult"
                  onClick={() => {
                    openAddModal(record._id);
                  }}
                >
                  Yêu cầu giấy xét nghiệm
                </Menu.Item>
              )}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary">Hành động</Button>
          </Dropdown>
        );
      },
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

      {/* Modal create service */}
      <ModalRequestResultAdmin
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAdd={handleAddRequestRedultAdmin}
        resultId={selectedResultAdmin}
      />
    </div>
  );
}
