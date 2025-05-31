import React, { useEffect } from "react";
import { Select, InputNumber, Button } from "antd";
import Search from "antd/es/input/Search";

function FilterService({ filters, setFilters, onSearch }) {

  const defaultFilters = {
    keyword: "",
    type: undefined,
    sample_method: undefined,
    is_active: true,
    min_price: undefined,
    max_price: undefined,
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
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        style={{ width: 200 }}
        allowClear
      />

      <Select
        placeholder="Loại dịch vụ"
        value={filters.type}
        onChange={(value) => setFilters({ ...filters, type: value })}
        style={{ width: 160 }}
        allowClear
      >
        <Select.Option value="civil">Dân sự</Select.Option>
        <Select.Option value="administrative">Hành chính</Select.Option>
      </Select>

      <Select
        placeholder="Phương thức lấy mẫu"
        value={filters.sample_method}
        onChange={(value) => setFilters({ ...filters, sample_method: value })}
        style={{ width: 180 }}
        allowClear
      >
        <Select.Option value="self_collected">Tự lấy mẫu</Select.Option>
        <Select.Option value="facility_collected">Tại cơ sở</Select.Option>
        <Select.Option value="home_collected">Tại nhà</Select.Option>
      </Select>

      <Select
        placeholder="Trạng thái"
        value={filters.is_active}
        onChange={(value) => setFilters({ ...filters, is_active: value })}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value={true}>Hoạt động</Select.Option>
        <Select.Option value={false}>Không hoạt động</Select.Option>
      </Select>

      <InputNumber
        placeholder="Giá tối thiểu"
        value={filters.min_price}
        style={{ height: 33 }}
        onChange={(value) => setFilters({ ...filters, min_price: value })}
        min={0}
      />

      <InputNumber
        placeholder="Giá tối đa"
        value={filters.max_price}
        style={{ height: 33 }}
        onChange={(value) => setFilters({ ...filters, max_price: value })}
        min={0}
      />

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

export default FilterService;
