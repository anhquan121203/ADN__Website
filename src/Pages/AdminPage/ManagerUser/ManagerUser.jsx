import React, { useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./ManagerUser.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import ModalCreateUser from "./ModalCreateUser/ModalCreateUser";
import { FaPlus } from "react-icons/fa";
import ModalEditUser from "./ModalEditUser/ModalEditUser";

function ManagerUser() {
  const {
    accounts,
    total,
    loading,
    error,
    searchUserPag,
    addNewUser,
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
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đã xác thực</th>
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
                    <td>{item.role} </td>
                    <td>{item.is_verified ? "✅" : "❌"}</td>
                    <td>{item.status ? "Hoạt động" : "Bị khóa"}</td>
                    <td>
                      <button className="detail-account">Chi tiết</button>
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
    </div>
  );
}

export default ManagerUser;
