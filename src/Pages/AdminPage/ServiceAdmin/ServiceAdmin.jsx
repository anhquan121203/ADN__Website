import React, { use, useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./ServiceAdmin.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";

import { FaPlus } from "react-icons/fa";
import useService from "../../../Hooks/useService";
import ModalCreateService from "./ModalCreateService/ModalCreateService";
import ModalDetailService from "./ModalDetailService/ModalDetailService";
import ModalEditService from "./ModalEditService/ModalEditService";

function ServiceAdmin() {
  const {
    services,
    total,
    loading,
    error,
    searchListService,
    addNewService,
    serviceById,
    updateServiceById,
    deleteServiceById,
  } = useService();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedService, setSelectedService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // update modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // create service
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedService(null);
  };

  const handleAddService = async (serviceData) => {
    try {
      const result = await addNewService(serviceData);
      if (result.success) {
        setIsAddModalOpen(false);
        // toast.success("Thêm thiết bị thành công!")
        searchListService({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      }
      return result.data;
    } catch (error) {
      toast.error("Thêm thiết bị không thành công!");
    }
  };

  // get service by ID
  const handleDetailService = async (serviceId) => {
    try {
      const result = await serviceById(serviceId);
      if (result.success) {
        setSelectedService(result.data.data);
        setIsDetailModalOpen(true);
      }
      // return result;
    } catch (error) {
      // toast.error("Thêm tài khoản không thành công");
      return {
        success: false,
        message: "Xem chi tiết tài khoản không thành công!",
      };
    }
  };

  // update service
  const openEditModal = (serviceData) => {
    setEditService(serviceData);
    setIsEditModalOpen(true);
  };

  const handleEditService = async (serviceData) => {
    try {
      const result = await updateServiceById(editService._id, serviceData);
      if (result.success) {
        setIsEditModalOpen(false);
        // toast.success("Cập nhật thiết bị thành công");
        searchListService({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      }
      return result.data;
    } catch (error) {
      return { success: false, message: "Cập nhật thiết bị không thành công" };
    }
  };

  // delete service
  const openDeleteModal = (service) => {
    setIsDeleteModalOpen(true);
    setSelectedService(service);
  };

  const handleDeleteService = () => {
    if(selectedService._id){
      deleteServiceById(selectedService._id);
      searchListService({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      toast.success("Xóa thiết bị thành công!");
      setIsDeleteModalOpen(false);
    }else {
      toast.error("Lỗi: ID sản phẩm không hợp lệ!");
    }
  }

  useEffect(() => {
    searchListService({
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <button className="button-add__account" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Tạo thiết bị mới
        </button>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div className="account-container">
          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {services?.length > 0 ? (
                services.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.type} </td>
                    <td>{item.sample_method} </td>
                    <td>{item.estimated_time} </td>
                    <td>{item.price} </td>
                    <td>{item.is_active ? "✅" : "❌"}</td>
                    <td>
                      <button
                        className="detail-account"
                        onClick={() => handleDetailService(item._id)}
                      >
                        Chi tiết
                      </button>

                      <button
                        className="edit-account"
                        onClick={() => openEditModal(item)}
                      >
                        Sửa
                      </button>

                      <button
                        className="delete-account"
                        style={{ marginLeft: 8 }}
                        onClick={() => openDeleteModal(item)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
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

      {/* Modal create service */}
      <ModalCreateService
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAdd={handleAddService}
      />

      {/* Update service */}
      <ModalEditService
        isModalOpen={isEditModalOpen}
        handleCancel={() => setIsEditModalOpen(false)}
        handleEdit={handleEditService}
        editService={editService}
      />

      {/* Modal details service */}
      <ModalDetailService
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        selectedService={selectedService}
      />

      {/* Modal Delete */}
      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isDeleteModalOpen}
        onOk={handleDeleteService}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa thiết bị{" "}
          <strong>{selectedService?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}

export default ServiceAdmin;
