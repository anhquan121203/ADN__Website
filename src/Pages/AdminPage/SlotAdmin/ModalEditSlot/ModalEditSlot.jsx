import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
} from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useAdmin from "../../../../Hooks/useAdmin";

const ModalEditSlot = ({ isModalOpen, handleCancel, handleEdit, editSlot }) => {
  const [form] = Form.useForm();

  const { accounts, getListStaff } = useAdmin();

  useEffect(() => {
    if (isModalOpen) {
      getListStaff({ pageInfo: { pageNum: 1, pageSize: 100 } });
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (editSlot && editSlot.time_slots?.[0]) {
      const ts = editSlot.time_slots[0];

      const date = dayjs(new Date(ts.year, ts.month - 1, ts.day));
      const startTime = dayjs(
        new Date(
          ts.year,
          ts.month - 1,
          ts.day,
          ts.start_time.hour,
          ts.start_time.minute
        )
      );
      const endTime = dayjs(
        new Date(
          ts.year,
          ts.month - 1,
          ts.day,
          ts.end_time.hour,
          ts.end_time.minute
        )
      );

      form.setFieldsValue({
        ...editSlot,
        staff_profile_ids: editSlot.staff_profile_ids.map((s) => s._id),
        date,
        time_range: [startTime, endTime],
        status: editSlot.status
      });
    }
  }, [isModalOpen, editSlot]);

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

      const response = await handleEdit(submitData);
      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật slot thành công");
      } else {
        toast.error(response.message || "Cập nhật slot không thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật slot không thành công!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa slot"
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

        <Form.Item label="Giới hạn cuộc hẹn" name="status">
          <Select style={{ width: "100%" }} placeholder="Chọn trạng thái">
            <Option value="available">Còn trống</Option>
            <Option value="booked">Đã đặt</Option>
            <Option value="unavailable ">Hết chỗ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditSlot;
