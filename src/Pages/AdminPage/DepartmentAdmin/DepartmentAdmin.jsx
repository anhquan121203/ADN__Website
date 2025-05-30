import React, { useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./DepartmentAdmin.css";
import useDepartment from "../../../Hooks/useDepartment";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import ModalCreateDepartment from "./ModalCreateDepartment/ModalCreateDepartment";
import ModalEditDepartment from "./ModalEditDepartment/ModalEditDepartment";
import ModalDetailDepartment from "./ModalDetailDepartment/ModalDetailDepartment";
import useAdmin from "../../../Hooks/useAdmin";

function DepartmentAdmin() {
  const { accounts, searchUserPag } = useAdmin();
  const {
    departments,
    total,
    loading,
    error,
    searchListDepartment,
    addNewDepartment,
    departmentById,
    updateDepartmentById,
    deleteDepartmentById,
  } = useDepartment();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Open Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedDepartment(null);
  };

  const handleAddDepartment = async (departmentData) => {
    try {
      const result = await addNewDepartment(departmentData);
      if (result.success) {
        setIsAddModalOpen(false);
        searchListDepartment({
          pageNum: currentPage,
          pageSize: pageSize,
        });
      }
      return result.data;
    } catch (error) {
      toast.error("Thêm phòng ban không thành công!");
    }
  };

  // Get Department by ID
  const handleDetailDepartment = async (departmentId) => {
    try {
      const result = await departmentById(departmentId);
      if (result.success) {
        setSelectedDepartment(result.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      toast.error("Xem chi tiết phòng ban không thành công!");
    }
  };

  // Open Edit Modal
  const openEditModal = (departmentData) => {
    setEditDepartment(departmentData);
    setIsEditModalOpen(true);
  };

  const handleEditDepartment = async (departmentData) => {
    const result = await updateDepartmentById(
      editDepartment._id,
      departmentData
    );
    if (result.success) {
      setIsEditModalOpen(false);
    }
  };

  // Delete Department
  const openDeleteModal = (department) => {
    setIsDeleteModalOpen(true);
    setSelectedDepartment(department);
  };

  const handleDeleteDepartment = async () => {
    if (selectedDepartment?._id) {
      const result = await deleteDepartmentById(selectedDepartment._id);
      if (result.success) {
        setIsDeleteModalOpen(false);
      }
    } else {
      toast.error("Lỗi: ID phòng ban không hợp lệ!");
    }
  };

  useEffect(() => {
    if (isAddModalOpen) {
      searchUserPag({
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        searchCondition: {
          keyword: "",
          role: "manager",
          is_verified: true,
          status: true,
          is_deleted: false,
        },
      });
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    searchListDepartment({
      is_deleted: false,
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  return (
    <div className="manager-department">
      <div className="header-manager-department">
        <button className="button-add__department" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo phòng ban mới
        </button>
      </div>

      {/* Table department */}
      <div className="form-department">
        <div className="department-container">
          <table className="table-department">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên phòng ban</th>
                <th>Mô tả</th>
                <th>Quản lý</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {departments?.length > 0 ? (
                departments.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.manager_id ? (
                        <>
                          {item.manager_id.first_name}{" "}
                          {item.manager_id.last_name} <br />
                          <span style={{ fontSize: "12px", color: "#888" }}>
                            {item.manager_id.email}
                          </span>
                        </>
                      ) : (
                        "Chưa có quản lý"
                      )}
                    </td>
                    <td>
                      <button
                        className="detail-department"
                        onClick={() => handleDetailDepartment(item._id)}
                      >
                        Chi tiết
                      </button>

                      <button
                        className="edit-department"
                        onClick={() => openEditModal(item)}
                      >
                        Sửa
                      </button>

                      <button
                        className="delete-department"
                        style={{ marginLeft: 8 }}
                        onClick={() => openDeleteModal(item)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Không có dữ liệu</td>
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

      {/* Modal create department */}
      <ModalCreateDepartment
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAdd={handleAddDepartment}
        managers={accounts}
        loadingManagers={loading}
      />

      {/* Update department */}
      <ModalEditDepartment
        isModalOpen={isEditModalOpen}
        handleCancel={() => setIsEditModalOpen(false)}
        handleEdit={handleEditDepartment}
        editDepartment={editDepartment}
      />

      {/* Modal details department */}
      <ModalDetailDepartment
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        selectedDepartment={selectedDepartment}
      />

      {/* Modal Delete */}
      <Modal
        title="Xác nhận xóa phòng ban"
        open={isDeleteModalOpen}
        onOk={handleDeleteDepartment}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa phòng ban{" "}
          <strong>{selectedDepartment?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}

export default DepartmentAdmin;
