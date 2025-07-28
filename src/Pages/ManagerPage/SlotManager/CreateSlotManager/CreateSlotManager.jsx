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
import useStaffProfile from "../../../../Hooks/useStaffProfile";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const CreateSlotManager = ({
  isModalOpen,
  handleCancel,
  handleAdd,
  existingSlots = [],
}) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const { staffProfile, getListStaff } = useStaffProfile();

  useEffect(() => {
    getListStaff({ pageInfo: { pageNum: 1, pageSize: 100 } });
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
      values.appointment_limit = Number(values.appointment_limit);

      const date = values.date;
      const [startTime, endTime] = values.time_range;

      const newSlotStart = dayjs(date)
        .hour(startTime.hour())
        .minute(startTime.minute());

      const newSlotEnd = dayjs(date)
        .hour(endTime.hour())
        .minute(endTime.minute());

      // Kiểm tra trùng slot
      const isOverlap = existingSlots.some((slot) => {
        const ts = slot.time_slots?.[0];
        if (!ts) return false;

        const slotStart = dayjs()
          .year(ts.year)
          .month(ts.month - 1)
          .date(ts.day)
          .hour(ts.start_time.hour)
          .minute(ts.start_time.minute);

        const slotEnd = dayjs()
          .year(ts.year)
          .month(ts.month - 1)
          .date(ts.day)
          .hour(ts.end_time.hour)
          .minute(ts.end_time.minute);

        const isSameDay =
          slotStart.format("YYYY-MM-DD") === newSlotStart.format("YYYY-MM-DD");

        // check overlap
        const hasOverlap =
          newSlotStart.isBefore(slotEnd) && newSlotEnd.isAfter(slotStart);

        return isSameDay && hasOverlap;
      });

      if (isOverlap) {
        toast.error("Đã tồn tại slot trùng thời gian trong ngày này!");
        return;
      }

      // Nếu không trùng mới tiếp tục gọi API
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
      title="Tạo lịch làm việc mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo lịch làm việc
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
            {staffProfile?.map((staff) => (
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
          <DatePicker
            disabledDate={(current) => {
              return current && current < dayjs().startOf("day");
            }}
          />
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
            { required: true, message: "Vui lòng nhập giới hạn cuộc hẹn!" },
            {
              pattern: /^[0-9]+$/,
              message: "Giới hạn cuộc hẹn chỉ được chứa chữ số!",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ appointment_limit: onlyNums });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSlotManager;
