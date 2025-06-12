import React, { use, useEffect } from "react";
import { Select, InputNumber, Button } from "antd";
import Search from "antd/es/input/Search";
import { useAppointment } from "../../../../Hooks/useAppoinment";

function FilterKit({ filters, setFilters, onSearch }) {


  const defaultFilters = {
    code: "",
    status: "",
    appointment_id: "",
    assigned_to_user_id: "",
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
        placeholder="Tìm theo tên hoặc mô tả"
        value={filters.code}
        onChange={(e) => setFilters({ ...filters, code: e.target.value })}
        style={{ width: 200 }}
        allowClear
      />

      <Select
        placeholder="Trạng thái"
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
        style={{ width: 160 }}
        
      >
        <Select.Option value="available">Còn hàng</Select.Option>
        <Select.Option value="assigned">Đã gắn</Select.Option>
        <Select.Option value="used">Đã sử dụng</Select.Option>
        <Select.Option value="returned">Đã trả hàng</Select.Option>
        <Select.Option value="damaged">Đã hỏng</Select.Option>
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

      <Button color="cyan" variant="solid" onClick={() => setFilters(defaultFilters)}>
        Reset
      </Button>
    </div>
  );
}

export default FilterKit;
