// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSample from "../../../Hooks/useSample";
import usePayment from "../../../Hooks/usePayment";
import useAppointment from "../../../Hooks/useAppoinment";
import { notification, Spin } from "antd";

const PaymentPage = () => {
  const { appointmentId, sampleIds } = useLocation().state || {};
  const navigate = useNavigate();
  const { getSamplesByAppointment } = useSample();
  const { getAppointmentDetail } = useAppointment();
  const { makePayment, isLoading: paying, error } = usePayment();

  const [samples, setSamples] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("cash");

  const translateStatus = (status) => {
    switch (status) {
      case "sample_received":
        return "Mẫu đã nhận";
    }
  };
  useEffect(() => {
    if (!appointmentId) return navigate(-1);
    setLoading(true);
    Promise.all([
      getAppointmentDetail(appointmentId),
      getSamplesByAppointment(appointmentId)
    ]).then(([appRes, sampleRes]) => {
      if (appRes.success) setAppointment(appRes.data.data);
      if (sampleRes.success) setSamples(Array.isArray(sampleRes.data.data) ? sampleRes.data.data : []);
      setLoading(false);
    });
  }, [appointmentId]);

  const handlePayment = async () => {
    const payload = { appointment_id: appointmentId, payment_method: method, sample_ids: sampleIds };
    const res = await makePayment(payload);
    if (!res.success) {
      notification.error({ message: "Lỗi thanh toán: " + res.error });
      return;
    }
    const paymentData = res.data.data;
    const url = paymentData.checkout_url;
    const paymentNo = paymentData.payment_no;
    if (res.success) {
      if (method === "pay_os" && url) {
        if (paymentNo) {
          localStorage.setItem("payment_no", paymentNo);
        }
        window.location.href = url;
      } else {
        notification.success({ message: "Thanh toán tiền mặt thành công!" });
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
        <h2 className="text-3xl font-bold mb-8 text-center">Thanh toán lịch hẹn</h2>
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
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-xl">Tổng tiền:</span>
            <span className="text-3xl text-green-600 font-bold">{appointment?.service_id?.price?.toLocaleString()} đ</span>
          </div>
          <div className="mb-4 font-semibold text-xl">Chọn phương thức thanh toán:</div>
          <div className="flex gap-8 mt-2">
            <label className="flex items-center cursor-pointer text-xl">
              <input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} className="mr-2 w-5 h-5" />
              <span>💵 Tiền mặt</span>
            </label>
            <label className="flex items-center cursor-pointer text-xl">
              <input type="radio" checked={method === "pay_os"} onChange={() => setMethod("pay_os")} className="mr-2 w-5 h-5" />
              <span>🌐 PAY_OS</span>
            </label>
          </div>
        </div>
        <button
          className="w-full py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>
        {error && <div className="mt-4 text-red-500 text-lg">{error}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;
