// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSample from "../../../Hooks/useSample";
import usePayment from "../../../Hooks/usePayment";
import useAppointment from "../../../Hooks/useAppoinment";
import { notification, Spin } from "antd";

const PaymentPage = () => {
  const { appointmentId, sampleIds, isFirstPayment } = useLocation().state || {};
  const navigate = useNavigate();
  const { getSamplesByAppointment } = useSample();
  const { getAppointmentDetail } = useAppointment();
  const { makePayment, isLoading: paying, error } = usePayment();

  const [samples, setSamples] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("cash");
  const [isOutsideBusinessHours, setIsOutsideBusinessHours] = useState(false);

  const translateStatus = (status) => {
    switch (status) {
      case "sample_received":
        return "Mẫu đã nhận";
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "testing":
        return "Đang xét nghiệm";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Check if slot is outside business hours
  const checkBusinessHours = (slot) => {
    if (!slot?.time_slots?.[0]) return false;
    const timeSlot = slot.time_slots[0];
    const startHour = timeSlot.start_time?.hour;
    const endHour = timeSlot.end_time?.hour;
    
    // Create date object and get day of week (0=Sunday, 6=Saturday)
    const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
    const dayOfWeek = slotDate.getDay();
    
    // Check if the slot is on a weekend (Saturday or Sunday)
    if (dayOfWeek === 6 || dayOfWeek === 0) return true; // Saturday or Sunday
    
    // For weekdays, check business hours: 8:00 - 17:00 (8 AM - 5 PM)
    return startHour < 8 || startHour >= 17 || endHour < 8 || endHour > 17;
  };

  // Calculate payment amount
  const calculatePaymentAmount = () => {
    let basePrice = appointment?.service_id?.price || 0;
    
    // Add 20% surcharge for outside business hours
    if (isOutsideBusinessHours) {
      basePrice *= 1.2;
    }
    
    // If this is the first payment (deposit), calculate 30%
    if (isFirstPayment) {
      return Math.round(basePrice * 0.3);
    }
    
    // If this is the second payment, calculate remaining 70% (or 84% if outside business hours)
    return Math.round(basePrice * 0.7);
  };
  useEffect(() => {
    if (!appointmentId) return navigate(-1);
    setLoading(true);
    Promise.all([
      getAppointmentDetail(appointmentId),
      getSamplesByAppointment(appointmentId)
    ]).then(([appRes, sampleRes]) => {
      if (appRes.success) {
        const appointmentData = appRes.data.data;
        setAppointment(appointmentData);
        
        // Check if appointment is outside business hours
        if (appointmentData?.slot_id) {
          const isOutside = checkBusinessHours(appointmentData.slot_id);
          console.log('PaymentPage - Checking business hours:');
          console.log('Slot data:', appointmentData.slot_id);
          console.log('Is outside business hours:', isOutside);
          setIsOutsideBusinessHours(isOutside);
        }
      }
      if (sampleRes.success) setSamples(Array.isArray(sampleRes.data.data) ? sampleRes.data.data : []);
      setLoading(false);
    });
  }, [appointmentId]);

  const handlePayment = async () => {
    const paymentAmount = calculatePaymentAmount();
    const payload = { 
      appointment_id: appointmentId, 
      payment_method: method, 
      sample_ids: sampleIds,
      amount: paymentAmount,
      payment_type: isFirstPayment ? 'deposit' : 'final'
    };
    
    const res = await makePayment(payload);
    if (!res.success) {
      notification.error({ message: "Lỗi thanh toán: " + res.error });
      return;
    }
    
    const paymentData = res.data.data;
    const url = paymentData.checkout_url;
    const paymentNo = paymentData.payment_no;
    
    if (res.success) {
      if (method === "payos" && url) {
        if (paymentNo) {
          localStorage.setItem("payment_no", paymentNo);
        }
        window.location.href = url;
      } else {
        if (isFirstPayment) {
          notification.success({ 
            message: "Thanh toán đặt cọc thành công!", 
            description: "Bạn đã thanh toán 30% số tiền. Phần còn lại sẽ được thanh toán sau khi hoàn thành dịch vụ."
          });
        } else {
          notification.success({ 
            message: "Thanh toán hoàn tất thành công!", 
            description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
          });
        }
        navigate(-1);
      }
    } else {
      notification.error({ message: "Lỗi thanh toán: " + res.error });
      console.error("Payment error:", res.error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;

  // Helper
  const getSlotTime = (slot) => {
    if (!slot?.time_slots?.length) return "--";
    const t = slot.time_slots[0];
    return `${t.day}/${t.month}/${t.year} (${t.start_time.hour}:${t.start_time.minute} - ${t.end_time.hour}:${t.end_time.minute})`;
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-44 pb-12">
      <div className="w-full max-w-auto bg-white rounded-lg shadow-lg p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {isFirstPayment ? 'Thanh toán đặt cọc (30%)' : 'Thanh toán hoàn tất (70%)'}
        </h2>
        
        {/* Payment Type Alert */}
        {isFirstPayment && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Thanh toán đặt cọc</span>
            </div>
            <p className="text-blue-700 mt-1">
              Bạn đang thực hiện thanh toán đặt cọc 30% để xác nhận lịch hẹn. 
              Số tiền còn lại (70%) sẽ được thanh toán sau khi hoàn thành dịch vụ.
            </p>
          </div>
        )}

        {isOutsideBusinessHours && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Phụ phí ngoài giờ hành chính</span>
            </div>
            <p className="text-orange-700 mt-1">
              Lịch hẹn của bạn nằm ngoài giờ hành chính (8:00 - 17:00). 
              Phí dịch vụ đã được tăng thêm 20%.
            </p>
          </div>
        )}
        {/* Appointment Info */}
        <div className="mb-10 border-b pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Service Image */}
            <div className="flex flex-col items-center justify-center">
              {appointment?.service_id?.image_url && (
                <img src={appointment.service_id.image_url} alt="service" className="w-40 h-40 object-cover rounded-xl shadow mb-4" />
              )}
              <div className="font-bold text-lg text-center mt-2">{appointment?.service_id?.name}</div>
            </div>
            {/* Appointment Details */}
            <div className="space-y-2 text-lg">
              <div><span className="font-semibold">Mã lịch hẹn:</span> <span className="font-mono">{appointment?._id}</span></div>
              <div><span className="font-semibold">Địa chỉ lấy mẫu:</span> {appointment?.collection_address}</div>
              <div><span className="font-semibold">Ngày hẹn:</span> {appointment?.appointment_date ? new Date(appointment.appointment_date).toLocaleString() : "--"}</div>
              <div><span className="font-semibold">Khung giờ:</span> {getSlotTime(appointment?.slot_id)}</div>
              <div><span className="font-semibold">Nhân viên:</span> {appointment?.staff_id?.last_name} {appointment?.staff_id?.first_name}</div>
              <div><span className="font-semibold">Kỹ thuật viên:</span> {appointment?.laboratory_technician_id?.last_name} {appointment?.laboratory_technician_id?.first_name}</div>
              <div><span className="font-semibold">Trạng thái:</span> <span className="font-bold">{translateStatus(appointment?.status)}</span></div>
              <div><span className="font-semibold">Thanh toán:</span> <span className="font-bold">{appointment?.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></div>
            </div>
            {/* User Info */}
            <div className="flex flex-col items-center md:items-start gap-3">
              {appointment?.user_id?.avatar && (
                <img src={appointment.user_id.avatar} alt="avatar" className="w-20 h-20 object-cover rounded-full border mb-2" />
              )}
              <div className="font-semibold text-lg">{appointment?.user_id?.last_name} {appointment?.user_id?.first_name}</div>
              <div className="text-gray-600 text-base">Email: {appointment?.user_id?.email}</div>
              <div className="text-gray-600 text-base">SĐT: {appointment?.user_id?.phone_number}</div>
            </div>
          </div>
        </div>
        {/* Sample List */}
        <div className="mb-10">
          <div className="font-semibold mb-2 text-xl">Danh sách mẫu:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {samples.map(s => (
              <div key={s._id} className="p-4 bg-gray-50 rounded-lg shadow flex flex-col gap-2">
                <div className="flex items-center gap-4 mb-2">
                  {s.person_info?.image_url && (
                    <img src={s.person_info.image_url} alt="person" className="w-16 h-16 object-cover rounded-full border" />
                  )}
                  <div>
                    <div className="font-bold text-lg">{s.person_info?.name}</div>
                    <div className="text-gray-500 text-base">Loại mẫu: {s.type} | Quan hệ: {s.person_info?.relationship}</div>
                    <div className="text-gray-400 text-sm">Trạng thái: {s.status}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-base">
                  <div><span className="font-semibold">Kit code:</span> {s.kit_id?.code}</div>
                  <div><span className="font-semibold">Kit status:</span> {s.kit_id?.status}</div>
                  <div><span className="font-semibold">Ngày sinh:</span> {s.person_info?.dob ? new Date(s.person_info.dob).toLocaleDateString() : '--'}</div>
                  <div><span className="font-semibold">Nơi sinh:</span> {s.person_info?.birth_place}</div>
                  <div><span className="font-semibold">Quốc tịch:</span> {s.person_info?.nationality}</div>
                  <div><span className="font-semibold">CMND/CCCD:</span> {s.person_info?.identity_document}</div>
                  <div><span className="font-semibold">Ngày lấy mẫu:</span> {s.collection_date ? new Date(s.collection_date).toLocaleString() : '--'}</div>
                  <div><span className="font-semibold">Ngày nhận mẫu:</span> {s.received_date ? new Date(s.received_date).toLocaleString() : '--'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Payment */}
        <div className="mb-4">
          {/* Price Breakdown */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Chi tiết thanh toán</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Giá dịch vụ gốc:</span>
                <span>{appointment?.service_id?.price?.toLocaleString()} đ</span>
              </div>
              {isOutsideBusinessHours && (
                <div className="flex justify-between text-orange-600">
                  <span>Phụ phí ngoài giờ (+20%):</span>
                  <span>+{Math.round(appointment?.service_id?.price * 0.2)?.toLocaleString()} đ</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Tổng tiền dịch vụ:</span>
                  <span>{Math.round(appointment?.service_id?.price * (isOutsideBusinessHours ? 1.2 : 1))?.toLocaleString()} đ</span>
                </div>
              </div>
              {isFirstPayment && (
                <div className="flex justify-between text-blue-600 font-semibold">
                  <span>Số tiền cần thanh toán (30%):</span>
                  <span>{calculatePaymentAmount()?.toLocaleString()} đ</span>
                </div>
              )}
              {!isFirstPayment && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Số tiền còn lại (70%):</span>
                  <span>{calculatePaymentAmount()?.toLocaleString()} đ</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-xl">
              {isFirstPayment ? 'Thanh toán đặt cọc:' : 'Thanh toán hoàn tất:'}
            </span>
            <span className="text-3xl text-green-600 font-bold">
              {calculatePaymentAmount()?.toLocaleString()} đ
            </span>
          </div>
          <div className="mb-4 font-semibold text-xl">Chọn phương thức thanh toán:</div>
          <div className="flex gap-8 mt-2">
            <label className="flex items-center cursor-pointer text-xl">
              <input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} className="mr-2 w-5 h-5" />
              <span>💵 Tiền mặt</span>
            </label>
            <label className="flex items-center cursor-pointer text-xl">
              <input type="radio" checked={method === "payos"} onChange={() => setMethod("payos")} className="mr-2 w-5 h-5" />
              <span>🌐 PAYOS</span>
            </label>
          </div>
        </div>
        <button
          className="w-full py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying ? "Đang xử lý..." : (isFirstPayment ? "Thanh toán đặt cọc" : "Hoàn tất thanh toán")}
        </button>
        {error && <div className="mt-4 text-red-500 text-lg">{error}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;
