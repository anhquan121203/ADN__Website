import React, { useEffect, useState } from "react";
import { Image, Modal, Pagination, Popconfirm, Tag } from "antd";
import "./ServiceManager.css";
import { toast } from "react-toastify";

import { FaPlus, FaRegEye } from "react-icons/fa";
import useService from "../../../Hooks/useService";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import FilterServiceManager from "./FilterServiceManager/FilterServiceManager";
import CreateServiceManager from "./CreateServiceManager/CreateServiceManager";
import EditServiceManager from "./EditServiceManager/EditServiceManager";
import DetailServiceManager from "./DetailServiceManager/DetailServiceManager";

function ServiceManager() {
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

  // state để quản lý dịch vụ con
  const [expandedServiceId, setExpandedServiceId] = useState(null);

  const toggleExpandService = (serviceId) => {
    setExpandedServiceId((prev) => (prev === serviceId ? null : serviceId));
  };

  const parentServices = services.filter(
    (service) => !service.parent_service_id
  );
  const childServices = services.filter((service) => service.parent_service_id);

  // state filter khi tìm kiếm
  const [isFiltering, setIsFiltering] = useState(false);

  // Hiển thị danh sách dịch vụ
  useEffect(() => {
    setIsFiltering(false);
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
    setIsFiltering(true);
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
        return <Tag color="blue">Dân sự</Tag>;
      case "administrative":
        return <Tag color="purple">Hành chính</Tag>;
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
    return result;
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
          <button
            className="button-add__account"
            onClick={openAddModal}
            style={{ width: 180, height: 45 }}
          >
            <FaPlus style={{ marginRight: 10 }} />
            Tạo dịch vụ mới
          </button>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div className="account-container">
          <FilterServiceManager
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            setIsFiltering={setIsFiltering}
          />

          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Thời gian</th>
                <th>Giá tiền</th>
                <th>Hình ảnh</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isFiltering ? (
                // Hiển thị phẳng danh sách services khi filter
                services.length > 0 ? (
                  services.map((service, index) => (
                    <tr key={service._id}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{service.name}</td>
                      <td>{getType(service.type)}</td>
                      <td>{service.estimated_time}</td>
                      <td>{service.price?.toLocaleString()} VND</td>
                      <td>
                        <Image
                          width={120}
                          height={100}
                          src={
                            service.image_url ||
                            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"
                          }
                        />
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            service.is_active ? "active" : "inactive"
                          }`}
                        >
                          {service.is_active ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td>
                        <div className="action-service">
                          <CiEdit
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(service);
                            }}
                          />
                          <MdDeleteOutline
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(service);
                            }}
                          />
                          <FaRegEye
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDetailService(service._id);
                            }}
                          />
                          <Popconfirm
                            title="Khóa dịch vụ"
                            description="Bạn có muốn khóa dịch vụ này không?"
                            onConfirm={() => handleChangeStatus(service)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <MdBlock
                              className="icon-service"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Không có dữ liệu</td>
                  </tr>
                )
              ) : // Hiển thị cha/con khi không lọc
              parentServices.length > 0 ? (
                parentServices.map((parent, index) => (
                  <React.Fragment key={parent._id}>
                    {/* Dịch vụ cha */}
                    <tr onClick={() => toggleExpandService(parent._id)}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{parent.name}</td>
                      <td>{getType(parent.type)}</td>
                      <td>{parent.estimated_time}</td>
                      <td>{parent.price?.toLocaleString()} VND</td>
                      <td>
                        <Image
                          width={120}
                          height={100}
                          src={
                            parent.image_url ||
                            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"
                          }
                        />
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            parent.is_active ? "active" : "inactive"
                          }`}
                        >
                          {parent.is_active ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td>
                        <div className="action-service">
                          <CiEdit
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(parent);
                            }}
                          />
                          <MdDeleteOutline
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(parent);
                            }}
                          />
                          <FaRegEye
                            className="icon-service"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDetailService(parent._id);
                            }}
                          />
                          <Popconfirm
                            title="Khóa dịch vụ"
                            description="Bạn có muốn khóa dịch vụ này không?"
                            onConfirm={() => handleChangeStatus(parent)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <MdBlock
                              className="icon-service"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>

                    {/* Dịch vụ con nếu cha được mở rộng */}
                    {expandedServiceId === parent._id &&
                      childServices
                        .filter(
                          (child) => child.parent_service_id?._id === parent._id
                        )
                        .map((child) => (
                          <tr key={child._id} className="child-row">
                            <td>→</td>
                            <td>{child.name}</td>
                            <td>{getType(child.type)}</td>
                            <td>{child.estimated_time}</td>
                            <td>{child.price?.toLocaleString()} VND</td>
                            <td>
                              <Image
                                width={120}
                                height={100}
                                src={child.image_url || "N/A"}
                              />
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  child.is_active ? "active" : "inactive"
                                }`}
                              >
                                {child.is_active ? "Hoạt động" : "Bị khóa"}
                              </span>
                            </td>
                            <td>
                              <div className="action-service">
                                <CiEdit
                                  className="icon-service"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(child);
                                  }}
                                />
                                <MdDeleteOutline
                                  className="icon-service"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(child);
                                  }}
                                />
                                <FaRegEye
                                  className="icon-service"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDetailService(child._id);
                                  }}
                                />
                                <Popconfirm
                                  title="Khóa dịch vụ con"
                                  description="Bạn có muốn khóa dịch vụ con này không?"
                                  onConfirm={() => handleChangeStatus(child)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <MdBlock
                                    className="icon-service"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Popconfirm>
                              </div>
                            </td>
                          </tr>
                        ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Không có dữ liệu</td>
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
      <CreateServiceManager
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAdd={handleAddService}
      />

      {/* Update service */}
      <EditServiceManager
        isModalOpen={isEditModalOpen}
        handleCancel={() => setIsEditModalOpen(false)}
        handleEdit={handleEditService}
        editService={editService}
      />

      {/* Modal details service */}
      <DetailServiceManager
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

export default ServiceManager;
