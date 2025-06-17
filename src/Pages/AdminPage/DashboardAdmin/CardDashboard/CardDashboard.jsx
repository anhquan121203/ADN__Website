import React from "react";
import "./CardDashboard.css";
import { FaArrowUp, FaCalendarAlt, FaLongArrowAltUp } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";

function CardDashboard() {
  return (
    <div className="card-dashboard">
      <div className="card--element">
        <div className="icon-card">
          <FiUsers />
        </div>
        <div className="card-user-info">
          <h2>Người dùng</h2>
          <p>1000</p>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <IoCalendarOutline />
        </div>
        <div className="card-user-info">
          <h2>Lịch làm việc</h2>
          <p>1000</p>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <IoCalendarOutline />
        </div>
        <div className="card-user-info">
          <h2>Users</h2>

          <div className="statics-card">
            <p>1000</p>
            <p className="statics">📈 11.01%</p>
          </div>
        </div>
      </div>

      <div className="card--element">
        <div className="icon-card">
          <IoCalendarOutline />
        </div>
        <div className="card-user-info">
          <h2>Users</h2>
          <p>1000</p>
        </div>
      </div>
    </div>
  );
}

export default CardDashboard;
