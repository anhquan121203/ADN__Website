import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

import useSlot from "../../../Hooks/useSlot";
import { format } from "date-fns";
import { MdCalendarToday } from "react-icons/md";
import { useDispatch } from "react-redux";
import ModalCreateSlot from "./ModalCreateSlot/ModalCreateSlot";

function SlotAdmin() {
  const { slots, total, loading, error, searchListSlot, addNewSlot } =
    useSlot();

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    searchListSlot({
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
    });
  }, [currentPage]);

  //   handle add slot
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
        });
      }
      return result.data;
    } catch (error) {
      toast.error("Thêm slot không thành công!");
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
            slots.map((slot, slotIndex) => (
              <div key={slot._id} style={{ marginBottom: 40 }}>
                <h3 style={{ marginBottom: 12 }}>
                  🗓️ Slot {slotIndex + 1} (
                  {format(new Date(slot.start_time), "dd/MM/yyyy-HH:mm")} {"->"}{" "}
                  {format(new Date(slot.end_time), "dd/MM/yyyy-HH:mm")})
                </h3>

                <table className="table-account">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Nhân viên</th>
                      <th>Chức vụ</th>
                      <th>Cuộc hẹn</th>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                      <th>Ngày trong tuần</th>
                      <th>Lặp lại</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slot.staff_profile_ids.map((profile, index) => (
                      <tr key={`${slot._id}-${profile._id}`}>
                        <td>{index + 1}</td>
                        <td>
                          {profile.user_id.last_name}{" "}
                          {profile.user_id.first_name}
                        </td>
                        <td>{profile.job_title}</td>
                        <td>{slot.appointment_limit}</td>
                        <td>
                          {new Date(slot.start_time).toLocaleDateString()}
                        </td>
                        <td>{new Date(slot.end_time).toLocaleDateString()}</td>
                        <td>
                          {slot.days_of_week
                            .map(
                              (d) =>
                                ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][
                                  d % 7
                                ]
                            )
                            .join(", ")}
                        </td>
                        <td>
                          {slot.pattern === "daily" ? "Hằng ngày" : "Hằng tuần"}
                        </td>
                        <td>
                          <span className={`status-badge ${slot.status}`}>
                            {slot.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button className="detail-account">Chi tiết</button>
                          <button className="edit-account">Sửa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>

        {/* <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        /> */}
        {/* isModalOpen, handleCancel, handleAdd */}
        {/* Modal add new slot */}
        <ModalCreateSlot
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddSlot}
        />
      </div>
    </div>
  );
}

export default SlotAdmin;
