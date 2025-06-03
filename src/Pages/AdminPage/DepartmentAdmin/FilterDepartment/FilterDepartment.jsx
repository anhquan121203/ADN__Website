import React from "react";
import { Select, Button, Input } from "antd";
import Search from "antd/es/input/Search";

function FilterDepartment({ filters, setFilters, onSearch }) {
  const defaultFilters = {
    keyword: "",
    sort_by: "name",
    sort_order: "desc",
  };

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
        placeholder="Tìm theo tên hoặc mô tả phòng ban"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        style={{ width: 200 }}
        allowClear
      />

      <Select
        placeholder="Sắp xếp theo"
        value={filters.sort_by}
        onChange={(value) => setFilters({ ...filters, sort_by: value })}
        style={{ width: 160 }}
      >
        <Select.Option value="name">Tên phòng ban</Select.Option>
        <Select.Option value="created_at">Ngày tạo</Select.Option>
        <Select.Option value="updated_at">Ngày cập nhật</Select.Option>
      </Select>

      <Select
        placeholder="Thứ tự"
        value={filters.sort_order}
        onChange={(value) => setFilters({ ...filters, sort_order: value })}
        style={{ width: 140 }}
      >
        <Select.Option value="asc">Tăng dần</Select.Option>
        <Select.Option value="desc">Giảm dần</Select.Option>
      </Select>

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

export default FilterDepartment;
