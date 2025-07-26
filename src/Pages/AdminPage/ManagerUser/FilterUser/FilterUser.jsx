// UserFilter.jsx
import React from "react";
import { Button, Select } from "antd";
import Search from "antd/es/input/Search";

function UserFilter({ filters, setFilters, onSearch }) {
  return (
    <div
      className="filter-container"
      style={{
        marginBottom: "20px",
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      <Search
        placeholder="Nhập tên cần tìm kiếm..."
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        style={{ width: 200 }}
      />

      <Select
        placeholder="Chọn vai trò"
        mode="multiple"
        value={filters.role}
        onChange={(value) => setFilters({ ...filters, role: value })}
        style={{ width: 200 }}
        allowClear
      >
        <Select.Option value="staff">Nhân viên</Select.Option>
        <Select.Option value="customer">Khách hàng</Select.Option>
        <Select.Option value="manager">Quản lý</Select.Option>
        <Select.Option value="laboratory_technician">
          Xét nghiệm viên
        </Select.Option>
      </Select>

      <Select
        placeholder="Xác thực"
        value={filters.is_verified}
        onChange={(value) => setFilters({ ...filters, is_verified: value })}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value={true}>Đã xác thực</Select.Option>
        <Select.Option value={false}>Chưa xác thực</Select.Option>
      </Select>

      <Select
        placeholder="Trạng thái"
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value={true}>Hoạt động</Select.Option>
        <Select.Option value={false}>Bị khóa</Select.Option>
      </Select>

      <Select
        placeholder="Chưa xóa"
        value={filters.is_deleted}
        onChange={(value) => setFilters({ ...filters, is_deleted: value })}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value={false}>Chưa xóa</Select.Option>
        <Select.Option value={true}>Đã xóa</Select.Option>
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

    </div>
  );
}

export default UserFilter;
