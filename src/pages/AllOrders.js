// src/pages/AllOrders.js

import React, { useEffect, useState } from "react";
// Giả sử file SummaryApi của bạn nằm ở src/common/SummaryApi.js
import SummaryApi from "../common/index.js";
import { Link } from "react-router-dom";
// Xóa import FaEye vì không còn dùng nữa
// import { FaEye } from "react-icons/fa";

// Helper function
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

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.getAllOrders.url, {
        method: SummaryApi.getAllOrders.method,
        // Gửi cookie (chứa token) cùng với request
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
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Quản lý Đơn hàng
      </h2>

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
                {/* --- ĐÃ XÓA CỘT HÀNH ĐỘNG --- */}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  {/* --- CẬP NHẬT COLSPAN TỪ 7 THÀNH 6 --- */}
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
                    <td className="py-4 px-6">{order.user?.name}</td>
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
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">{order.paymentMethod}</td>
                    {/* --- ĐÃ XÓA CỘT HÀNH ĐỘNG --- */}
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
