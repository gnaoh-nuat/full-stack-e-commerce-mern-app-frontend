import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const handleVnpayReturn = async () => {
      // Lấy tất cả query params từ URL
      const queryString = searchParams.toString();

      // *** GIẢ ĐỊNH: Thêm API vào SummaryApi ***
      // SummaryApi.vnpayReturn = { url: "/api/order/vnpay_return", method: "GET" }
      try {
        const response = await fetch(
          `${SummaryApi.vnpayReturn.url}?${queryString}`,
          {
            method: SummaryApi.vnpayReturn.method,
          }
        );

        const responseData = await response.json();

        if (responseData.success) {
          toast.success(responseData.message);
          setOrderId(responseData.data?._id || searchParams.get("vnp_TxnRef"));
        } else {
          toast.error(responseData.message);
          setError(responseData.message);
        }
      } catch (err) {
        toast.error("Lỗi xác thực thanh toán: " + err.message);
        setError("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    handleVnpayReturn();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <style>{`.loader { border-top-color: #ef4444; animation: spinner 1.5s linear infinite; } @keyframes spinner { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h2 className="text-2xl font-semibold text-slate-700">
          Đang xác thực thanh toán...
        </h2>
        <p className="text-slate-500">Vui lòng không rời khỏi trang này.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      {error ? (
        <>
          <FaTimesCircle className="text-red-500 text-8xl mb-6" />
          <h1 className="text-4xl font-bold text-center mb-4">
            Thanh toán thất bại!
          </h1>
          <p className="text-lg text-slate-600 text-center mb-8">{error}</p>
        </>
      ) : (
        <>
          <FaCheckCircle className="text-green-500 text-8xl mb-6" />
          <h1 className="text-4xl font-bold text-center mb-4">
            Thanh toán thành công!
          </h1>
          <p className="text-lg text-slate-600 text-center mb-8">
            Đơn hàng của bạn đã được thanh toán và đang được xử lý.
          </p>
        </>
      )}
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
          to="/profile/orders"
          className="bg-white text-red-600 border border-red-600 font-semibold py-3 px-6 rounded-lg hover:bg-red-50 transition-colors"
        >
          Quản Lý Đơn Hàng
        </Link>
      </div>
    </div>
  );
};

export default VnpayReturn;
