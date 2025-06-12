import React, { use, useEffect, useState } from "react";
import "./ManagerStaffProfile.css";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useStaffProfile from "../../../Hooks/useStaffProfile";
import ModalCreateStaffProfile from "./ModalCreateStaffProfile/ModalCreateStaffProfile";
import ModalEditStaffProfile from "./ModalEditStaffProfile/ModalEditStaffProfile";
import ModalDetailStafProfile from "./ModalDetailStafProfile/ModalDetailStafProfile";
import FilterStaffProfile from "./FilterStaffProfile/FilterStaffProfile";

function ManagerStaffProfile() {
  const {
    staffProfile,
    total,
    loading,
    error,
    getListStaff,
    addNewStaffProfile,
    updateStaffById,
    staffProfileById,
  } = useStaffProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedStaff, setSelectedStaff] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // modal update
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  // modal detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const renderStatus = (status) => {
    switch (status) {
      case "active":
        return <Tag color="green">Hoạt động</Tag>;
      case "inactive":
        return <Tag color="red">Không hoạt động</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

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

  // Filter slot
  const [filters, setFilters] = useState({
    keyword: "",
    department_id: "",
    status: "active",
    hire_date_from: "",
    hire_date_to: "",
  });

  const handleSearch = () => {
    getListStaff({
      ...filters,
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: {
        keyword: "",
        department_id: "",
        status: "active",
        hire_date_from: "",
        hire_date_to: "",
      },
    });
  };

  // create staff profile
  const openAddModal = () => {
    setIsAddModalOpen(true);
    // selectedStaff(null);
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

  // update staff by id
  const openEditModal = (staffData) => {
    setIsEditModalOpen(true);
    setEditStaff(staffData);
  };

  const handleEditStaff = async (staffData) => {
    try {
      const result = await updateStaffById(staffData._id, staffData);
      if (result.success) {
        setIsEditModalOpen(false);
        getListStaff({
          pageNum: currentPage,
          pageSize: pageSize,
        });
      }
      return result.data;
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật tài khoản không thành công!",
      };
    }
  };

  // detail modal
  const handleDetailStaff = async (staffId) => {
    try {
      const result = await staffProfileById(staffId);
      if (result.success) {
        setSelectedStaff(result.data.data);
        setIsDetailModalOpen(true);
      }
      // return result;
    } catch (error) {
      // toast.error("Thêm tài khoản không thành công");
      return {
        success: false,
        message: "Xem chi tiết không thành công!",
      };
    }
  };

  return (
    <div className="manager-staffProfile">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          {" "}
          <h5>Danh sách nhân viên</h5>
        </div>
        <div className="btn-managerAccount">
          <button className="button-add__account" onClick={openAddModal}>
            <FaPlus style={{ marginRight: "8px" }} />
            Tạo tài khoản
          </button>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div>
          <FilterStaffProfile
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>
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
                    <td>{item.department_id?.name}</td>
                    <td>{item.job_title}</td>
                    <td>{item.salary.toLocaleString()} VNĐ</td>
                    <td>{renderStatus(item.status)}</td>

                    <td>
                      <div className="action-staffProfile">
                        <CiEdit
                          className="icon-service"
                          onClick={() => openEditModal(item)}
                        />

                        <FaRegEye
                          className="icon-service"
                          onClick={() => handleDetailStaff(item._id)}
                        />
                      </div>
                    </td>
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

        <ModalEditStaffProfile
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditStaff}
          editStaffProfile={editStaff}
        />

        <ModalDetailStafProfile
          isModalOpen={isDetailModalOpen}
          handleCancel={() => setIsDetailModalOpen(false)}
          selectedStaff={selectedStaff}
        />
      </div>
    </div>
  );
}

export default ManagerStaffProfile;
