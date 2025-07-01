import React, { use, useEffect, useState } from "react";
import "./AdministrativeCaseAdmin.css";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";
import { toast } from "react-toastify";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useCase from "../../../Hooks/useCase";
import ModalDetailCaseAdmin from "./ModalDetailCaseAdmin/ModalDetailCaseAdmin";
import ModalCreateCaseAdmin from "./ModalAddCaseAdmin/ModalCreateCaseAdmin";
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

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="green">Đang chờ</Tag>;
      case "inactive":
        return <Tag color="red">Không hoạt động</Tag>;
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
                <th>Email cơ quan</th>
                <th>Người nộp đơn</th>
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
                    <td>
                      <div className="staffProfile-title">
                        <span className="title-name">
                          {item?.agency_contact_name}
                        </span>
                        <span className="title-email">
                          {item?.agency_contact_email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="staffProfile-title">
                        <span className="title-name">
                          {item?.applicant_name}
                        </span>
                        <span className="title-email">
                          {item?.applicant_email}
                        </span>
                      </div>
                    </td>
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
