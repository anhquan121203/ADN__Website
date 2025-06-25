import React, { use, useEffect, useState } from "react";
import "./AdministrativeCaseAdmin.css";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useCase from "../../../Hooks/useCase";


function AdministrativeCaseAdmin() {
  const {
    cases,
    addNewCase,
    caseById,
    deleteCaseById,
    searchListCase,
    error,
    loading,
    updateCaseById
  } = useCase();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedStaff, setSelectedStaff] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // modal update
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  // modal detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const renderStatus = (status) => {
    switch (status) {
      case "active":
        return <Tag color="green">Hoạt động</Tag>;
      case "inactive":
        return <Tag color="red">Không hoạt động</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  useEffect(() => {
    searchListCase();
  }, [currentPage]);



  return (
    <div className="manager-staffProfile">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          {" "}
          <h5>Dịch vụ hành chính</h5>
        </div>
        <div className="btn-managerAccount">
          <button className="button-add__account" >
            <FaPlus style={{ marginRight: "8px" }} />
            Tạo hành chính
          </button>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div>

        </div>
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã số hồ sơ</th>
                <th>Mã xác thực</th>
                <th>Email cơ quan</th>
                <th>Người liên hệ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cases?.length > 0 ? (
                cases.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item.case_number}</td>
                    <td>{item.authorization_code}</td>
                    <td>
                      <div className="staffProfile-title">
                        <span className="title-name">{item.agency_contact_name}</span>
                        <span className="title-email">
                          {item.agency_contact_email}
                        </span>
                      </div>
                    </td>
                    <td>{item.department_id?.name}</td>
                    <td>{item.job_title}</td>
                    <td>{renderStatus(item.status)}</td>

                    <td>
                      <div className="action-staffProfile">
                        <CiEdit
                          className="icon-service"
                          // onClick={() => openEditModal(item)}
                        />

                        <FaRegEye
                          className="icon-service"
                          // onClick={() => handleDetailStaff(item._id)}
                        />
                      </div>
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

export default AdministrativeCaseAdmin;
