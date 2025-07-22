import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePayment from "../../../Hooks/usePayment";
import { notification } from "antd";

const PayOSCancel = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { cancelPaymentStatus, isCanceling } = usePayment();
  const [countdown, setCountdown] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const status = params.get("status");   // CANCELLED
    const cancel = params.get("cancel");   // true

    // Nếu trả về là cancelled
    if (status === "CANCELLED" && cancel === "true") {
      // Lấy payment_no từ localStorage
      const paymentNo = localStorage.getItem("payment_no");
      
      if (paymentNo) {
        // Gọi API cancel payment
        cancelPaymentStatus(paymentNo).then(result => {
          if (result.success) {
            // Xóa payment_no khỏi localStorage sau khi cancel thành công
            localStorage.removeItem("payment_no");
            setIsCancelled(true);
            notification.info({ 
              message: "Thanh toán đã được hủy thành công!",
              description: "Bạn có thể thực hiện thanh toán lại bất cứ lúc nào."
            });
            
            // Đếm ngược rồi redirect
            const timerId = setInterval(() => {
              setCountdown((c) => {
                if (c <= 1) {
                  clearInterval(timerId);
                  navigate("/", { replace: true });
                }
                return c - 1;
              });
            }, 1000);

            return () => clearInterval(timerId);
          } else {
            notification.error({ 
              message: "Lỗi hủy thanh toán: " + result.error,
              description: "Vui lòng liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục."
            });
            navigate("/", { replace: true });
          }
        });
      } else {
        notification.warning({ 
          message: "Không tìm thấy thông tin thanh toán",
          description: "Có thể phiên thanh toán đã hết hạn."
        });
        navigate("/", { replace: true });
      }
    } else {
      // Nếu không phải cancelled status, xóa payment_no và redirect
      localStorage.removeItem("payment_no");
      notification.error({ 
        message: "Trạng thái thanh toán không hợp lệ",
        description: "Vui lòng thử lại hoặc liên hệ hỗ trợ."
      });
      navigate("/", { replace: true });
    }
  }, [search, navigate, cancelPaymentStatus]);

  if (isCanceling) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-4 text-orange-600">
            Đang xử lý hủy thanh toán...
          </h1>
          <p className="text-gray-600">Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-4 text-orange-600">
          Thanh toán đã được hủy
        </h1>
        
        <p className="text-gray-600 mb-6">
          Giao dịch thanh toán của bạn đã được hủy thành công. 
          Không có khoản phí nào được thu.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-800 text-sm">
            💡 <strong>Gợi ý:</strong> Bạn có thể quay lại và thực hiện thanh toán lại 
            hoặc chọn phương thức thanh toán khác.
          </p>
        </div>
        
        <p className="text-gray-500 mb-4">
          Bạn sẽ được chuyển về trang chủ sau <strong className="text-orange-600">{countdown}</strong> giây.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            onClick={() => navigate("/", { replace: true })}
          >
            Về trang chủ ngay
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/service", { replace: true })}
          >
            Xem dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayOSCancel;
