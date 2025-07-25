import "./DepartmentManager.css";
import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Modal, Pagination, Select, Spin, Table } from "antd";
import useDepartment from "../../../Hooks/useDepartment";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import ModalEditDepartmentManager from "./ModalEditDepartmentManager/ModalEditDepartmentManager";
import ModalDetailDepartmentManager from "./ModalDetailDepartmentManager/ModalDetailDepartmentManager";
import FilterDepartmentManager from "./FilterDepartmentManager/FilterDepartmentManager";
import { CiEdit } from "react-icons/ci";

function DepartmentManager() {
  const {
    departments,
    total,
    loading,
    error,
    statistics,
    count,
    searchListDepartment,
    departmentById,
    updateDepartmentById,
    fetchDepartmentStatistics,
    getTotalDepartmentCount,
    getDepartmentsByManagerId,
  } = useDepartment();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);

  // State cho thống kê
  const [statDepartmentId, setStatDepartmentId] = useState(null);
  const [statDateFrom, setStatDateFrom] = useState("");
  const [statDateTo, setStatDateTo] = useState("");
  const [statLoading, setStatLoading] = useState(false);
  const [statResult, setStatResult] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // State cho danh sách quản lý
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [managerDepartmentsList, setManagerDepartmentsList] = useState([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerDepartmentsCount, setManagerDepartmentsCount] = useState(0);

  // filterDepartment
  const [filters, setFilters] = useState({
    keyword: "",
    sort_by: "name", // mặc định là name
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
  }, [departments]);

  useEffect(() => {
    if (isInitialLoad && statDateFrom && statDateTo) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, statDateFrom, statDateTo]);

  // Lấy danh sách managers từ danh sách departments, loại bỏ trùng lặp
  const managers = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];
    const result = [];
    const ids = new Set();
    departments.forEach((d) => {
      if (d.manager_id && d.manager_id._id && !ids.has(d.manager_id._id)) {
        result.push(d.manager_id);
        ids.add(d.manager_id._id);
      }
    });
    return result;
  }, [departments]);

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

  // Xử lý thống kê
  // const handleStatistic = async () => {
  //   if (!statDepartmentId) {
  //     toast.error("Vui lòng chọn phòng ban!");
  //     return;
  //   }
  //   setStatLoading(true);
  //   const res = await fetchDepartmentStatistics({
  //     departmentId: statDepartmentId,
  //     date_from: statDateFrom || undefined,
  //     date_to: statDateTo || undefined,
  //   });
  //   setStatLoading(false);
  //   if (res.success) {
  //     setStatResult(res.data);
  //   } else {
  //     setStatResult(null);
  //     toast.error("Không lấy được dữ liệu thống kê!");
  //   }
  // };

  useEffect(() => {
    getTotalDepartmentCount();
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
      <div className="header-manager-department"></div>
      <FilterDepartmentManager
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />
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
                      <div className="action-manager-department">
                        <FaRegEye
                          className="icon-manager-department"
                          onClick={() => handleDetailDepartment(item._id)}
                        />

                        <CiEdit
                          className="icon-manager-department"
                          onClick={() => openEditModal(item)}
                        />
                      </div>
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
        {/* <div
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
        </div> */}

        {/* Danh sách phòng ban của quản lý */}
        {/* <div style={{ marginTop: 24 }}>
          <h3>Phòng ban do quản lý phụ trách</h3>

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
              options={managers?.map(
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

      {/* Update department */}
      <ModalEditDepartmentManager
        isModalOpen={isEditModalOpen}
        handleCancel={() => setIsEditModalOpen(false)}
        handleEdit={handleEditDepartment}
        editDepartment={editDepartment}
        managers={managers}
        loadingManagers={loading}
      />

      {/* Modal details department */}
      <ModalDetailDepartmentManager
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        selectedDepartment={selectedDepartment}
        statDateFrom={statDateFrom}
        setStatDateFrom={setStatDateFrom}
        statDateTo={statDateTo}
        setStatDateTo={setStatDateTo}
        statLoading={statLoading}
        setStatLoading={setStatLoading}
        statResult={statResult}
        setStatResult={setStatResult}
        fetchDepartmentStatistics={fetchDepartmentStatistics}
      />
    </div>
  );
}

export default DepartmentManager;
