import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Pagination, Select, Spin } from "antd";
import "./DepartmentAdmin.css";
import useDepartment from "../../../Hooks/useDepartment";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import ModalCreateDepartment from "./ModalCreateDepartment/ModalCreateDepartment";
import ModalEditDepartment from "./ModalEditDepartment/ModalEditDepartment";
import ModalDetailDepartment from "./ModalDetailDepartment/ModalDetailDepartment";
import useAdmin from "../../../Hooks/useAdmin";
import FilterDepartment from "./FilterDepartment/FilterDepartment";

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
    getDepartmentsByManagerId,
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
  const [isInitialLoad, setIsInitialLoad] = useState(true); //dùng cho Dữ liệu thống kê phòng ban
  // State cho danh sách quản lý
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [managerDepartmentsList, setManagerDepartmentsList] = useState([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerDepartmentsCount, setManagerDepartmentsCount] = useState(0);
  // Open Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedDepartment(null);
  };
  // filterDepartment
  const [filters, setFilters] = useState({
    keyword: "",
    sort_by: "name",
    sort_order: "desc",
  });
  const handleSearch = () => {
    searchListDepartment({
      ...filters,
      is_deleted: false,
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
    });
  };
  // hàm tính này mặc định sẽ lấy dữ liệu từ ngày hiện tại đến 7 ngày sau
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStatDateFrom(today);
    const defaultToDate = new Date(today);
    defaultToDate.setDate(defaultToDate.getDate() + 7);
    setStatDateTo(defaultToDate.toISOString().split("T")[0]);
    getTotalDepartmentCount();
    if (departments.length > 0) {
      setStatDepartmentId(departments[0]._id);
    }
  }, [departments]);

  useEffect(() => {
    if (isInitialLoad && statDepartmentId && statDateFrom && statDateTo) {
      handleStatistic();
      setIsInitialLoad(false); // Chạy một lần duy nhất
    }
  }, [isInitialLoad, statDepartmentId, statDateFrom, statDateTo]);

  //xử lý việc gọi quản lý đầu tiên
  useEffect(() => {
    if (!selectedManagerId && accounts.length > 0) {
      const firstManagerId = accounts[0]._id;
      setSelectedManagerId(firstManagerId);

      // Gọi API để lấy danh sách phòng ban của người quản lý đầu tiên
      (async () => {
        setManagerLoading(true);
        try {
          const res = await getDepartmentsByManagerId(firstManagerId);
          const departments = res?.data?.data?.departments || [];
          const count = res?.data?.data?.count ?? departments.length;

          if (
            res?.success &&
            res?.data?.success &&
            Array.isArray(departments)
          ) {
            setManagerDepartmentsList(departments);
            setManagerDepartmentsCount(count);
          } else {
            throw new Error("Không thể lấy danh sách phòng ban.");
          }
        } catch (error) {
          setManagerDepartmentsList([]);
          setManagerDepartmentsCount(0);
          toast.error(error.message || "Lỗi khi gọi API.");
          console.error(error);
        }
        setManagerLoading(false);
      })();
    }
  }, [accounts]);

  // Handle Add Department
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
        role: ["manager"],
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
    fetchManagers();
  }, []);

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
      <div className="department-toolbar">
        <button className="button-add__department" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo phòng ban mới
        </button>
        <div style={{ flex: 1 }}>
          <FilterDepartment
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Danh sách phòng ban */}
      <div className="form-department">
        <div className="department-container">
          <h2 className="table-title">Danh sách phòng ban</h2>
          <span style={{ marginLeft: 16, fontWeight: 500 }}>
            Tổng số phòng ban: {count ?? 0}
          </span>
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
                    {/* <td>{item.description}</td> */}
                    <td>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    </td>
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
                        style={{ marginLeft: 8 }}
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

        {/* Dữ liệu thống kê phòng ban */}
        <div className="department-container" style={{ marginTop: 40 }}>
          <h2 className="table-title">Dữ liệu thống kê phòng ban</h2>
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
              onChange={(value) => setStatDepartmentId(value)}
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
              onChange={(e) => {
                const newDateFrom = e.target.value;
                setStatDateFrom(newDateFrom);
                const dateFrom = new Date(newDateFrom);
                const dateTo = new Date(dateFrom);
                dateTo.setDate(dateFrom.getDate() + 7);
                if (new Date(statDateTo) <= dateFrom) {
                  setStatDateTo(dateTo.toISOString().split("T")[0]);
                }
              }}
              placeholder="Từ ngày"
              style={{ minWidth: 140 }}
              max={statDateTo || undefined}
            />
            <Input
              type="date"
              value={statDateTo}
              onChange={(e) => {
                const newDateTo = e.target.value;
                setStatDateTo(newDateTo);
                const dateFrom = new Date(statDateFrom);
                if (new Date(newDateTo) <= dateFrom) {
                  const dateTo = new Date(dateFrom);
                  dateTo.setDate(dateFrom.getDate() + 1);
                  setStatDateTo(dateTo.toISOString().split("T")[0]);
                }
              }}
              placeholder="Đến ngày"
              style={{ minWidth: 140 }}
              min={
                statDateFrom
                  ? new Date(statDateFrom).toISOString().split("T")[0]
                  : undefined
              }
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
                      <td>{statResult.data.totalStaff}</td>
                      <td>{statResult.data.totalSlots}</td>
                      <td>{statResult.data.bookedSlots}</td>
                      <td>{statResult.data.bookingRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888" }}>Chưa có dữ liệu thống kê</div>
            )}
          </div>
        </div>

        {/* Danh sách phòng ban của quản lý */}
        {/* <div className="department-container" style={{ marginTop: 24 }}>
          <h2 className="table-title">Phòng ban do quản lý phụ trách</h2>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Select
              showSearch
              placeholder="Chọn quản lý"
              optionFilterProp="label"
              style={{ width: 240 }}
              value={selectedManagerId}
              onChange={async (managerId) => {
                setSelectedManagerId(managerId);
                setManagerLoading(true);
                try {
                  const res = await getDepartmentsByManagerId(managerId);
                  const departments = res?.data?.data?.departments || [];
                  const count = res?.data?.data?.count ?? departments.length;

                  if (
                    res?.success &&
                    res?.data?.success &&
                    Array.isArray(departments)
                  ) {
                    setManagerDepartmentsList(departments);
                    setManagerDepartmentsCount(count);
                  } else {
                    throw new Error("Không thể lấy danh sách phòng ban.");
                  }
                } catch (error) {
                  setManagerDepartmentsList([]);
                  setManagerDepartmentsCount(0);
                  toast.error(error.message || "Lỗi khi gọi API.");
                  console.error(error);
                }
                setManagerLoading(false);
              }}
              options={accounts?.map(
                ({ _id, first_name, last_name, email }) => ({
                  value: _id,
                  label: `${first_name} ${last_name} (${email})`,
                })
              )}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            {selectedManagerId && !managerLoading && (
              <div style={{ marginBottom: 8, color: "#555" }}>
                Tổng số phòng ban: {managerDepartmentsCount}
              </div>
            )}

            {managerLoading ? (
              <Spin />
            ) : managerDepartmentsList.length ? (
              <table className="table-department">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên phòng ban</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {managerDepartmentsList.map(
                    ({ _id, name, description }, i) => (
                      <tr key={_id}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td>{description}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#888" }}>
                {selectedManagerId
                  ? "Quản lý này chưa phụ trách phòng ban nào."
                  : "Chọn một quản lý để xem phòng ban."}
              </div>
            )}
          </div>
        </div> */}
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
