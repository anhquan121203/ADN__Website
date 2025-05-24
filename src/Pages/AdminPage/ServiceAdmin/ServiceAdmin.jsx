import React, { use, useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import "./ServiceAdmin.css";
import useAdmin from "../../../Hooks/useAdmin";
import { toast } from "react-toastify";

import { FaPlus } from "react-icons/fa";
import useService from "../../../Hooks/useService";
import ModalCreateService from "./ModalCreateService/ModalCreateService";
import ModalDetailService from "./ModalDetailService/ModalDetailService";

function ServiceAdmin() {
  const { services, total, loading, error, searchListService, addNewService, serviceById } = useService();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedService, setSelectedService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // create service
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setSelectedService(null);
  }

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
      toast.error("Thêm thiết bị không thành công!")
    }
  }

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
                <th>Mô tả</th>
                <th>Loại</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Giá tiền</th>
                <th>Ngày tạo</th>
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
                    <td>{item.description} </td>
                    <td>{item.type} </td>
                    <td>{item.sample_method} </td>
                    <td>{item.estimated_time} </td>
                    <td>{item.price} </td>
                    <td>{item.created_at} </td>
                    <td>{item.is_active ? "✅" : "❌"}</td>
                    <td>
                      <button
                        className="detail-account"
                        onClick={() => handleDetailService(item._id)}
                      >
                        Chi tiết
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
        handleAdd={handleAddService} />

      {/* Modal details service */}
      <ModalDetailService
      isModalOpen={isDetailModalOpen}
      handleCancel={() => setIsDetailModalOpen(false)}
      selectedService={selectedService}/>
    </div>
  );
}

export default ServiceAdmin;
