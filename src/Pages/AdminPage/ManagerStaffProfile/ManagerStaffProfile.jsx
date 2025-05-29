import React, { use, useEffect, useState } from "react";
import { Modal, Pagination, Popconfirm, Select, Switch } from "antd";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";

function ManagerStaffProfile() {
  const { accounts, total, loading, error, getListStaff } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedUser, setSelectedUser] = useState(null);
  // modal thêm tài khoản

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  // display role
  const getRoleName = (role) => {
    switch (role) {
      case "staff":
        return "Nhân viên";
      case "customer":
        return "Khách hàng";
      case "manager":
        return "Quản lý";
      case "laboratory_technician":
        return "Người xét nghiệm";
      default:
        return role;
    }
  };

  useEffect(() => {
    getListStaff({
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
      searchCondition: {
        keyword: "",
        status: "",
      },
    });
  }, [currentPage]);

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <button className="button-add__account">
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo tài khoản
        </button>
      </div>

      {/* Table account */}
      <div className="form-account">
        <h5>Danh sách người dùng</h5>
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Xác thực</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts?.length > 0 ? (
                accounts.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{`${item.user_id?.first_name} ${item.user_id?.last_name}`}</td>
                    <td>{item.user_id?.email}</td>
                    <td>{item.job_title}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {/* Nếu có xác thực thì xử lý ở đây, ví dụ giả định là luôn true */}
                      <span className="status-badge active">Đã xác thực</span>
                    </td>
                    <td>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        />
      </div>
    </div>
  );
}

export default ManagerStaffProfile;
