import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import displayVNDCurrency from "../helpers/displayCurrency";
import { FaArrowLeft } from "react-icons/fa"; // <-- THÊM IMPORT ICON

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Lấy chi tiết đơn hàng ---
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SummaryApi.getOrderById.url}${orderId}`, {
        method: SummaryApi.getOrderById.method,
        credentials: "include",
      });
      const responseData = await response.json();
      if (responseData.success) {
        setOrder(responseData.data);
      } else {
        toast.error(responseData.message);
        navigate("/my-orders"); // Sửa lại: nên điều hướng về trang MyOrders
      }
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết đơn hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  // --- Hủy đơn hàng ---
  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        const response = await fetch(
          `${SummaryApi.cancelOrder.url}${orderId}/cancel`,
          {
            method: SummaryApi.cancelOrder.method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const responseData = await response.json();

        if (responseData.success) {
          toast.success(responseData.message);
          fetchOrderDetails(); // Cập nhật lại giao diện
        } else {
          toast.error(responseData.message || "Không thể hủy đơn hàng");
        }
      } catch (err) {
        toast.error("Lỗi khi hủy đơn hàng: " + err.message);
      }
    }
  };

  // --- [THÊM MỚI] Hàm quay lại ---
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó trong lịch sử trình duyệt
  };

  // --- Hiển thị khi đang tải ---
  if (loading) {
    return <p className="text-center p-10">Đang tải chi tiết đơn hàng...</p>;
  }

  // --- Không có đơn hàng ---
  if (!order) {
    return <p className="text-center p-10">Không tìm thấy đơn hàng.</p>;
  }

  // --- Giao diện chính ---
  return (
    <div className="container mx-auto max-w-4xl p-4 my-8">
      {/* === [THÊM MỚI] NÚT QUAY LẠI === */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-slate-600 hover:text-red-600 mb-4 font-medium"
      >
        <FaArrowLeft />
        Quay lại
      </button>
      {/* === KẾT THÚC NÚT === */}

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header đơn hàng */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">Chi Tiết Đơn Hàng</h1>
            <p className="text-slate-600">Mã đơn: #{order._id}</p>
          </div>
          <span
            className={`text-lg font-bold px-3 py-1 rounded-full mt-2 sm:mt-0 ${
              order.orderStatus === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : order.orderStatus === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Thông tin giao hàng & thanh toán */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Địa Chỉ Giao Hàng</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-bold">{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressDetail}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Thanh Toán</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p>
                Phương thức:
                <span className="font-bold ml-1">
                  {order.paymentMethod === "CASH"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Thanh toán qua VNPAY"}
                </span>
              </p>
              <p>
                Trạng thái:
                <span className="font-bold ml-1">
                  {order.paidAt
                    ? `Đã thanh toán lúc ${new Date(
                        order.paidAt
                      ).toLocaleString("vi-VN")}`
                    : "Chưa thanh toán"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <h3 className="text-xl font-semibold mb-2">Sản Phẩm</h3>
        <div className="space-y-3 border-t border-b py-4">
          {order.orderItems.map((item) => (
            <div key={item.product._id} className="flex items-center gap-4">
              <img
                src={item.product.productImage[0]}
                alt={item.product.productName}
                className="w-20 h-20 object-contain rounded border"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.product.productName}</p>
                <p className="text-sm text-slate-500">
                  Số lượng: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {displayVNDCurrency(item.unitPrice * item.quantity)}
                </p>
                <p className="text-sm text-slate-500">
                  ({displayVNDCurrency(item.unitPrice)} x {item.quantity})
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-lg">
              <span>Tổng tiền hàng:</span>
              <span>{displayVNDCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-red-600">
              <span>Tổng Cộng:</span>
              <span>{displayVNDCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Nút hủy đơn */}
        {order.orderStatus === "PENDING" && (
          <div className="text-center mt-8 border-t pt-6">
            <button
              onClick={handleCancelOrder}
              className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Hủy Đơn Hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
