import React, { use, useEffect, useState } from "react";
import { Modal, Pagination, Popconfirm, Select, Switch, Tag } from "antd";

import { FaPlus, FaRegEye } from "react-icons/fa";

import { CiEdit } from "react-icons/ci";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import useKit from "../../../Hooks/useKit";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ModalEditKit from "./ModalEditKit/ModalEditKit";
import ModalDetailKit from "./ModalDetailKit/ModalDetailKit";

function KitAdmin() {
  const {
    kits,
    loading,
    error,
    searchListKit,
    addNewKit,
    updateKitById,
    kitById,
    deletekitById,
    changeStatusKit,
    total,
  } = useKit();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // giá trị ban đầu = null
  const [selectedKit, setSelectedKit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  useEffect(() => {
    searchListKit({
      pageNum: currentPage,
      pageSize: pageSize,
      status: "available",
    });
  }, [currentPage]);

  //   assigned
  // used
  // returned
  // damaged

  const renderStatus = (status) => {
    switch (status) {
      case "available":
        return <Tag color="green">Còn hàng</Tag>;
      case "assigned":
        return <Tag color="blue">Đã gắn</Tag>;
      case "used":
        return <Tag color="orange">Đã sử dụng</Tag>;
      case "returned":
        return <Tag color="yellow">Đã trả hàng</Tag>;
      case "damaged":
        return <Tag color="red">Đã hỏng</Tag>;
      default:
        return <Tag color="pink">Không còn</Tag>;
    }
  };

  // create new kit
  const handleCreateKit = async (createNewKit) => {
    try {
      const result = await addNewKit(createNewKit);
      if (result.success) {
        toast.success("Tạo dụng cụ thành công!");
        searchListKit({
          pageNum: currentPage,
          pageSize: pageSize,
          status: "available",
        });
      } else {
        toast.error("Tạo dụng cụ không thành công!");
      }
    } catch (error) {
      return {
        success: false,
        message: "Tạo dụng cụ không thành công!",
      };
    }
  };

  // update kit
  const openEditModal = (kitData) => {
    setSelectedKit(kitData);
    setIsEditModalOpen(true);
  };

  const handleEditKit = async (updateData) => {
    try {
      const result = await updateKitById(selectedKit._id, updateData);
      if (result.success) {
        setIsEditModalOpen(false);
        searchListKit({
          pageNum: currentPage,
          pageSize: pageSize,
          status: "available",
        });
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật dụng cụ không thành công!",
      };
    }
  };

  // get kit by ID
  const handleDetailKit = async (kitId) => {
    try {
      const result = await kitById(kitId);
      if (result.success) {
        setSelectedKit(result.data.data);
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

  // delete kit
  const openDeleteModal = (kitId) => {
    setSelectedKit(kitId);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteKit = async () => {
    if (selectedKit?._id) {
      const result = await deletekitById(selectedKit._id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        toast.success("Xóa dụng cụ thành công!");
        searchListKit({
          pageNum: currentPage,
          pageSize: pageSize,
          status: "available",
        });
      } else {
        toast.error("Lỗi: ID phòng ban không hợp lệ!");
      }
    }
  };

  // change status kit
  const handleChangeStatus = async (kit, newStatus) => {
    try {
      const result = await changeStatusKit({
        id: kit._id,
        status: newStatus,
      });
      if (result.success) {
        toast.success("Thay đổi trạng thái dụng cụ thành công!");
        searchListKit({
          pageNum: currentPage,
          pageSize: pageSize,
          status: "available",
        });
        return { success: true };
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái dụng cụ không thành công!");
    }
  };

  return (
    <div className="manager-account">
      <div className="header-manager-account">
        <div className="title--managerAccount">
          <h5>Danh sách dụng cụ Y tế</h5>
        </div>
        <div className="btn--managerAccount">
          <button
            className="button-add__account"
            onClick={() => handleCreateKit()}
            style={{ width: 180, height: 45 }}
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Tạo dụng cụ mới
          </button>
        </div>
      </div>

      {/* Table account */}
      <div className="form-account">
        <div className="account-container">
          <div className="filter-account"></div>

          <table className="table-account">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã dụng cụ</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {kits?.length > 0 ? (
                kits.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{item.code}</td>
                    <td>
                      <Select
                        value={item.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleChangeStatus(item, value)}
                      >
                        <Select.Option value="available">
                          Còn hàng
                        </Select.Option>
                        <Select.Option value="assigned">Đã gắn</Select.Option>
                        <Select.Option value="used">Đã sử dụng</Select.Option>
                        <Select.Option value="returned">
                          Đã trả hàng
                        </Select.Option>
                        <Select.Option value="damaged">Đã hỏng</Select.Option>
                      </Select>
                    </td>

                    <td>
                      {new Date(item.created_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      {new Date(item.updated_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>
                      <div className="action-admin">
                        <CiEdit
                          className="icon-admin"
                          onClick={() => openEditModal(item)}
                        />

                        <MdDeleteOutline
                          className="icon-admin"
                          onClick={() => openDeleteModal(item)}
                        />

                        <FaRegEye
                          className="icon-admin"
                          onClick={() => handleDetailKit(item._id)}
                        />

                        <Popconfirm
                          title="Khóa tài khoản"
                          description="Bạn có muốn khóa tài khoản này không?"
                          // onConfirm={() => handleChangeStatus(item)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <MdBlock className="icon-admin" />
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

        {/* modal Eidt kit */}
        <ModalEditKit
          isModalOpen={isEditModalOpen}
          handleCancel={() => setIsEditModalOpen(false)}
          handleEdit={handleEditKit}
          editKit={selectedKit}
        />

        {/* Modal details kit */}
        <ModalDetailKit
          isModalOpen={isDetailModalOpen}
          handleCancel={() => setIsDetailModalOpen(false)}
          selectedKit={selectedKit}
        />

        {/* Modal delete kit */}
        <Modal
          title="Xác nhận xóa dụng cụ"
          open={isDeleteModalOpen}
          onOk={handleDeleteKit}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>
            Bạn có chắc chắn muốn xóa dụng cụ{" "}
            <strong>{selectedKit?.code}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
}

export default KitAdmin;
