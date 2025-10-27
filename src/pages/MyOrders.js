import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import displayVNDCurrency from "../helpers/displayCurrency";

// TABS không đổi
const TABS = [
  { name: "Chờ xác nhận", status: "PENDING" },
  { name: "Đang xử lý", status: "PROCESSING" },
  { name: "Đang giao", status: "SHIPPED" },
  { name: "Đã giao", status: "DELIVERED" },
  { name: "Đã hủy", status: "CANCELLED" },
];

// Hàm getStatusProps (Không đổi)
const getStatusProps = (status) => {
  const tab = TABS.find((t) => t.status === status);
  const name = tab ? tab.name : status;
  let classes = "bg-yellow-100 text-yellow-700";

  if (status === "CANCELLED") {
    classes = "bg-red-100 text-red-700";
  } else if (status === "DELIVERED") {
    classes = "bg-green-100 text-green-700";
  }

  return { name, classes };
};

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].status);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect fetchOrders (Không đổi)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setOrders([]);

      try {
        const response = await fetch(
          `${SummaryApi.getOrdersByStatus.url}?status=${activeTab}`,
          {
            method: SummaryApi.getOrdersByStatus.method,
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (responseData.success) {
          setOrders(responseData.data);
        } else {
          toast.error(responseData.message);
        }
      } catch (err) {
        toast.error("Lỗi khi tải đơn hàng: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Đơn Hàng Của Tôi
      </h2>

      {/* Thanh TABS (Không đổi) */}
      <div className="flex border-b border-slate-300 overflow-x-auto mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`py-3 px-4 text-center font-semibold whitespace-nowrap ${
              activeTab === tab.status
                ? "border-b-2 border-red-600 text-red-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {loading && (
          <p className="text-center text-slate-500">Đang tải đơn hàng...</p>
        )}
        {!loading && orders.length === 0 && (
          <p className="text-center text-slate-500">
            Bạn không có đơn hàng nào trong mục này.
          </p>
        )}
        {!loading &&
          orders.map((order) => {
            const statusProps = getStatusProps(order.orderStatus);
            const totalItems = order.orderItems.reduce(
              (acc, item) => acc + item.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm"
              >
                {/* 1. Header: Chứa link ĐẾN CHI TIẾT ĐƠN HÀNG */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <span className="font-semibold text-base text-slate-800">
                      Mã đơn: #{order._id.slice(-10)}
                    </span>
                    <p className="text-sm text-slate-500">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {/* === LINK ĐẾN CHI TIẾT ĐƠN HÀNG (order/:id) === */}
                  <Link
                    to={`/order/${order._id}`} //
                    className="text-sm text-red-600 hover:underline font-medium mt-2 sm:mt-0 self-start sm:self-center"
                  >
                    Xem chi tiết đơn hàng
                  </Link>
                  {/* === KẾT THÚC LINK === */}
                </div>

                {/* 2. Body: Chứa link ĐẾN CHI TIẾT SẢN PHẨM */}
                <div className="p-4 space-y-3">
                  {order.orderItems.map((item) => (
                    /* === LINK ĐẾN CHI TIẾT SẢN PHẨM (product/:id) === */
                    <Link
                      to={`/product/${item.product?._id}`} //
                      key={item.product?._id || item._id}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded">
                        {item.product?.productImage &&
                        item.product.productImage.length > 0 ? (
                          <img
                            src={item.product.productImage[0]}
                            alt={item.product.productName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {item.product?.productName || "Sản phẩm không có tên"}
                        </p>
                        <p className="text-xs text-slate-500">
                          SL: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-slate-800">
                        {displayVNDCurrency(item.unitPrice * item.quantity)}
                      </div>
                    </Link>
                    /* === KẾT THÚC LINK === */
                  ))}
                </div>

                {/* 3. Footer: Thông tin chung (Không đổi) */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-slate-600 min-w-0">
                      <p className="font-medium">
                        Giao đến: {order.shippingAddress?.phone}
                      </p>
                      <p className="truncate">
                        {order.shippingAddress?.addressDetail}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium px-2.5 py-1 rounded-full inline-block text-center flex-shrink-0 ml-2 ${statusProps.classes}`}
                    >
                      {statusProps.name}
                    </span>
                  </div>

                  <div className="text-right border-t pt-2 mt-2">
                    <p className="text-sm text-slate-600">
                      {totalItems} sản phẩm
                    </p>
                    <span className="text-red-600 font-bold text-lg">
                      {displayVNDCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyOrders;
