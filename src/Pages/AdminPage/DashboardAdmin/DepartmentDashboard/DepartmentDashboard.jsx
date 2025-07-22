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
  const { searchListDepartment, fetchDepartmentStatistics } = useDepartment();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAllStatistics = async () => {
      try {
        setLoading(true);

        const result = await searchListDepartment({
          is_deleted: false,
          is_active: true,
          pageNum: 1,
          pageSize: 100,
          sort_by: "created_at",
          sort_order: "desc",
        });

        const departmentList = result?.data?.pageData || [];

        const chartDataTemp = [];

        // thống kê cho từng phòng ban
        for (const dept of departmentList) {
          const statRes = await fetchDepartmentStatistics({
            departmentId: dept._id,
            date_from: null,
            date_to: null,
          });

          chartDataTemp.push({
            name: dept.name?.slice(0, 15) || dept._id,
            st: statRes?.data?.totalStaff ?? 0,
            sl: statRes?.data?.totalSlots ?? 0,
            bs: statRes?.data?.bookedSlots ?? 0,
            br: Number(statRes?.data?.bookingRate ?? 0)
          });
        }

        setChartData(chartDataTemp);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê phòng ban:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStatistics();
  }, []);

  return (
    <div className="department-dashboard">
      <h1>Doanh số phòng ban</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="static-department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
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
