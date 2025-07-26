import React, { use, useEffect, useState } from "react";
// import "./AdministrativeCaseAdmin.css";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useCase from "../../../Hooks/useCase";
import ModalCreateAppointAdmin from "./ModalCreateAppointAdmin/ModalCreateAppointAdmin";
import useAppointmentAdmin from "../../../Hooks/useAppointmentAdmin";

function StaffAppointmentAdmin() {
  const {
    addNewAppointmentAdmin,
    validateAppointment,
    appointmentAdmins,
    error,
  } = useAppointmentAdmin();

  const { assignCase, searchListAssignCase } = useCase();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // modal update

  // Render type====================================================================
  const renderStatus = (status) => {
    switch (status) {
      case "submitted":
        return <Tag color="blue">Đã gửi</Tag>;
      case "under_review":
        return <Tag color="orange">Đang xem xét</Tag>;
      case "approved":
        return <Tag color="green">Đã duyệt</Tag>;
      case "scheduled":
        return <Tag color="purple">Đã lên lịch</Tag>;
      case "completed":
        return <Tag color="cyan">Đã hoàn thành</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  const renderUrgency = (urgency) => {
    switch (urgency) {
      case "low":
        return <Tag color="green">Thấp</Tag>;
      case "normal":
        return <Tag color="blue">Bình thường</Tag>;
      case "high":
        return <Tag color="orange">Cao</Tag>;
      case "urgent":
        return <Tag color="red">Khẩn cấp</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  const renderCaseType = (case_type) => {
    switch (case_type) {
      case "paternity":
        return <Tag color="gold">Quan hệ cha con</Tag>;
      case "maternity":
        return <Tag color="cyan">Quan hệ mẹ con</Tag>;
      case "sibling":
        return <Tag color="green">Quan hệ anh chị em ruột</Tag>;
      case "kinship":
        return <Tag color="blue">Quan hệ họ hàng</Tag>;
      case "immigration":
        return <Tag color="purple">Nhập cư</Tag>;
      case "inheritance":
        return <Tag color="volcano">Thừa kế</Tag>;
      case "criminal_case":
        return <Tag color="red">Vụ án hình sự</Tag>;
      case "civil_case":
        return <Tag color="orange">Vụ án dân sự</Tag>;
      case "missing_person":
        return <Tag color="magenta">Người mất tích</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  useEffect(() => {
    searchListAssignCase({
      case_number: "",
      case_type: "",
    });
  }, [currentPage]);

  // create case***********************************************
  const openAddModal = (item) => {
    setIsAddModalOpen(true);
    setSelectedAdmin(item?._id);
  };

  const handleAddAppointAdmin = async (createNewAdmin) => {
    try {
      const result = await addNewAppointmentAdmin({
        caseId: selectedAdmin,
        createNewAdmin,
      });
  
      if (result.success) {
        setIsAddModalOpen(false);
        return result;
      }
    } catch (error) {
      toast.error("Tạo hồ sơ đặt lịch không thành công!");
    }
  };
  
  // update case***********************************************

  return (
    <div className="manager-staffProfile">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          {" "}
          <h5>Danh sách dịch vụ hành chính</h5>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div></div>
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã số hồ sơ</th>
                <th>Mã xác thực</th>
                <th>Nhân viên</th>
                <th>Loại hồ sơ</th>
                <th>Mức độ khẩn cấp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {assignCase?.length > 0 ? (
                assignCase.map((item, index) => (
                  <tr key={item?._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item?.case_number}</td>
                    <td>{item?.authorization_code}</td>
                    <td>
                      <div className="staffProfile-title">
                        <span className="title-name">{`${item.assigned_staff_id?.first_name} ${item.assigned_staff_id?.last_name}`}</span>
                        <span className="title-email">
                          {item.assigned_staff_id?.email}
                        </span>
                      </div>
                    </td>
                    <td>{renderCaseType(item.case_type)}</td>
                    <td>{renderUrgency(item?.urgency)}</td>
                    <td>{renderStatus(item?.status)}</td>

                    <td>
                      <div className="action-staffProfile">
                        <CiEdit
                          className="icon-service"
                          onClick={() => openAddModal(item)}
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

        {/* Modal create service */}
        <ModalCreateAppointAdmin
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddAppointAdmin}
          caseId={selectedAdmin}
        />
      </div>
    </div>
  );
}

export default StaffAppointmentAdmin;
