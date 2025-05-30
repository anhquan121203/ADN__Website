import React from "react";
import { Modal, Descriptions } from "antd";

function ModalDetailDepartment({
  isModalOpen,
  handleCancel,
  selectedDepartment,
}) {
  const department = selectedDepartment?.data;
  return (
    <Modal
      title="Chi tiết phòng ban"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      {department ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên phòng ban">
            {department.name}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {department.description}
          </Descriptions.Item>
          <Descriptions.Item label="Quản lý phòng ban">
            {department.manager_id ? (
              <>
                {department.manager_id.first_name}{" "}
                {department.manager_id.last_name}
                <br />
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {department.manager_id.email}
                </span>
              </>
            ) : (
              "Chưa có quản lý"
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>Không có dữ liệu phòng ban.</div>
      )}
    </Modal>
  );
}

export default ModalDetailDepartment;
