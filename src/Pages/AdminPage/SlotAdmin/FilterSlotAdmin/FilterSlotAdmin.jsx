import React, { useEffect, useState } from "react";
import {
  Select,
  Input,
  DatePicker,
  InputNumber,
  Button,
  TimePicker,
} from "antd";
import moment from "moment";
import useDepartment from "../../../../Hooks/useDepartment";
import useStaffProfile from "../../../../Hooks/useStaffProfile";

const { RangePicker } = DatePicker;

function FilterSlotAdmin({ filters, setFilters, onSearch, slots }) {
  const [currentPage, setCurrentPage] = useState(1);

  const defaultFilters = {
    pageNum: 1,
    pageSize: 10,
    staff_profile_ids: undefined,
    department_id: undefined,
    appointment_id: undefined,
    status: undefined,
    date_from: undefined,
    date_to: undefined,
    sort_by: "start_time",
    sort_order: "asc",
  };

  const { departments, searchListDepartment } = useDepartment();
  const { staffProfile, getListStaff } = useStaffProfile();

  useEffect(() => {
    getListStaff({ pageInfo: { pageNum: 1, pageSize: 100 } });
    searchListDepartment({
      is_deleted: false,
      is_active: true,
      pageNum: 1,
      pageSize: 100,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  // const staffOptions = Array.from(
  //   new Map(
  //     slots
  //       .flatMap((slot) => slot.staff_profile_ids || [])
  //       .map((profile) => [profile._id, profile])
  //   ).values()
  // );

  const handleDateChange = (dates) => {
    setFilters({
      ...filters,
      date_from: dates ? dates[0]?.format("YYYY-MM-DD") : undefined,
      date_to: dates ? dates[1]?.format("YYYY-MM-DD") : undefined,
    });
  };

  return (
    <div
      className="filter-container"
      style={{
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-start",
      }}
    >
      <Select
        placeholder="Nhân viên"
        mode="multiple"
        value={filters.staff_profile_ids}
        onChange={(value) =>
          setFilters({ ...filters, staff_profile_ids: value })
        }
        style={{ width: 180 }}
        allowClear
        showSearch
        optionFilterProp="label"
      >
        {staffProfile.map((staff) => (
          <Select.Option
            key={staff._id}
            value={staff._id}
            label={`${staff.user_id.last_name} ${staff.user_id.first_name}`}
          >
            {staff.user_id.last_name} {staff.user_id.first_name}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Phòng lab"
        value={filters.department_id}
        onChange={(value) => setFilters({ ...filters, department_id: value })}
        style={{ width: 180 }}
        allowClear
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

      <Input
        placeholder="Department ID"
        value={filters.department_id}
        onChange={(e) =>
          setFilters({ ...filters, department_id: e.target.value })
        }
        style={{ width: 160 }}
      />

      <Select
        placeholder="Trạng thái"
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
        style={{ width: 160 }}
        allowClear
      >
        <Select.Option value="available">Còn trống</Select.Option>
        <Select.Option value="booked">Đã đặt</Select.Option>
        <Select.Option value="unavailable">Không còn chỗ</Select.Option>
      </Select>

      {/* <RangePicker onChange={handleDateChange} style={{ width: 250 }} /> */}

      <Select
        placeholder="Thứ tự"
        value={filters.sort_order}
        onChange={(value) => setFilters({ ...filters, sort_order: value })}
        style={{ width: 120 }}
      >
        <Select.Option value="asc">Tăng dần</Select.Option>
        <Select.Option value="desc">Giảm dần</Select.Option>
      </Select>

      <Button type="primary" onClick={onSearch}>
        Tìm kiếm
      </Button>

      <Button onClick={() => setFilters(defaultFilters)}>Reset</Button>
    </div>
  );
}

export default FilterSlotAdmin;
