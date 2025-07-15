import React, { use, useEffect, useState } from "react";
import "./CreateAppointmentAdmin.css";
import { Modal, Form, Input, Select, Button, Tag } from "antd";
import useSlot from "../../../../Hooks/useSlot";
import useService from "../../../../Hooks/useService";
import useAppointment from "../../../../Hooks/useAppoinment";
import useAuth from "../../../../Hooks/useAuth";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { toast } from "react-toastify";
import useCase from "../../../../Hooks/useCase";
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

  const { fetchAvailableSlots } = useSlot();
  const { createAppointment } = useAppointment();
  const { firstName, lastName, address, email, phoneNumber, dob } = useAuth();
  const fullName = firstName + lastName;
  const { cases, searchListCase } = useCase();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedSlot, setSelectedSlot] = useState();
  const [startDate, setStartDate] = useState(dayjs().format("YYYY/MM/DD"));
  const [endDate, setEndDate] = useState(
    dayjs().add(7, "day").format("YYYY/MM/DD")
  );
  const [availableSlots, setAvailableSlots] = useState([]);

  const renderType = (serviceType) => {
    switch (serviceType) {
      case "administrative":
        return "Hành chính";
      default:
        return "Không có dịch vụ";
    }
  };

  const renderAddress = (collectionAddress) => {
    switch (collectionAddress) {
      case "facility_collected":
        return "Cơ sở xét nghiệm";
      default:
        return "Không có địa chỉ";
    }
  };

  useEffect(() => {
    searchListCase({
      is_deleted: false,
    });
  }, [currentPage]);

  console.log(cases);

  // slot xet nghiem =============================================
  useEffect(() => {
    const getSlots = async () => {
      if (startDate && endDate) {
        const result = await fetchAvailableSlots({
          start_date: startDate,
          end_date: endDate,
        });
        if (result.success && result.data?.data?.pageData) {
          const slots = result.data.data.pageData;
          setAvailableSlots(slots);
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
        type: serviceType,
        collection_address: collectionAddress,
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
    <Form
      form={form}
      className="booking-form"
      onFinish={handleCreateAppointment}
    >
      {/* Section 1 */}
      <div className="section-title">Nội dung chi tiết đặt hẹn</div>
      <div className="form-row">
        <div className="form-group">
          <label>
            Bệnh viện/phòng khám <span className="required">*</span>
          </label>
          <select required defaultValue="">
            <option value="" disabled>
              Chọn cơ sở khám
            </option>
            <option value="">Cơ sở FPT University</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Dịch vụ <span className="required">*</span>
          </label>
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
            <option value="facility_collected">
              {renderAddress(collectionAddress)}
            </option>
          </select>
        </div>
      </div>

      {/* ============================================================================================================================================================= */}
      {/* ============================================================================================================================================================= */}
      {/* Mã  hồ sơ */}
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

      {/* ============================================================================================================================================================= */}
      {/* ============================================================================================================================================================= */}
      {/* Slot còn trống*/}
      <div className="form-row">
        <div className="form-group">
          <label>Chọn khoảng ngày</label>
          <RangePicker
            value={[
              dayjs(startDate, "YYYY/MM/DD"),
              dayjs(endDate, "YYYY/MM/DD"),
            ]}
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

      {/* Hiển thị slot còn trống */}
      <div className="form-group">
        <label>Chọn thời gian khám</label>
        <div className="time-picker">
          {availableSlots.flatMap((slot) =>
            slot.time_slots.map((time) => {
              const slotDateTime = dayjs(
                `${time.year}-${time.month}-${time.day} ${time.start_time.hour}:${time.start_time.minute}`,
                "YYYY-M-D H:m"
              );

              const isPast = slotDateTime.isBefore(dayjs());
              const dateLabel = slotDateTime.format("DD/MM");
              const dayOfWeek = slotDateTime.format("dddd");
              const slotId = time._id;

              return (
                <button
                  key={slotId}
                  type="button"
                  className={selectedSlot === slotId ? "selected" : ""}
                  onClick={() => !isPast && setSelectedSlot(slotId)}
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
                  {`${time.start_time.hour}:${time.start_time.minute
                    .toString()
                    .padStart(2, "0")} - ${
                    time.end_time.hour
                  }:${time.end_time.minute.toString().padStart(2, "0")}`}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================================================================================================================= */}
      {/* ============================================================================================================================================================= */}
      {/* Thông tin khách hàng */}
      <div className="section-title">Thông tin khách hàng</div>
      <div className="form-row">
        <div className="form-group">
          <label>
            Họ và tên <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Họ và tên"
            required
            value={fullName}
            disabled
          />
        </div>

        <div className="form-group">
          <label>
            Ngày tháng năm sinh <span className="required">*</span>
          </label>
          <input
            placeholder="Ngày tháng năm sinh"
            required
            value={dob}
            disabled
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            required
            value={phoneNumber}
            disabled
          />

          <div className="note">
            *Lưu ý: Hệ thống chỉ gửi SMS được cho Thuê bao nội địa, nếu quý
            khách sử dụng thuê bao quốc tế, vui lòng bổ sung email chính xác để
            nhận mã xác nhận và thông tin xác nhận đặt lịch.
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Nhập email" value={email} disabled />
        </div>
      </div>

      {/* <div className="form-row">
        <div className="form-group full-width">
          <label>
            Lý do khám <span className="required"></span>
          </label>
          <textarea placeholder="Triệu chứng của bạn" required></textarea>
        </div>
      </div> */}

      <div className="checkbox-group" style={{ marginTop: "15px" }}>
        <input type="checkbox" id="agree" required />
        <label htmlFor="agree" style={{ fontSize: "13px", lineHeight: 1.2 }}>
          Tôi đã đọc và đồng ý với{" "}
          <a href="#" className="link" target="_blank" rel="noreferrer">
            Chính sách bảo vệ dữ liệu cá nhân của Blood
          </a>{" "}
          và chấp thuận để Blood xử lý dữ liệu cá nhân của tôi theo quy định của
          pháp luật về bảo vệ dữ liệu cá nhân.{" "}
          <span className="required">*</span>
        </label>
      </div>

      <button className="submit-btn" type="primary" htmlType="submit">
        Gửi thông tin
      </button>
    </Form>
  );
};

export default CreateAppointmentAdmin;
