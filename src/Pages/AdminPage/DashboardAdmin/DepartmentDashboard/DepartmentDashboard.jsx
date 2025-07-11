import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./DepartmentDashboard.css";
import useDepartment from "../../../../Hooks/useDepartment";

function DepartmentDashboard() {
  
  const {
    departments,
    searchListDepartment,
    fetchDepartmentStatistics,
  } = useDepartment();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllStatistics = async () => {
      try {
        setLoading(true);

        // 1. Lấy danh sách phòng ban
        const deptList = await searchListDepartment({
          is_deleted: false,
          is_active: true,
          pageNum: 1,
          pageSize: 100,
          sort_by: "created_at",
          sort_order: "desc",
        });

        // 2. Gọi API thống kê cho từng phòng ban
        for (const dept of deptList) {
          await fetchDepartmentStatistics({
            departmentId: dept.departmentId,
            date_from: null,
            date_to: null,
          });
        }
      } catch (error) {
        console.error("Error fetching department statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStatistics();
  }, []);

  // Tạo dữ liệu cho biểu đồ
  const data = departments.map((dept) => ({
    name: dept.name || dept.departmentId,
    st: dept.statistics?.totalStaff ?? 0,
    sl: dept.statistics?.totalSlots ?? 0,
    bs: dept.statistics?.bookedSlots ?? 0,
    br: dept.statistics?.bookingRate ?? 0,
  }));

  return (
    <div className="department-dashboard">
      <h1>Doanh số phòng ban</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="static-department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="st"
                name="Số nhân viên"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="sl"
                name="Tổng Slot"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
              <Bar
                dataKey="bs"
                name="Slot đã đặt"
                fill="#ffc658"
                activeBar={<Rectangle fill="orange" stroke="red" />}
              />
              <Bar
                dataKey="br"
                name="Tỷ lệ đặt (%)"
                fill="#ff7300"
                activeBar={<Rectangle fill="lightgreen" stroke="green" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DepartmentDashboard;
