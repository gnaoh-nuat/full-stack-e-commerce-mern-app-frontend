// src/pages/PaymentVNPAY.js (hoặc nơi bạn đặt component)

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common"; // Đảm bảo đường dẫn này đúng

// [THÊM MỚI NẾU BẠN DÙNG REDUX ĐỂ ĐẾM GIỎ HÀNG]
// import { useDispatch } from 'react-redux';
// import { fetchAddToCartProductCount } from '../store/cartSlice';

const PaymentVNPAY = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // [THÊM MỚI NẾU BẠN DÙNG REDUX]
  // const dispatch = useDispatch();

  const [message, setMessage] = useState("Đang xác thực thanh toán VNPAY...");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Hàm này sẽ chạy ngay khi component được render
    const checkVNPAYReturn = async () => {
      // Lấy toàn bộ query string từ URL (ví dụ: "?vnp_Amount=...")
      const searchQuery = location.search;

      // Lấy orderId (vnp_TxnRef) từ query string để dùng cho việc điều hướng
      const params = new URLSearchParams(searchQuery);
      const orderId = params.get("vnp_TxnRef");

      if (!searchQuery) {
        setMessage("Không tìm thấy thông tin thanh toán.");
        setError(true);
        setTimeout(() => navigate("/cart"), 3000); // Về giỏ hàng sau 3s
        return;
      }

      try {
        // *** Bước 3: Frontend gọi API vnpayReturn ***
        // Gửi toàn bộ query string lên backend
        const response = await fetch(
          `${SummaryApi.vnpayReturn.url}${searchQuery}`,
          {
            method: SummaryApi.vnpayReturn.method,
            credentials: "include",
          }
        );

        const responseData = await response.json();

        if (responseData.success) {
          // Backend (hàm vnpayReturn) trả về success: true
          // (Tức là vnp_ResponseCode == '00' và đơn hàng đã được cập nhật)

          toast.success(responseData.message || "Thanh toán thành công!");

          // (Tùy chọn) Cập nhật lại số lượng giỏ hàng trên Header (nếu dùng Redux)
          // dispatch(fetchAddToCartProductCount());

          // Điều hướng đến trang thành công, mang theo orderId
          navigate("/order-success", {
            state: { orderId: orderId }, // Giống như khi thanh toán CASH
          });
        } else {
          // Backend (hàm vnpayReturn) trả về success: false
          // (Do vnp_ResponseCode != '00' hoặc lỗi nghiệp vụ khác)

          toast.error(responseData.message || "Thanh toán thất bại.");
          setError(true);
          setMessage(
            `Lỗi: ${responseData.message}. Đang chuyển về giỏ hàng...`
          );
          setTimeout(() => navigate("/cart"), 5000); // Về giỏ hàng sau 5s
        }
      } catch (err) {
        // Lỗi mạng hoặc lỗi fetch API
        toast.error("Lỗi kết nối: " + err.message);
        setError(true);
        setMessage("Lỗi kết nối. Đang chuyển hướng về giỏ hàng...");
        setTimeout(() => navigate("/cart"), 5000);
      }
    };

    checkVNPAYReturn();
  }, [location, navigate]); // Bổ sung 'dispatch' nếu bạn dùng Redux

  // Giao diện loading trong khi chờ gọi API
  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-120px)] flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{message}</h1>
        {!error ? (
          <p>Vui lòng không tắt trình duyệt...</p>
        ) : (
          /* Bạn có thể thêm một Spinner (icon xoay) ở đây */
          <p>Bạn sẽ được chuyển hướng về giỏ hàng.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentVNPAY;
