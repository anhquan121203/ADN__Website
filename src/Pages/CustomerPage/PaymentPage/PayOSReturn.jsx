import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePayment from "../../../Hooks/usePayment";
import { notification } from "antd";

const PayOSReturn = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { verifyPaymentStatus, isVerifying } = usePayment();
  const [countdown, setCountdown] = useState(5);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const status = params.get("status");   // PAID / FAILED / …
    const cancel = params.get("cancel");   // false / true

    // Nếu trả về thành công
    if (status === "PAID" && cancel === "false") {
      // Lấy payment_no từ localStorage
      const paymentNo = localStorage.getItem("payment_no");
      
      if (paymentNo) {
        // Gọi API verify payment
        verifyPaymentStatus(paymentNo).then(result => {
          if (result.success) {
            // Xóa payment_no khỏi localStorage sau khi verify thành công
            localStorage.removeItem("payment_no");
            setIsVerified(true);
            notification.success({ message: "Xác minh thanh toán thành công!" });
            
            // Đếm ngược rồi redirect
            const timerId = setInterval(() => {
              setCountdown((c) => {
                if (c <= 1) {
                  clearInterval(timerId);
                  navigate("/", { replace: true });
                }
                return c - 1;
              });
            }, 5000);

            return () => clearInterval(timerId);
          } else {
            notification.error({ message: "Lỗi xác minh thanh toán: " + result.error });
            navigate("/", { replace: true });
          }
        });
      } else {
        notification.error({ message: "Không tìm thấy thông tin thanh toán" });
        navigate("/", { replace: true });
      }
    } else {
      // Nếu không phải success, xóa payment_no và redirect
      localStorage.removeItem("payment_no");
      notification.error({ message: "Thanh toán không thành công hoặc đã bị hủy" });
      navigate("/", { replace: true });
    }
  }, [search, navigate, verifyPaymentStatus]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-4">
            Đang xác minh thanh toán...
          </h1>
          <p>Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-green-600">
          Thanh toán thành công!
        </h1>
        <p className="mb-2">
          Bạn sẽ được chuyển về trang chủ sau <strong>{countdown}</strong> giây.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/", { replace: true })}
        >
          Về ngay
        </button>
      </div>
    </div>
  );
};

export default PayOSReturn;
