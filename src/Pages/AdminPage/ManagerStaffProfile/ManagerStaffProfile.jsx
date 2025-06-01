import React, { use, useEffect, useState } from "react";
import "./ManagerStaffProfile.css";
import { Modal, Pagination, Popconfirm, Select, Switch } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useStaffProfile from "../../../Hooks/useStaffProfile";
import ModalCreateStaffProfile from "./ModalCreateStaffProfile/ModalCreateStaffProfile";

function ManagerStaffProfile() {
  const {
    staffProfile,
    total,
    loading,
    error,
    getListStaff,
    addNewStaffProfile,
  } = useStaffProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedStaff, setSelectedStaff] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    getListStaff({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: {
        keyword: "",
        status: "",
      },
    });
  }, [currentPage]);

  // create staff profile
  const openAddModal = () => {
    setIsAddModalOpen(true);
    selectedStaff(null);
  };

  const handleAddStaff = async (staffData) => {
    try {
      const result = await addNewStaffProfile(staffData);
      if (result.success) {
        setIsAddModalOpen(false);
        getListStaff({
          pageNum: currentPage,
          pageSize: pageSize,
        });
      }
      return result.data;
    } catch (error) {
      toast.error("Tạo tài khoản nhân viên không thành công!");
    }
  };

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <button className="button-add__account" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo tài khoản
        </button>
      </div>

      {/* Table account */}
      <div className="form-account">
        <h2>Danh sách người dùng</h2>
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Phòng ban</th>
                <th>Công việc</th>
                <th>Tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {staffProfile?.length > 0 ? (
                staffProfile.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <div className="staffProfile-title">
                        <span className="title-name">{`${item.user_id?.first_name} ${item.user_id?.last_name}`}</span>
                        <span className="title-email">
                          {item.user_id?.email}
                        </span>
                      </div>
                    </td>
                    <td>{item.department_id.name}</td>
                    <td>{item.job_title}</td>
                    <td>{item.salary.toLocaleString()} VNĐ</td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
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

        {/* modal add staff */}
        <ModalCreateStaffProfile
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddStaff}
        />
      </div>
    </div>
  );
}

export default ManagerStaffProfile;
