import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const ModalEditStatusAdmin = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editAppointAdmin,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editAppointAdmin) {
      form.setFieldsValue({
        ...editAppointAdmin,
      });
    }
  }, [isModalOpen, editAppointAdmin]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleEdit(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật trạng thái thành công");
      } else {
        toast.error(response.message || "Cập nhật không thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật không thành công!");
    }
  };

  return (
    <Modal
      title="Cập nhật trạng thái"
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
      <Form form={form} layout="vertical">
        <Form.Item
          label="Loại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          
          <Select placeholder="Chọn loại">
            <Select.Option value="pending">Đang chờ</Select.Option>
            <Select.Option value="confirmed">Đã xác nhận</Select.Option>
            <Select.Option value="sample_asigned">
              Đã chỉ định mẫu
            </Select.Option>
            <Select.Option value="sample_collected">
              Đã thu thập mẫu
            </Select.Option>
            <Select.Option value="sample_received">Đã nhận mẫu</Select.Option>
            <Select.Option value="testing">Đang xét nghiệm</Select.Option>
            <Select.Option value="completed">Đã hoàn tất</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
            <Select.Option value="administrative">
              Đang chờ ủy quyền
            </Select.Option>
            <Select.Option value="awaiting_authorization">
              Đã ủy quyền
            </Select.Option>
            <Select.Option value="ready_for_collecttion">
              Đã sẵn sàng để thu thập
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditStatusAdmin;
