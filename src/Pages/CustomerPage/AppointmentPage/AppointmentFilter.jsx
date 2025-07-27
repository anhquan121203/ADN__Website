import React, { useState } from "react";
import { Input, Button, Select, DatePicker } from "antd";
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "sample_assigned", label: "Đã phân mẫu" },
  { value: "sample_collected", label: "Đã lấy mẫu" },
  { value: "sample_received", label: "Đã nhận mẫu" },
  { value: "testing", label: "Đang xét nghiệm" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "awaiting_authorization", label: "Chờ phê duyệt" },
  { value: "authorized", label: "Đã phê duyệt" },
  { value: "ready_for_collection", label: "Sẵn sàng trả kết quả" },
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