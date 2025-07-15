import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

// Dữ liệu từ API
const rawData = [
  { _id: "2025-06-01", total: 1500000, count: 1 },
  { _id: "2025-06-02", total: 1500000, count: 1 },
  { _id: "2025-06-26", total: 2000, count: 2 },
  { _id: "2025-06-27", total: 2000, count: 1 },
  { _id: "2025-07-02", total: 4400, count: 2 },
  { _id: "2025-07-04", total: 2000, count: 1 },
];

// Hàm nhóm dữ liệu theo tháng
const processDataByMonth = (data) => {
  const monthlyData = {};

  data.forEach((item) => {
    const month = dayjs(item._id).format("MMM");
    if (!monthlyData[month]) {
      monthlyData[month] = { month, total: 0, count: 0 };
    }
    monthlyData[month].total += item.total;
    monthlyData[month].count += item.count;
  });

  return Object.values(monthlyData);
};

const RevenueDashboardAdmin = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const monthlyData = processDataByMonth(rawData);
    setChartData(monthlyData);
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>Revenue & Count per Month</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="total" stroke="#8884d8" name="Revenue" />
          <Line yAxisId="right" type="monotone" dataKey="count" stroke="#82ca9d" name="Count" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueDashboardAdmin;
