import React, { use, useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./ManagerUser.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import ModalCreateUser from "./ModalCreateUser/ModalCreateUser";
import { FaPlus } from "react-icons/fa";
import ModalEditUser from "./ModalEditUser/ModalEditUser";
import ModalDetailUser from "./ModalDetailUser/ModalDetailUser";

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

  useEffect(() => {
    searchUserPag({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: {
        keyword: "",
        role: "",
        is_verified: true,
        status: true,
        is_deleted: false,
      },
    });
  }, [currentPage]);

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
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts?.length > 0 ? (
                accounts.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
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
                      <button
                        className="detail-account"
                        onClick={() => handleDetailUser(item._id)}
                      >
                        Chi tiết
                      </button>
                    </td>
                    <td>
                      <button
                        className="edit-account"
                        onClick={() => {
                          setEditUser(item);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="delete-account"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDeleteUser(item)}
                      >
                        Xóa
                      </button>
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
