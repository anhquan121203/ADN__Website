import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Pagination, Select, Spin, Table } from "antd";
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
    statistics,
    count,
    searchListDepartment,
    addNewDepartment,
    departmentById,
    updateDepartmentById,
    deleteDepartmentById,
    fetchDepartmentStatistics,
    getTotalDepartmentCount,
  } = useDepartment();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State cho thống kê
  const [statDepartmentId, setStatDepartmentId] = useState(null);
  const [statDateFrom, setStatDateFrom] = useState("");
  const [statDateTo, setStatDateTo] = useState("");
  const [statLoading, setStatLoading] = useState(false);
  const [statResult, setStatResult] = useState(null);

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
        toast.success("Thêm phòng ban thành công!");
        searchListDepartment({
          is_deleted: false,
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
        getTotalDepartmentCount();
      } else {
        toast.error("Thêm phòng ban không thành công!");
      }
      return result?.data;
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
    try {
      const result = await updateDepartmentById(
        editDepartment._id,
        departmentData
      );
      if (result.success) {
        setIsEditModalOpen(false);
        toast.success("Cập nhật phòng ban thành công!");
        searchListDepartment({
          is_deleted: false,
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      } else {
        toast.error("Cập nhật phòng ban không thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật phòng ban không thành công!");
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
        getTotalDepartmentCount();
      }
    } else {
      toast.error("Lỗi: ID phòng ban không hợp lệ!");
    }
  };

  // Xử lý thống kê
  const handleStatistic = async () => {
    if (!statDepartmentId) {
      toast.error("Vui lòng chọn phòng ban!");
      return;
    }
    setStatLoading(true);
    const res = await fetchDepartmentStatistics({
      departmentId: statDepartmentId,
      date_from: statDateFrom || undefined,
      date_to: statDateTo || undefined,
    });
    setStatLoading(false);
    if (res.success) {
      console.log("statResult:", res.data);
      setStatResult(res.data);
    } else {
      setStatResult(null);
      toast.error("Không lấy được dữ liệu thống kê!");
    }
  };

  const fetchManagers = () => {
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
  };
  useEffect(() => {
    getTotalDepartmentCount();
  }, []);

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      fetchManagers();
    }
  }, [isAddModalOpen, isEditModalOpen]);

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
      <span style={{ marginLeft: 16, fontWeight: 500 }}>
        Tổng số phòng ban: {count ?? 0}
      </span>
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

        <div
          style={{
            marginTop: 40,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Dữ liệu thống kê phòng ban</h2>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Select
              style={{ minWidth: 220 }}
              placeholder="Chọn phòng ban"
              value={statDepartmentId}
              onChange={setStatDepartmentId}
              options={departments.map((d) => ({
                value: d._id,
                label: d.name,
              }))}
              showSearch
              optionFilterProp="label"
            />
            <Input
              type="date"
              value={statDateFrom}
              onChange={(e) => setStatDateFrom(e.target.value)}
              placeholder="Từ ngày"
              style={{ minWidth: 140 }}
              max={statDateTo || undefined}
            />
            <Input
              type="date"
              value={statDateTo}
              onChange={(e) => setStatDateTo(e.target.value)}
              placeholder="Đến ngày"
              style={{ minWidth: 140 }}
              min={statDateFrom || undefined}
            />
            <Button type="primary" onClick={handleStatistic}>
              Thống kê
            </Button>
          </div>
          <div style={{ marginTop: 24 }}>
            {statLoading ? (
              <Spin />
            ) : statResult ? (
              <div className="department-container">
                <table className="table-department">
                  <thead>
                    <tr>
                      <th>Tổng nhân sự</th>
                      <th>Tổng ca làm</th>
                      <th>Ca đã đặt</th>
                      <th>Tỉ lệ đặt ca (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{statResult.totalStaff}</td>
                      <td>{statResult.totalSlots}</td>
                      <td>{statResult.bookedSlots}</td>
                      <td>{statResult.bookingRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888" }}>Chưa có dữ liệu thống kê</div>
            )}
          </div>
        </div>
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
        managers={accounts}
        loadingManagers={loading}
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
