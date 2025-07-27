import React, { use, useEffect, useState } from "react";
import "./AdministrativeCaseAdmin.css";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useCase from "../../../Hooks/useCase";
import ModalDetailCaseAdmin from "./ModalDetailCaseAdmin/ModalDetailCaseAdmin";
import ModalCreateCaseAdmin from "./ModalCreateCaseAdmin/ModalCreateCaseAdmin";
import ModalEditCaseAdmin from "./ModalEditCaseAdmin/ModalEditCaseAdmin";

function AdministrativeCaseAdmin() {
  const {
    cases,
    addNewCase,
    caseById,
    deleteCaseById,
    searchListCase,
    error,
    loading,
    updateCaseById,
  } = useCase();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedCase, setSelectedCase] = useState(null);
  // modal thêm tài khoản
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // modal update
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCase, setEditCase] = useState(null);
  // modal detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    searchListCase({
      is_deleted: false,
    });
  }, [currentPage]);

  // create case***********************************************
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedCase(null);
  };

  const handleAddCase = async (caseData) => {
    try {
      const result = await addNewCase(caseData);
      if (result.success) {
        setIsAddModalOpen(false);
        searchListCase({
          is_deleted: false,
        });
      }
      return result.data;
    } catch (error) {
      return {
        success: false,
        message: "Thêm không thành công!",
      };
    }
  };

  // update case***********************************************
  const openEditModal = (casedata) => {
    setEditCase(casedata);
    setIsEditModalOpen(true);
  };

  const handleEditCase = async (caseData) => {
    try {
      const result = await updateCaseById(editCase._id, caseData);
      if (result.success) {
        setIsEditModalOpen(false);
        searchListCase({
          is_deleted: false,
        });
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật không thành công!",
      };
    }
  };

  // detail case***********************************************
  const handleDetailCase = async (caseId) => {
    try {
      const result = await caseById(caseId);
      if (result.success) {
        setSelectedCase(result.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      return {
        success: false,
        message: "Xem chi tiết không thành công!",
      };
    }
  };

  // delete case************************************************
  const openDeleteModal = (caseData) => {
    setIsDeleteModalOpen(true);
    setSelectedCase(caseData);
  };

  const handleDeleteCase = async () => {
    if (selectedCase?._id) {
      const result = await deleteCaseById(selectedCase._id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        searchListCase({
          is_deleted: false,
        });
      }
    } else {
      toast.error("Lỗi: ID case không hợp lệ!");
    }
  };

  return (
    <div className="manager-staffProfile">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          {" "}
          <h5>Dịch vụ hành chính</h5>
        </div>
        <div className="btn-managerAccount">
          <button className="button-add__account" onClick={openAddModal}>
            <FaPlus style={{ marginRight: "8px" }} />
            Tạo hành chính
          </button>
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
                <th>Loại hồ sơ</th>
                <th>Mức độ khẩn cấp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cases?.length > 0 ? (
                cases.map((item, index) => (
                  <tr key={item?._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item?.case_number}</td>
                    <td>{item?.authorization_code}</td>
                    <td>{renderCaseType(item?.case_type)}</td>
                    <td>{renderUrgency(item?.urgency)}</td>
                    <td>{renderStatus(item?.status)}</td>

                    <td>
                      <div className="action-staffProfile">
                        <CiEdit
                          className="icon-service"
                          onClick={() => openEditModal(item)}
                        />

                        <FaRegEye
                          className="icon-service"
                          onClick={() => handleDetailCase(item._id)}
                        />

                        <MdDeleteOutline
                          className="icon-service"
                          onClick={() => {
                            openDeleteModal(item);
                          }}
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
        <ModalCreateCaseAdmin
          isModalOpen={isAddModalOpen}
          handleCancel={() => setIsAddModalOpen(false)}
          handleAdd={handleAddCase}
          existingCases={cases}
        />

        {/* Update service */}
        <ModalEditCaseAdmin
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditCase}
          editCase={editCase}
        />

        {/* Modal details case */}
        <ModalDetailCaseAdmin
          isModalOpen={isDetailModalOpen}
          handleCancel={() => setIsDetailModalOpen(false)}
          selectedCase={selectedCase}
        />

        {/* Modal Delete */}
        <Modal
          title="Xác nhận xóa case"
          open={isDeleteModalOpen}
          onOk={handleDeleteCase}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>
            Bạn có chắc chắn muốn xóa thiết bị{" "}
            <strong>{selectedCase?.case_number}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
}

export default AdministrativeCaseAdmin;
