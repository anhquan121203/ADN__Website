import React, { useEffect, useState } from "react";
import { Select, InputNumber, Button, DatePicker } from "antd";
import Search from "antd/es/input/Search";
import useDepartment from "../../../../Hooks/useDepartment";
import { format } from "date-fns";

const { RangePicker } = DatePicker;

function FilterStaffManager({ filters, setFilters, onSearch }) {
    const [currentPage, setCurrentPage] = useState(1);

  const defaultFilters = {
    keyword: "",
    department_id: "",
    status: "active",
    hire_date_from: "",
    hire_date_to: "",
  };

  const { departments, searchListDepartment } = useDepartment();

  useEffect(() => {
    searchListDepartment({
      is_deleted: false,
      is_active: true,
      pageNum: 1,
      pageSize: 100,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  const handleHireDate = (date) => {
    setFilters({
        ...filters,
        hire_date_from: date ? date[0]?.format("YYYY-MM-DD") : undefined,
        hire_date_from: date ? date[0]?.format("YYYY-MM-DD") : undefined
    })
  }

  return (
    <div
      className="filter-container"
      style={{
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
      <Search
        placeholder="Mã nhân viên hoặc công việc"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        style={{ width: 200 }}
      />

      <Select
        placeholder="Phòng lab"
        value={filters.department_id}
        onChange={(value) => setFilters({ ...filters, department_id: value })}
        style={{ width: 250 }}
        showSearch
        optionFilterProp="label"
      >
        {departments.map((department) => (
          <Select.Option
            key={department._id}
            value={department._id}
            label={department.name}
          >
            {department.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Trạng thái"
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
        style={{ width: 160 }}
        allowClear
      >
        <Select.Option value="active">Hoạt động</Select.Option>
        <Select.Option value="on_leave">Tạm dừng</Select.Option>
        <Select.Option value="terminated">Chấm dứt HĐ</Select.Option>
      </Select>

      <RangePicker onChange={handleHireDate} style={{ width: 250 }} />

      <Button
        type="primary"
        onClick={onSearch}
        style={{
          padding: "8px 16px",
          backgroundColor: "#1890ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          height: 33,
        }}
      >
        Tìm kiếm
      </Button>

      <Button
        color="cyan"
        variant="solid"
        onClick={() => setFilters(defaultFilters)}
      >
        Reset
      </Button>
    </div>
  );
}

export default FilterStaffManager;
