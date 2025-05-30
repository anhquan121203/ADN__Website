import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAdmin from "../../../../Hooks/useAdmin";
import useDepartment from "../../../../Hooks/useDepartment";
import useService from "../../../../Hooks/useService";

const { RangePicker } = DatePicker;

const ModalCreateSlot = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const { accounts, getListStaff } = useAdmin();
  const { services, searchListService } = useService();

  useEffect(() => {
    getListStaff({ pageInfo: { pageNum: 1, pageSize: 100 } });
    searchListService({
      is_active: true,
      pageNum: 1,
      pageSize: 100,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const date = values.date;
      const [startTime, endTime] = values.time_range;

      const timeSlot = {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        start_time: {
          hour: startTime.hour(),
          minute: startTime.minute(),
        },
        end_time: {
          hour: endTime.hour(),
          minute: endTime.minute(),
        },
      };

      const submitData = {
        ...values,
        time_slots: [timeSlot],
      };

      // Xóa field không cần thiết
      delete submitData.date;
      delete submitData.time_range;

      const response = await handleAdd(submitData);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo Slot mới thành công");
      } else {
        toast.error(response.message || "Tạo slot mới không thành công!");
      }
    } catch (error) {
      toast.error("Tạo slot mới không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo tài khoản mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo tài khoản
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nhân viên"
          name="staff_profile_ids"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
        >
          <Select placeholder="Chọn nhân viên" mode="multiple">
            {accounts?.map((staff) => (
              <Select.Option key={staff._id} value={staff._id}>
                {`${staff.user_id?.first_name} ${staff.user_id?.last_name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="service_id"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
        >
          <Select placeholder="Chọn phòng ban">
            {services?.map((service) => (
              <Select.Option key={service._id} value={service._id}>
                {service.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn ngày */}
        <Form.Item
          label="Ngày"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker />
        </Form.Item>

        {/* Chọn khoảng thời gian trong ngày */}
        <Form.Item
          label="Khoảng thời gian"
          name="time_range"
          rules={[
            { required: true, message: "Vui lòng chọn khoảng thời gian!" },
          ]}
        >
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Giới hạn cuộc hẹn"
          name="appointment_limit"
          rules={[
            { required: true, message: "Vui lòng nhập Giới hạn cuộc hẹn!" },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateSlot;
