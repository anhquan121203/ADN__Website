import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { DatePicker, Space, Button } from "antd";
import useDashboard from "../../../../Hooks/useDashboard";

const { RangePicker } = DatePicker;

const RevenueDashboardAdmin = () => {
  const [chartData, setChartData] = useState([]);
  const { revenues, listDashboardRevenues } = useDashboard();

  const [dateRange, setDateRange] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(null);

  // Tìm kiếm theo khoảng thời gian
  const handleSearch = () => {
    if (tempDateRange && tempDateRange.length === 2) {
      const [start, end] = tempDateRange;
      setDateRange(tempDateRange);
      listDashboardRevenues({
        from: start.format("YYYY-MM-DD"),
        to: end.format("YYYY-MM-DD"),
      });
    } else {
      setDateRange(null);
      listDashboardRevenues({}); // không truyền from/to
    }
  };

  // Reset về không chọn ngày
  const handleReset = () => {
    setTempDateRange(null);
    setDateRange(null);
    listDashboardRevenues({});
  };

  // Hiển thị theo ngày
  const processDataByDay = (data) => {
    return data.map((item) => ({
      date: dayjs(item._id).format("YYYY-MM-DD"),
      total: item.total,
      count: item.count,
    }));
  };

  useEffect(() => {
    if (revenues?.length) {
      const dailyData = processDataByDay(revenues);
      setChartData(dailyData);
    }
  }, [revenues]);

  return (
    <div style={{ width: "100%", padding: 20 }} >
      <h3 style={{marginBottom: 20, fontSize: "25px"}}>Doanh thu & Số lượng mỗi ngày</h3>

      <Space style={{ marginBottom: 20 }}>
        <RangePicker
          value={tempDateRange}
          onChange={(dates) => setTempDateRange(dates)}
          format="YYYY-MM-DD"
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </Space>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            name="Revenue"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="count"
            stroke="#82ca9d"
            name="Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueDashboardAdmin;
