import React, { useEffect, useState } from "react";
import { Pagination, Popconfirm, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
// import "./SlotAdmin.css";
import useSlot from "../../../Hooks/useSlot";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { CiEdit } from "react-icons/ci";
import FilterSlotManager from "./FilterSlotManager/FilterSlotManager";
import CreateSlotManager from "./CreateSlotManager/CreateSlotManager";
import EditSlotManager from "./EditSlotManager/EditSlotManager";
import DetailSlotManager from "./DetailSlotManager/DetailSlotManager";

function SlotManager() {
  const {
    slots,
    total,
    loading,
    error,
    searchListSlot,
    addNewSlot,
    updateSlotById,
    slotById,
  } = useSlot();

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // update slot
  const [editSlot, setEditSlot] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // detail slot
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const cancel = (e) => {
    message.error("Click on No");
  };

  useEffect(() => {
    searchListSlot({
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  // Filter slot
  const [filters, setFilters] = useState({
    staff_profile_ids: [],
    department_id: "",
    appointment_id: "",
    status: true,
    date_from: "",
    date_to: "",
    sort_order: "desc",
  });

  const handleSearch = () => {
    searchListSlot({
      ...filters,
      staff_profile_ids:
        Array.isArray(filters.staff_profile_ids) &&
        filters.staff_profile_ids.length > 0
          ? filters.staff_profile_ids.join(",")
          : undefined, 
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "created_at",
      sort_order: filters.sort_order || "desc",
    });
  };

  // validate time slot
  const formatSlotDate = (slot) => {
    const ts = slot.time_slots?.[0];
    if (!ts) return { start: "N/A", end: "N/A" };

    const start = new Date(
      ts.year,
      ts.month - 1,
      ts.day,
      ts.start_time.hour,
      ts.start_time.minute
    );
    const end = new Date(
      ts.year,
      ts.month - 1,
      ts.day,
      ts.end_time.hour,
      ts.end_time.minute
    );

    return {
      start: format(start, "dd/MM/yyyy-HH:mm"),
      end: format(end, "dd/MM/yyyy-HH:mm"),
      startTime: format(start, "HH:mm"),
      endTime: format(end, "HH:mm"),
      dateOnly: format(start, "dd/MM/yyyy"),
    };
  };

  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const { dateOnly } = formatSlotDate(slot);
      if (!acc[dateOnly]) {
        acc[dateOnly] = [];
      }
      acc[dateOnly].push(slot);
      return acc;
    }, {});
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedSlot(null);
  };

  const handleAddSlot = async (slotData) => {
    try {
      const result = await addNewSlot(slotData);
      if (result.success) {
        setIsAddModalOpen(false);
        searchListSlot({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      }
      return result.data;
    } catch (error) {
      toast.error("Thêm slot không thành công!");
    }
  };

  // update slot
  const openEditModal = (slotData) => {
    setIsEditModalOpen(true);
    setEditSlot(slotData);
  };

  const handleEditSlot = async (slotData) => {
    try {
      const result = await updateSlotById(editSlot._id, slotData);
      if (result.success) {
        setIsEditModalOpen(false);
        searchListSlot({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "start_time",
          sort_order: "desc",
        });
      }
      return result;
    } catch (error) {
      return { success: false, message: "Cập nhật slot không thành công" };
    }
  };

  // get slot by ID **********************************************
  const handleDetailSlot = async (slotId) => {
    try {
      const result = await slotById(slotId);
      if (result.success) {
        setSelectedSlot(result.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      return {
        success: false,
        message: "Xem chi tiết tài khoản không thành công!",
      };
    }
  };

  //Render Status slot
  const renderStatus = (status) => {
    switch (status) {
      case "available":
        return <Tag color="green">Còn trống</Tag>;
      case "booked":
        return <Tag color="red">Đã đặt</Tag>;
      default:
        return <Tag color="pink">Không còn chỗ</Tag>;
    }
  };

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          <h5>Danh sách ca trực</h5>
        </div>

        <div className="btn-managerAccount">
          <button
            className="button-add__account"
            onClick={openAddModal}
            style={{ width: 180, height: 45 }}
          >
            <FaPlus style={{ marginRight: 10 }} />
            Thêm ca trực mới
          </button>
        </div>
      </div>

      <div className="form-account">
        <div className="filter-slot">
          <FilterSlotManager
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            slots={slots} // truyền slots để lấy danh sách nhân viên
          />
        </div>
        <div className="account-container">
          {slots.length > 0 ? (
            Object.entries(groupSlotsByDate(slots)).map(
              ([date, slotsInDay]) => (
                <div key={date} style={{ marginBottom: 40 }}>
                  <h4 style={{ marginBottom: 16 }}>📅 Ngày: {date}</h4>

                  {slotsInDay.map((slot, index) => {
                    const { startTime, endTime, start, end } =
                      formatSlotDate(slot);

                    return (
                      <div key={slot._id} style={{ marginBottom: 32 }}>
                        <div className="topTable-slot">
                          <h5 style={{ marginBottom: 12 }}>
                            🕐 Slot {index + 1} ({startTime} {"->"} {endTime})
                          </h5>

                          <div className="action-slot">
                            <CiEdit
                              className="icon-slot"
                              onClick={() => openEditModal(slot)}
                            />

                            <FaRegEye
                              className="icon-slot"
                              onClick={() => handleDetailSlot(slot._id)}
                            />
                          </div>
                        </div>

                        <table className="table-account">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Nhân viên</th>
                              <th>Email</th>
                              <th>Công việc</th>
                              <th>Cuộc hẹn</th>
                              <th>Ngày bắt đầu</th>
                              <th>Ngày kết thúc</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slot.staff_profile_ids?.map((profile, idx) => (
                              <tr key={`${slot._id}-${profile._id}`}>
                                <td>{idx + 1}</td>
                                <td>
                                  {profile.user_id.last_name}{" "}
                                  {profile.user_id.first_name}
                                </td>
                                <td>{profile.user_id.email}</td>
                                <td>{profile.job_title}</td>
                                <td>{slot.appointment_limit}</td>
                                <td>{start}</td>
                                <td>{end}</td>
                                <td>
                                  <span
                                  // className={`status-badge ${slot.status}`}
                                  >
                                    {renderStatus(slot.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )
            )
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        />

        <CreateSlotManager
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddSlot}
        />

        <EditSlotManager
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditSlot}
          editSlot={editSlot}
        />

        <DetailSlotManager
          isModalOpen={isDetailModalOpen}
          handleCancel={() => setIsDetailModalOpen(false)}
          selectedSlot={selectedSlot}
        />
      </div>
    </div>
  );
}

export default SlotManager;
