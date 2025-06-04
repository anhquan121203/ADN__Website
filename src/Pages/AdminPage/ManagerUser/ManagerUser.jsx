import React, { use, useEffect, useState } from "react";
import { Modal, Pagination, Popconfirm, Select, Switch } from "antd";
import "./ManagerUser.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import ModalCreateUser from "./ModalCreateUser/ModalCreateUser";
import { FaPlus, FaRegEye } from "react-icons/fa";
import ModalEditUser from "./ModalEditUser/ModalEditUser";
import ModalDetailUser from "./ModalDetailUser/ModalDetailUser";
import UserFilter from "./FilterUser/FilterUser";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";

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

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  useEffect(() => {
    searchUserPag({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: {
        keyword: "",
        role: [],
        is_verified: true,
        status: true,
        is_deleted: false,
      },
    });
  }, [currentPage]);

  // filter  user
  const [filters, setFilters] = useState({
    keyword: "",
    role: [],
    is_verified: "",
    status: true,
    is_deleted: false,
  });

  const handleSearch = () => {
    const condition = {
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.role.length > 0 && { role: filters.role }),
      ...(filters.status !== "" && { status: filters.status }),
      ...(filters.is_verified !== "" && { is_verified: filters.is_verified }),
      ...(filters.is_deleted !== "" && { is_deleted: filters.is_deleted }),
    };

    if (Object.keys(condition).length === 0) {
      condition.keyword = " "; 
    }

    searchUserPag({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: condition,
    });
  };

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

  // change status user
  const handleChangeStatus = async (user) => {
    try {
      const newStatus = !user.status;
      const result = await changeStatusUser({
        userId: user._id,
        status: newStatus,
      });

      if (result?.success) {
        toast.success("Thay đổi trạng thái tài khoản thành công");
        const condition = {
          keyword: filters.keyword,
          role: filters.role,
          is_deleted: filters.is_deleted,
        };
        if (filters.is_verified !== "") {
          condition.is_verified = filters.is_verified;
        }
        if (filters.status !== "") {
          condition.status = filters.status;
        }

        await searchUserPag({
          pageInfo: {
            pageNum: currentPage,
            pageSize: pageSize,
          },
          searchCondition: condition,
        });
      } else {
        toast.error(result?.message || "Thay đổi thất bại");
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái tài khoản không thành công");
    }
  };

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          <h5>Danh sách người dùng</h5>
        </div>
        <div className="btn--managerAccount">
          <button className="button-add__account" onClick={openAddModal}>
            <FaPlus style={{ marginRight: "8px" }} />
            Tạo tài khoản
          </button>
        </div>

      </div>

      {/* Table account */}
      <div className="form-account">

        <div className="account-container">
          <div className="filter-account">
            <UserFilter
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}

            />
          </div>


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
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email} </td>
                    <td>{getRoleName(item.role)} </td>
                    <td>
                      <span
                        className={`status-badge ${item.status ? "active" : "inactive"
                          }`}
                      >
                        {item.status ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>

                    <td>
                      {item.is_verified
                        ? " ✅ Đã xác thực"
                        : "❌ Chưa xác thực"}
                    </td>

                    <td>
                      <div className="action-admin">
                        <CiEdit
                          className="icon-admin"
                          onClick={() => {
                            setEditUser(item);
                            setIsEditModalOpen(true);
                          }}
                        />

                        <MdDeleteOutline
                          className="icon-admin"
                          onClick={() => handleDeleteUser(item)}
                        />

                        <FaRegEye
                          className="icon-admin"
                          onClick={() => handleDetailUser(item._id)}
                        />

                        <Popconfirm
                          title="Khóa tài khoản"
                          description="Bạn có muốn khóa tài khoản này không?"
                          onConfirm={() => handleChangeStatus(item)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <MdBlock className="icon-admin" />
                        </Popconfirm>
                      </div>
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
