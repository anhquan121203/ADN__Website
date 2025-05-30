import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import "./SlotAdmin.css";

import useSlot from "../../../Hooks/useSlot";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import ModalCreateSlot from "./ModalCreateSlot/ModalCreateSlot";
import { CiEdit } from "react-icons/ci";
import ModalEditSlot from "./ModalEditSlot/ModalEditSlot";
import ModalDetailSlot from "./ModalDetailSlot/ModalDetailSlot";

function SlotAdmin() {
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

  useEffect(() => {
    searchListSlot({
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "start_time",
      sort_order: "asc",
    });
  }, [currentPage]);

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
          sort_by: "start_time",
          sort_order: "asc",
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
        toast.success("Cập nhật slot thành công");
      } else {
        toast.error(result.message || "Cập nhật slot không thành công!");
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

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <button className="button-add__account" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo thiết bị mới
        </button>
      </div>

      <div className="form-account">
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
                                    className={`status-badge ${slot.status}`}
                                  >
                                    {slot.status.toUpperCase()}
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

        <ModalCreateSlot
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddSlot}
        />

        <ModalEditSlot
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditSlot}
          editSlot={editSlot}
        />

        <ModalDetailSlot
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        selectedSlot={selectedSlot}/>
      </div>
    </div>
  );
}

export default SlotAdmin;
