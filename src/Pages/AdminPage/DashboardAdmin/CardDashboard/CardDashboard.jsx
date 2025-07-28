import React, { useEffect } from "react";
import "./CardDashboard.css";
import { FaArrowUp, FaCalendarAlt, FaLongArrowAltUp } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoCalendarOutline, IoDocumentTextOutline } from "react-icons/io5";
import useDashboard from "../../../../Hooks/useDashboard";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

function CardDashboard() {
  const { summary, loading, error, total, listDashboardSumary } =
    useDashboard();

  useEffect(() => {
    listDashboardSumary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-dashboard">
      <div className="card--element">
        <div className="icon-card">
          <FiUsers />
        </div>
        <div className="card-user-info">
          <h2>Người dùng</h2>
          <p>{summary?.users}</p>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <IoCalendarOutline />
        </div>
        <div className="card-user-info">
          <h2>Số liệu đặt lịch</h2>
          <p>{summary?.appointments}</p>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <IoDocumentTextOutline />
        </div>
        <div className="card-user-info">
          <h2>Số lượng mẫu xét nghiệm</h2>
          <div className="statics-card">
            <p>{summary?.samples}</p>
            {/* <p className="statics">📈 11.01%</p> */}
          </div>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <RiMoneyDollarCircleLine />
        </div>
        <div className="card-user-info">
          <h2>Doanh thu</h2>
          <p>{summary?.revenue?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default CardDashboard;
