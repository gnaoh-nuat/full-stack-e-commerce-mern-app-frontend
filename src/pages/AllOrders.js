// src/pages/AllOrders.js

import React, { useEffect, useState } from "react";
import SummaryApi from "../common/index.js";
// Xóa Link vì không còn dùng trong file này
// import { Link } from "react-router-dom";

// --- Helper functions (không đổi) ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};
// ------------------------------------

// --- THÊM MỚI: Danh sách trạng thái để lọc ---
const ORDER_STATUSES = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];
// ------------------------------------------

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- THÊM MỚI: State cho bộ lọc ---
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);

    // --- CẬP NHẬT: Xây dựng URL động ---
    let url = SummaryApi.getAllOrders.url;
    if (selectedStatus !== "ALL") {
      // Thêm query param nếu không phải là "Tất cả"
      url = `${url}?status=${selectedStatus}`;
    }
    // ---------------------------------

    try {
      const response = await fetch(url, {
        // <-- Sử dụng URL động
        method: SummaryApi.getAllOrders.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // --- CẬP NHẬT: Chạy lại useEffect khi status thay đổi ---
  }, [selectedStatus]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Quản lý Đơn hàng
      </h2>

      {/* --- THÊM MỚI: UI Bộ lọc trạng thái --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
              selectedStatus === status.value
                ? "bg-red-600 text-white shadow-md"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
      {/* ------------------------------------ */}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-lg text-slate-500 py-10">
          Đang tải dữ liệu...
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center text-lg text-red-600 py-10">
          Lỗi: {error}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="overflow-x-auto relative shadow-sm sm:rounded-lg">
          <table className="w-full text-sm text-left text-slate-600">
            {/* ...thead (không đổi)... */}
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Ngày đặt
                </th>
                <th scope="col" className="py-3 px-6">
                  ID Đơn hàng
                </th>
                <th scope="col" className="py-3 px-6">
                  Khách hàng
                </th>
                <th scope="col" className="py-3 px-6">
                  Tổng tiền
                </th>
                <th scope="col" className="py-3 px-6">
                  Trạng thái
                </th>
                <th scope="col" className="py-3 px-6">
                  Thanh toán
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {order._id}
                    </td>
                    {/* CẬP NHẬT: An toàn hơn khi check user có tồn tại */}
                    <td className="py-4 px-6">{order.user?.name || "N/A"}</td>
                    <td className="py-4 px-6 font-medium text-red-600">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : order.orderStatus === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : order.orderStatus === "SHIPPED" // Thêm status SHIPPED
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800" // Mặc định cho PENDING
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">{order.paymentMethod}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
