import React, { use, useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./ManagerUser.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import ModalCreateUser from "./ModalCreateUser/ModalCreateUser";
import { FaPlus } from "react-icons/fa";
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
  } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedUser, setSelectedUser] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
                      <button
                        className="detail-account"
                        onClick={() => handleDetailUser(item._id)}
                      >
                        Chi tiết
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
      <ModalCreateUser
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAdd={handleAddUser}
      />

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
