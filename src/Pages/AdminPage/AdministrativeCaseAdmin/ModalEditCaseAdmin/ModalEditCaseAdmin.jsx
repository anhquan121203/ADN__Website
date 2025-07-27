import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useStaffProfile from "../../../../Hooks/useStaffProfile";
import useAppointment from "../../../../Hooks/useAppoinment";

const ModalEditCaseAdmin = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editCase,
}) => {
  const [form] = Form.useForm();
  const { staffProfile, getListStaff } = useStaffProfile();
  const { getAvailableStaffList, availableStaff } = useAppointment();

  useEffect(() => {
    getListStaff({
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    });
    getAvailableStaffList({
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    });
    if (editCase) {
      form.setFieldsValue({
        ...editCase,
        assigned_staff_id: editCase.assigned_staff_id?._id || "",
      });
    }
  }, [isModalOpen, editCase]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await handleEdit(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật hồ sơ thành công");
      } else {
        toast.error(response.message || "Cập nhật hồ sơ không thành công!");
      }

      console.log(response);
    } catch (error) {
      toast.error("Cập nhật hồ sơ không thành công!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa hồ sơ"
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
          label="Mức độ khẩn cấp"
          name="urgency"
          rules={[
            { required: true, message: "Vui lòng chọn mức độ khẩn cấp!" },
          ]}
        >
          <Select placeholder="Chọn loại">
            <Select.Option value="low">Thấp</Select.Option>
            <Select.Option value="normal">Bình thường</Select.Option>
            <Select.Option value="high">Cao</Select.Option>
            <Select.Option value="urgent">Khẩn cấp</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="internal_notes"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập ghi chú!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nhân viên phụ trách"
          name="assigned_staff_id"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
        >
          <Select
            placeholder="Chọn nhân viên phụ trách"
            optionFilterProp="children"
          >
            {availableStaff?.pageData
              ?.filter((staff) => staff.role === "staff")
              .map((staff) => (
                <Select.Option key={staff._id} value={staff._id}>
                  {`${staff.first_name || ""} ${staff.last_name || ""}`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[
            { required: true, message: "Vui lòng chọn mức độ khẩn cấp!" },
          ]}
        >
          <Select placeholder="Trạng thái hồ sơ">
            <Select.Option value="submitted">Đã gửi hồ sơ</Select.Option>
            <Select.Option value="under_review">Đang xem xét</Select.Option>
            <Select.Option value="approved">Đã duyệt</Select.Option>
            <Select.Option value="scheduled">Đã lên lịch</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditCaseAdmin;
