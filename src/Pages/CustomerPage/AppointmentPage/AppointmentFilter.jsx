import React, { useState } from "react";
import { Input, Button, Select, DatePicker } from "antd";
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function AppointmentFilter({ onFilter }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const handleFilter = () => {
    onFilter({
      search_term: search,
      status,
      start_date: dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : undefined,
      end_date: dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Input
        placeholder="Tìm kiếm tên, địa chỉ..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 200 }}
      />
      <Select
        value={status}
        onChange={setStatus}
        options={statusOptions}
        style={{ width: 160 }}
      />
      <RangePicker value={dateRange} onChange={setDateRange} />
      <Button type="primary" onClick={handleFilter}>
        Lọc
      </Button>
    </div>
  );
}