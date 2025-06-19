import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PayOSReturn = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const status = params.get("status");   // PAID / FAILED / …
    const cancel = params.get("cancel");   // false / true

    // Nếu trả về thành công
    if (status === "PAID" && cancel === "false") {
      // đếm ngược rồi redirect
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
    }

    // Nếu không phải success, redirect luôn
    navigate("/", { replace: true });
  }, [search, navigate]);

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
