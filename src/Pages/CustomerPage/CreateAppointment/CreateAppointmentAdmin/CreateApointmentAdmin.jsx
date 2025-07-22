import React, { useEffect, useState } from "react";
import "./CreateAppointmentAdmin.css";
import { Modal, Form, Input, Select, Button, DatePicker } from "antd";
import useSlot from "../../../../Hooks/useSlot";
import useAppointment from "../../../../Hooks/useAppoinment";
import useAuth from "../../../../Hooks/useAuth";
import useCase from "../../../../Hooks/useCase";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const CreateAppointmentAdmin = ({
  serviceId,
  serviceName,
  serviceType,
  collectionAddress,
  onCancel,
  visible,
}) => {
  const [form] = Form.useForm();

  const { slots, fetchAvailableSlots } = useSlot();
  const { createAppointment } = useAppointment();
  const { firstName, lastName, address, email, phoneNumber, dob } = useAuth();
  const fullName = firstName + lastName;
  const { cases, searchListCase } = useCase();
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSlot, setSelectedSlot] = useState();
  const [startDate, setStartDate] = useState(dayjs().format("YYYY/MM/DD"));
  const [endDate, setEndDate] = useState(dayjs().add(7, "day").format("YYYY/MM/DD"));
  const [availableSlots, setAvailableSlots] = useState([]);

  const renderType = (type) => {
    switch (type) {
      case "administrative":
        return "Hành chính";
      default:
        return "Không có dịch vụ";
    }
  };

  const renderAddress = (address) => {
    switch (address) {
      case "facility_collected":
        return "Cơ sở xét nghiệm";
      default:
        return "Không có địa chỉ";
    }
  };

  useEffect(() => {
    searchListCase({ is_deleted: false });
  }, [currentPage]);

  useEffect(() => {
    const getSlots = async () => {
      if (startDate && endDate) {
        const result = await fetchAvailableSlots({ start_date: startDate, end_date: endDate });
        if (result.success && result.data?.data?.pageData) {
          setAvailableSlots(result.data.data.pageData);
        }
      }
    };
    getSlots();
  }, [startDate, endDate]);

  const handleCreateAppointment = async (values) => {
    if (!selectedSlot) {
      toast.error("Vui lòng chọn thời gian khám!");
      return;
    }

    try {
      const result = await createAppointment({
        service_id: serviceId,
        slot_id: selectedSlot,
        case_number: values.case_number,
        authorization_code: values.authorization_code,
      });

      if (result.success === true) {
        form.resetFields();
        setSelectedSlot(null);
        onCancel();
        toast.success("Tạo lịch xét nghiệm thành công!");
      } else {
        toast.error("Tạo lịch không thành công, vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      
      open={visible}
      onCancel={() => {
        form.resetFields();
        setSelectedSlot(null);
        onCancel();
      }}
      footer={null}
      width={900}
      className="custom-appointment-modal"
    >
      <div className="modal-header-line">Đặt lịch</div>
      <Form form={form} className="booking-form" onFinish={handleCreateAppointment}>
        <div className="section-title">Nội dung chi tiết đặt hẹn</div>
        <div className="form-row">
          <div className="form-group">
            <label>Bệnh viện/phòng khám <span className="required">*</span></label>
            <select required defaultValue="">
              <option value="" disabled>Chọn cơ sở khám</option>
              <option value="">Cơ sở FPT University</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dịch vụ <span className="required">*</span></label>
            <select required defaultValue="facility">
              <option value="facility">{renderType(serviceType)}</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tên dịch vụ</label>
            <select defaultValue="serviceName">
              <option value="serviceName">{serviceName}</option>
            </select>
          </div>

          <div className="form-group">
            <label>Địa chỉ lấy mẫu</label>
            <select defaultValue="facility_collected">
              <option value="facility_collected">{renderAddress(collectionAddress)}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <Form.Item
            label="Mã hồ sơ"
            name="case_number"
            rules={[{ required: true, message: "Vui lòng nhập mã hồ sơ!" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input placeholder="Nhập đúng ký tự" />
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="Mã xác thực cơ quan"
            name="authorization_code"
            rules={[{ required: true, message: "Vui lòng nhập mã hồ sơ!" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Chọn khoảng ngày</label>
            <RangePicker
              value={[dayjs(startDate, "YYYY/MM/DD"), dayjs(endDate, "YYYY/MM/DD")]}
              format="YYYY-MM-DD"
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  setStartDate(dayjs(dates[0]).format("YYYY/MM/DD"));
                  setEndDate(dayjs(dates[1]).format("YYYY/MM/DD"));
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Chọn thời gian khám</label>
          <div className="time-picker">
            {availableSlots.flatMap((slot) =>
              slot.time_slots
                .filter((time) => time._id)
                .map((time) => {
                  const slotDateTime = dayjs(
                    `${time.year}-${time.month}-${time.day} ${time.start_time.hour}:${time.start_time.minute}`,
                    "YYYY-M-D H:m"
                  );

                  const isPast = slotDateTime.isBefore(dayjs());
                  const dateLabel = slotDateTime.format("DD/MM");
                  const dayOfWeek = slotDateTime.format("dddd");
                  const timeLabel = `${time.start_time.hour}:${time.start_time.minute
                    .toString()
                    .padStart(2, "0")} - ${time.end_time.hour}:${time.end_time.minute
                      .toString()
                      .padStart(2, "0")}`;

                  return (
                    <button
                      key={time._id}
                      type="button"
                      className={selectedSlot === slot._id ? "selected" : ""}
                      onClick={() => !isPast && setSelectedSlot(slot._id)}
                      disabled={isPast}
                      style={{
                        cursor: isPast ? "not-allowed" : "pointer",
                        opacity: isPast ? 0.5 : 1,
                      }}
                    >
                      {dateLabel}
                      <br />
                      {dayOfWeek}
                      <br />
                      {timeLabel}
                    </button>
                  );
                })
            )}
          </div>
        </div>

        <div className="section-title">Thông tin khách hàng</div>
        <div className="form-row">
          <div className="form-group">
            <label>Họ và tên <span className="required">*</span></label>
            <input type="text" required value={fullName} disabled />
          </div>
          <div className="form-group">
            <label>Ngày tháng năm sinh <span className="required">*</span></label>
            <input value={dob} required disabled />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số điện thoại <span className="required">*</span></label>
            <input type="text" required value={phoneNumber} disabled />
            <div className="note">
              *Lưu ý: Hệ thống chỉ gửi SMS cho thuê bao nội địa. Với thuê bao quốc tế, vui lòng bổ sung email.
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>
        </div>

        <div className="checkbox-group" style={{ marginTop: "15px" }}>
          <input type="checkbox" id="agree" required />
          <label htmlFor="agree" style={{ fontSize: "13px", lineHeight: 1.2 }}>
            Tôi đã đọc và đồng ý với{" "}
            <a href="#" className="link" target="_blank" rel="noreferrer">
              Chính sách bảo vệ dữ liệu cá nhân của Blood
            </a>{" "}
            <span className="required">*</span>
          </label>
        </div>

        <button className="submit-btn" type="primary" htmlType="submit">
          Gửi thông tin
        </button>
      </Form>
    </Modal>
  );
};

export default CreateAppointmentAdmin;
