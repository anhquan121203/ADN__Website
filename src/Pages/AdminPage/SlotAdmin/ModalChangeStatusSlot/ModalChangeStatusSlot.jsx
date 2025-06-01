import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

const ModalChangeStatusSlot = ({
  isModalOpen,
  handleCancel,
  handleChange,
  changeStatusSlot,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (changeStatusSlot?.status) {
      setSelectedStatus(changeStatusSlot.status);
    }
  }, [changeStatusSlot]);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Vui lòng chọn trạng thái mới!");
      return;
    }

    const response = await handleChange({
      id: changeStatusSlot._id,   
      status: selectedStatus,
    });

    if (response?.success) {
      toast.success("Cập nhật trạng thái thành công");
      handleCancel();
    } else {
      toast.error(response?.message || "Cập nhật trạng thái không thành công!");
    }
  };

  return (
    <Modal
      title="Thay đổi trạng thái Slot"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>,
      ]}
    >
      <p>Chọn trạng thái mới:</p>
      <Select
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        style={{ width: "100%" }}
        placeholder="Chọn trạng thái"
      >
        <Option value="active">Active</Option>
        <Option value="on_leave">On Leave</Option>
        <Option value="terminated">Terminated</Option>
      </Select>
    </Modal>
  );
};

export default ModalChangeStatusSlot;
