import React, { useEffect } from "react";
import { Modal, Descriptions, Input, Spin, Table } from "antd";
import { toast } from "react-toastify";

function ModalDetailDepartmentManager({
  isModalOpen,
  handleCancel,
  selectedDepartment,
  statDateFrom,
  setStatDateFrom,
  statDateTo,
  setStatDateTo,
  statLoading,
  setStatLoading,
  statResult,
  setStatResult,
  fetchDepartmentStatistics,
}) {
  const department = selectedDepartment?.data;

  const handleStatistic = async () => {
    if (!department?._id) {
      toast.error("Không có ID phòng ban!");
      return;
    }
    setStatLoading(true);
    const res = await fetchDepartmentStatistics({
      departmentId: department._id,
      date_from: statDateFrom || undefined,
      date_to: statDateTo || undefined,
    });
    setStatLoading(false);
    if (res.success) {
      setStatResult(res.data);
    } else {
      setStatResult(null);
      toast.error("Không lấy được dữ liệu thống kê!");
    }
  };

  const columns = [
    { title: "Tổng nhân sự", dataIndex: "totalStaff", key: "totalStaff" },
    { title: "Tổng ca làm", dataIndex: "totalSlots", key: "totalSlots" },
    { title: "Ca đã đặt", dataIndex: "bookedSlots", key: "bookedSlots" },
    { title: "Tỉ lệ đặt ca (%)", dataIndex: "bookingRate", key: "bookingRate" },
  ];

  // Tự động thống kê khi mở modal hoặc thay đổi ngày lọc
  useEffect(() => {
    if (
      isModalOpen &&
      selectedDepartment?.success &&
      selectedDepartment.data?._id &&
      statDateFrom &&
      statDateTo
    ) {
      handleStatistic();
    }
  }, [isModalOpen, selectedDepartment, statDateFrom, statDateTo]);

  return (
    <Modal
      title="Chi tiết phòng ban"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      {department ? (
        <>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên phòng ban">
              {department.name || "Không có dữ liệu"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {department.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: department.description }}
                />
              ) : (
                "Không có mô tả"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Quản lý phòng ban">
              {department.manager_id ? (
                <>
                  {department.manager_id.first_name}{" "}
                  {department.manager_id.last_name}
                  <br />
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {department.manager_id.email}
                  </span>
                </>
              ) : (
                "Chưa có quản lý"
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* Thống kê */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: "20px", fontWeight: 500, marginBottom: 20 }}>
              Dữ liệu thống kê phòng ban: {department.name}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                flexWrap: "nowrap",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Input
                type="date"
                value={statDateFrom}
                onChange={(e) => {
                  const newDateFrom = e.target.value;
                  setStatDateFrom(newDateFrom);
                  const dateFrom = new Date(newDateFrom);
                  const dateTo = new Date(dateFrom);
                  dateTo.setDate(dateFrom.getDate() + 7);
                  if (new Date(statDateTo) <= dateFrom) {
                    setStatDateTo(dateTo.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Từ ngày"
                style={{ minWidth: 180, flex: 1 }}
                max={statDateTo || undefined}
              />
              <Input
                type="date"
                value={statDateTo}
                onChange={(e) => {
                  const newDateTo = e.target.value;
                  setStatDateTo(newDateTo);
                  const dateFrom = new Date(statDateFrom);
                  if (new Date(newDateTo) <= dateFrom) {
                    const dateTo = new Date(dateFrom);
                    dateTo.setDate(dateFrom.getDate() + 1);
                    setStatDateTo(dateTo.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Đến ngày"
                style={{ minWidth: 180, flex: 1 }}
                min={
                  statDateFrom
                    ? new Date(statDateFrom).toISOString().split("T")[0]
                    : undefined
                }
              />
            </div>

            <div>
              {statLoading ? (
                <Spin />
              ) : statResult ? (
                <Table
                  columns={columns}
                  dataSource={[statResult.data]}
                  pagination={false}
                  rowKey="totalStaff"
                />
              ) : (
                <div style={{ color: "#888" }}>Chưa có dữ liệu thống kê</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>Không có dữ liệu phòng ban.</div>
      )}
    </Modal>
  );
}

export default ModalDetailDepartmentManager;
