import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useDashboard from "../../../../Hooks/useDashboard";

// Màu sắc cho từng trạng thái
const COLORS = ["#FFBB28", "#00C49F"];

const PaymentDashboardAdmin = () => {
  const { dashboards, listDashboardPayment } = useDashboard();

  console.log(dashboards)

  useEffect(() => {
    listDashboardPayment();
  }, [listDashboardPayment]);

  // Chuyển đổi dữ liệu từ Redux sang dạng PieChart cần
  const pieData = [
    { name: "Chờ xác nhận", value: dashboards?.pending || 0 },
    { name: "Hoàn thành", value: dashboards?.completed || 0 },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Trạng thái thanh toán</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentDashboardAdmin;
