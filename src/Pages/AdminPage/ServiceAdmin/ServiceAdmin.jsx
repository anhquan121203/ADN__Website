import React, { useEffect, useState } from "react";
import { Image, Modal, Pagination, Popconfirm } from "antd";
import "./ServiceAdmin.css";
import { toast } from "react-toastify";

import { FaPlus, FaRegEye } from "react-icons/fa";
import useService from "../../../Hooks/useService";
import ModalCreateService from "./ModalCreateService/ModalCreateService";
import ModalDetailService from "./ModalDetailService/ModalDetailService";
import ModalEditService from "./ModalEditService/ModalEditService";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import FilterService from "./FilterService/FilterService";

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
    changeStatusService,
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

  const cancel = (e) => {
    message.error("Click on No");
  };

  useEffect(() => {
    searchListService({
      is_active: true,
      pageNum: currentPage,
      pageSize: pageSize,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, [currentPage]);

  // Filter service
  const [filters, setFilters] = useState({
    type: "",
    sample_method: "",
    is_active: true,
    min_price: "",
    max_price: "",
    keyword: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const handleSearch = () => {
    searchListService({
      ...filters,
      pageNum: currentPage,
      pageSize: pageSize,
    });
  };

  // type Service
  const getType = (type) => {
    switch (type) {
      case "civil":
        return "Dân sự";
      case "administrative":
        return "Hành chính";
      default:
        return type;
    }
  };

  const getSampleMethod = (sample_method) => {
    switch (sample_method) {
      case "home_collected":
        return "Lấy mẫu tại nhà";
      case "self_collected":
        return "Tư lấy mẫu";
      case "facility_collected":
        return "Lấy mẫu tại cơ sở";
      default:
        return sample_method;
    }
  };

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
      toast.error("Thêm dịch vụ không thành công!");
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
        message: "Xem chi tiết không thành công!",
      };
    }
  };

  // update service
  const openEditModal = (serviceData) => {
    setEditService(serviceData);
    setIsEditModalOpen(true);
  };

  const handleEditService = async (serviceData) => {
    const result = await updateServiceById(editService._id, serviceData);
    if (result.success) {
      setIsEditModalOpen(false);
    }
  };

  // delete service
  const openDeleteModal = (service) => {
    setIsDeleteModalOpen(true);
    setSelectedService(service);
  };

  const handleDeleteService = async () => {
    if (selectedService?._id) {
      const result = await deleteServiceById(selectedService._id);
      if (result.success) {
        setIsDeleteModalOpen(false);
      }
    } else {
      toast.error("Lỗi: ID thiết bị không hợp lệ!");
    }
  };

  // change status
  const handleChangeStatus = async (service) => {
    try {
      const result = await changeStatusService({
        id: service._id,
        status: !service.is_active,
      });
      if (result?.success) {
        toast.success("Thay đổi trạng thái thành công");
        // reload lại danh sách nếu cần
        searchListService({
          is_active: true,
          pageNum: currentPage,
          pageSize: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
        });
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái không thành công");
    }
  };

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          <h5>Danh sách dịch vụ</h5>
        </div>

        <div className="btn-managerAccount">
          <button className="button-add__account" onClick={openAddModal} style={{ width: 180, height: 45 }}>
            <FaPlus style={{ marginRight: 10 }} />
            Tạo dịch vụ mới
          </button>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div className="account-container">
          <FilterService
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />

          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Giá tiền</th>
                <th>Hình ảnh</th>
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
                    <td> {getType(item.type)} </td>
                    <td>{getSampleMethod(item.sample_method)} </td>
                    <td>{item.estimated_time} </td>
                    <td>{item.price?.toLocaleString()} VND </td>
                    <td><Image width={100} src={item.image_url || "N/A" }/></td>
                    <td>
                      <span
                        className={`status-badge ${item.is_active ? "active" : "inactive"
                          }`}
                      >
                        {item.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td>
                      <div className="action-service">
                        <CiEdit
                          className="icon-service"
                          onClick={() => openEditModal(item)}
                        />

                        <MdDeleteOutline
                          className="icon-service"
                          onClick={() => openDeleteModal(item)}
                        />

                        <FaRegEye
                          className="icon-service"
                          onClick={() => handleDetailService(item._id)}
                        />

                        <Popconfirm
                          title="Khóa tài khoản"
                          description="Bạn có muốn khóa tài khoản này không?"
                          onConfirm={() => handleChangeStatus(item)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <MdBlock className="icon-service" />
                        </Popconfirm>
                      </div>
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
