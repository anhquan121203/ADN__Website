import React, { use, useEffect, useState } from "react";
import { Modal, Pagination, Select, Switch } from "antd";
import "./ManagerUser.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import ModalCreateUser from "./ModalCreateUser/ModalCreateUser";
import { FaPlus, FaRegEye } from "react-icons/fa";
import ModalEditUser from "./ModalEditUser/ModalEditUser";
import ModalDetailUser from "./ModalDetailUser/ModalDetailUser";
import UserFilter from "./FilterUser/FilterUser";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

function ManagerUser() {
  const {
    accounts,
    total,
    loading,
    error,
    searchUserPag,
    addNewUser,
    userById,
    updateUserById,
    deleteUserById,
    changeStatusUser,
  } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedUser, setSelectedUser] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // filter  user
  const [filters, setFilters] = useState({
    keyword: "",
    role: "",
    is_verified: "",
    status: "",
    is_deleted: false,
  });

  const handleSearch = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    const condition = {
      keyword: filters.keyword,
      role: filters.role,
      is_verified: filters.is_verified === "" ? undefined : filters.is_verified,
      status: filters.status === "" ? undefined : filters.status,
      is_deleted: filters.is_deleted,
    };

    searchUserPag({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: condition,
    });
  }, [currentPage, filters]);

  // display role
  const getRoleName = (role) => {
    switch (role) {
      case "staff":
        return "Nhân viên";
      case "customer":
        return "Khách hàng";
      case "manager":
        return "Quản lý";
      case "laboratory_technician":
        return "Người xét nghiệm";
      default:
        return role;
    }
  };

  // useEffect(() => {
  //   searchUserPag({
  //     pageInfo: {
  //       pageNum: currentPage,
  //       pageSize: pageSize,
  //     },
  //     searchCondition: {
  //       keyword: "",
  //       role: "",
  //       is_verified: true,
  //       status: true,
  //       is_deleted: false,
  //     },
  //   });
  // }, [currentPage]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedUser(null);
  };

  const handleAddUser = async (userData) => {
    try {
      const result = await addNewUser(userData);
      if (result.success) {
        setIsAddModalOpen(false);
      }
      return result;
    } catch (error) {
      // toast.error("Thêm tài khoản không thành công");
      return { success: false, message: "Thêm tài khoản không thành công" };
    }
  };

  // update user
  const handleEditUser = async (userData) => {
    try {
      const result = await updateUserById(editUser._id, userData);
      if (result.success) {
        setIsEditModalOpen(false);
        toast.success("Cập nhật tài khoản thành công");
      } else {
        toast.error(result.message || "Cập nhật tài khoản không thành công!");
      }
      return result;
    } catch (error) {
      toast.error("Cập nhật tài khoản không thành công!");
      return { success: false, message: "Cập nhật tài khoản không thành công" };
    }
  };

  // delete user
  const handleDeleteUser = async (user) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        const result = await deleteUserById(user._id);
        if (result.success) {
          toast.success("Xóa tài khoản thành công");
        } else {
          toast.error(result.message || "Xóa tài khoản không thành công!");
        }
      } catch (error) {
        toast.error("Xóa tài khoản không thành công!");
      }
    }
  };

  // detail user
  const handleDetailUser = async (userId) => {
    try {
      const result = await userById(userId);
      if (result.success) {
        setSelectedUser(result.data.data);
        setIsDetailModalOpen(true);
      }
      // return result;
    } catch (error) {
      // toast.error("Thêm tài khoản không thành công");
      return {
        success: false,
        message: "Xem chi tiết tài khoản không thành công!",
      };
    }
  };

  // change status user
  const handleChangeStatus = async (user) => {
    try {
      const newStatus = !user.status;
      const result = await changeStatusUser({
        userId: user._id,
        status: newStatus,
      });
      if (result.success) {
        toast.success("Thay đổi trạng thái tài khoản thành công");
      }
    } catch (error) {
      return {
        success: false,
        message: "Thay đổi trạng thái tài khoản không thành công",
      };
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
        <h5>Danh sách người dùng</h5>
        <div className="account-container">

          <UserFilter filters={filters} setFilters={setFilters} onSearch={handleSearch} />

          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Xác thực</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts?.length > 0 ? (
                accounts.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <Switch
                        className="toggle-changeStatus"
                        checked={item.status}
                        onClick={() => handleChangeStatus(item)}
                      />
                      {`${item.first_name} ${item.last_name}`}
                    </td>
                    <td>{item.email} </td>
                    <td>{getRoleName(item.role)} </td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status ? "active" : "inactive"
                        }`}
                      >
                        {item.status ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td>
                      {item.is_verified ? " ✅ Đã xác thực" : "❌ Chưa xác thực"}
                    </td>

                    <td className="action-icons">
                      <CiEdit className="icon-actionAdmin" onClick={() => {
                          setEditUser(item);
                          setIsEditModalOpen(true);
                        }}/>

                      <MdDeleteOutline  className="icon-actionAdmin" onClick={() => handleDeleteUser(item)}/>

                      <FaRegEye  className="icon-actionAdmin" onClick={() => handleDetailUser(item._id)}/>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
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
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <ModalCreateUser
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddUser}
        />
      )}
      {isEditModalOpen && (
        <ModalEditUser
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditUser}
          initialValues={editUser}
        />
      )}
      {/* Detail User Modal */}
      <ModalDetailUser
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        selectedUser={selectedUser}
      />
    </div>
  );
}

export default ManagerUser;
