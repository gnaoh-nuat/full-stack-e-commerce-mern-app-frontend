import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import displayVNDCurrency from "../helpers/displayCurrency";
import { FaStar } from "react-icons/fa";

// TABS không đổi
const TABS = [
  { name: "Chờ xác nhận", status: "PENDING" },
  { name: "Đang xử lý", status: "PROCESSING" },
  { name: "Đang giao", status: "SHIPPED" },
  { name: "Đã giao", status: "DELIVERED" },
  { name: "Đã hủy", status: "CANCELLED" },
];

// Hàm getStatusProps
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

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    reviewImages: [],
  });
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // Handle open review modal
  const handleOpenReviewModal = (product) => {
    setReviewingProduct(product);
    setShowReviewModal(true);
    setReviewForm({ rating: 5, comment: "", reviewImages: [] });
  };

  // Handle close review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewingProduct(null);
    setReviewForm({ rating: 5, comment: "", reviewImages: [] });
  };

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(SummaryApi.addReview.url, {
        method: SummaryApi.addReview.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          product: reviewingProduct._id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          reviewImages: reviewForm.reviewImages,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Đánh giá của bạn đã được gửi thành công!");
        handleCloseReviewModal();
      } else {
        toast.error(result.message || "Không thể gửi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render interactive rating selector
  const renderRatingSelector = () => {
    return (
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
            className="text-3xl focus:outline-none transition-transform hover:scale-110"
          >
            <FaStar
              className={
                star <= reviewForm.rating ? "text-yellow-500" : "text-gray-300"
              }
            />
          </button>
        ))}
        <span className="text-sm text-slate-600 ml-2">
          ({reviewForm.rating} sao)
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Đơn Hàng Của Tôi
      </h2>

      {/* Thanh TABS */}
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
                {/* 1. Header */}
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

                  <Link
                    to={`/order/${order._id}`}
                    className="text-sm text-red-600 hover:underline font-medium mt-2 sm:mt-0 self-start sm:self-center"
                  >
                    Xem chi tiết đơn hàng
                  </Link>
                </div>

                {/* 2. Body: Products */}
                <div className="p-4 space-y-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.product?._id || item._id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50"
                    >
                      <Link
                        to={`/product/${item.product?._id}`}
                        className="flex items-start space-x-3 flex-1 hover:opacity-80 transition-opacity"
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
                          <p className="font-medium text-slate-800 text-sm">
                            {item.product?.productName ||
                              "Sản phẩm không có tên"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            SL: {item.quantity}
                          </p>
                          <div className="text-sm font-medium text-slate-800 mt-1">
                            {displayVNDCurrency(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      </Link>

                      {/* Nút Đánh giá - Chỉ hiện với đơn DELIVERED */}
                      {order.orderStatus === "DELIVERED" && (
                        <button
                          onClick={() => handleOpenReviewModal(item.product)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-all font-medium whitespace-nowrap"
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. Footer */}
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Đánh giá sản phẩm
                </h3>
                <button
                  onClick={handleCloseReviewModal}
                  className="text-slate-500 hover:text-slate-800 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
                {reviewingProduct?.productImage &&
                  reviewingProduct.productImage.length > 0 && (
                    <img
                      src={reviewingProduct.productImage[0]}
                      alt={reviewingProduct.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">
                    {reviewingProduct?.productName}
                  </p>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Chọn số sao *
                  </label>
                  {renderRatingSelector()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nhận xét của bạn
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseReviewModal}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
