import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <FaCheckCircle className="text-green-500 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-center mb-4">
        Đặt hàng thành công!
      </h1>
      <p className="text-lg text-slate-600 text-center mb-8">
        Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
      </p>
      <div className="flex flex-wrap gap-4">
        {orderId && (
          <Link
            to={`/order/${orderId}`}
            className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Xem Chi Tiết Đơn Hàng
          </Link>
        )}
        <Link
          to="/my-orders"
          className="bg-white text-red-600 border border-red-600 font-semibold py-3 px-6 rounded-lg hover:bg-red-50 transition-colors"
        >
          Quản Lý Đơn Hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
