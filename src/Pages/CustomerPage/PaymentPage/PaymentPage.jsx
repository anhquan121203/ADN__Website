// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSample from "../../../Hooks/useSample";
import usePayment from "../../../Hooks/usePayment";
import { notification } from "antd";

const PaymentPage = () => {
  const { appointmentId, sampleIds } = useLocation().state || {};
  const navigate = useNavigate();
  const { getSamplesByAppointment } = useSample();
  const { makePayment, isLoading: paying, error } = usePayment();

  const [samples, setSamples] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [method, setMethod] = useState("cash");

  useEffect(() => {
    if (!appointmentId) return navigate(-1);
    getSamplesByAppointment(appointmentId).then(res => {
      if (res.success) {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setSamples(data);
      }
      setLoadingSamples(false);
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
    const url = paymentData.checkout_url;      // lấy đúng field checkout_url

    if (res.success) {
      if (method === "pay_os" && url) {
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

  if (loadingSamples) return <div>Loading samples...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Thanh toán cho Appointment {appointmentId}</h2>
      <ul className="mb-4 space-y-1">
        {samples.map(s => (
          <li key={s._id}>
            <strong>{s.person_info?.name || s._id}</strong> – {s.status}
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <label className="mr-4">
          <input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} /> Tiền mặt
        </label>
        <label>
          <input type="radio" checked={method === "pay_os"} onChange={() => setMethod("pay_os")} /> PAY_OS
        </label>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handlePayment}
        disabled={paying}
      >
        {paying ? "Processing..." : "Payment"}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default PaymentPage;
