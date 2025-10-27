import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common"; // Đảm bảo đường dẫn này đúng
import displayVNDCurrency from "../helpers/displayCurrency";
import { toast } from "react-toastify";
// [THÊM MỚI NẾU BẠN DÙNG REDUX ĐỂ ĐẾM GIỎ HÀNG]
// import { useDispatch } from 'react-redux';
// import { fetchAddToCartProductCount } from '../store/cartSlice';

// (Component CheckoutLoading... không đổi)
const CheckoutLoading = () => (
  <div className="container mx-auto p-4 animate-pulse">
    {/* ... (skeleton loading) ... */}
  </div>
);

// (Component AddressModal... không đổi)
const AddressModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSetDefault,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    // ... (Code của Modal giữ nguyên như bạn đã cung cấp)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Chọn Địa Chỉ Giao Hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            addresses.map((address) => (
              <label
                key={address._id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  selectedAddressId === address._id
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="modalAddress"
                  value={address._id}
                  checked={selectedAddressId === address._id}
                  onChange={() => onSelectAddress(address._id)}
                  className="w-5 h-5 text-red-600 flex-shrink-0"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-lg flex items-center">
                    {address.name}
                    {address.isDefault && (
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full ml-2">
                        Mặc định
                      </span>
                    )}
                  </p>
                  <p className="text-slate-600">{address.phone}</p>
                  <p className="text-slate-600">{address.addressDetail}</p>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onSetDefault(address._id);
                    }}
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap px-2"
                  >
                    Đặt làm mặc định
                  </button>
                )}
              </label>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // [THÊM MỚI NẾU BẠN DÙNG REDUX]
  // const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.items && location.state?.totalAmount) {
      setItems(location.state.items);
      setTotalAmount(location.state.totalAmount);
    } else {
      toast.error("Không tìm thấy sản phẩm, vui lòng thử lại.");
      navigate("/cart");
    }
  }, [location.state, navigate]);

  const fetchAddresses = useCallback(async () => {
    // ... (Hàm fetchAddresses giữ nguyên)
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.getUserAddresses.url, {
        method: SummaryApi.getUserAddresses.method,
        credentials: "include",
      });
      const responseData = await response.json();
      if (responseData.success) {
        const fetchedAddresses = responseData.data || [];
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0) {
          setSelectedAddressId(fetchedAddresses[0]._id);
        }
      } else {
        toast.error(responseData.message);
      }
    } catch (err) {
      toast.error("Lỗi khi tải địa chỉ: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSetDefaultAddress = async (addressId) => {
    // ... (Hàm handleSetDefaultAddress giữ nguyên)
    const currentDefault = addresses.find((addr) => addr.isDefault);
    setLoading(true);
    try {
      const apiCalls = [];
      apiCalls.push(
        fetch(`${SummaryApi.updateAddress.url}${addressId}`, {
          method: SummaryApi.updateAddress.method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isDefault: true }),
        }).then((res) => res.json())
      );
      if (currentDefault && currentDefault._id !== addressId) {
        apiCalls.push(
          fetch(`${SummaryApi.updateAddress.url}${currentDefault._id}`, {
            method: SummaryApi.updateAddress.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isDefault: false }),
          }).then((res) => res.json())
        );
      }
      const results = await Promise.all(apiCalls);
      if (results.some((res) => !res.success)) {
        throw new Error(
          results.find((res) => !res.success)?.message || "Cập nhật thất bại"
        );
      }
      toast.success("Đã cập nhật địa chỉ mặc định!");
      await fetchAddresses();
    } catch (err) {
      toast.error("Lỗi khi cập nhật: " + err.message);
      setLoading(false);
    }
  };

  // =================================================================
  // === *** HÀM ĐÃ ĐƯỢC CẬP NHẬT *** ===
  // =================================================================
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    setOrderLoading(true);

    // Chuẩn bị payload cho đơn hàng (không đổi)
    const transformedProducts = items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    const payload = {
      shippingAddressId: selectedAddressId,
      paymentMethod: paymentMethod,
      products: transformedProducts,
    };

    try {
      // 1. Tạo đơn hàng (không đổi)
      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      // 2. Xử lý kết quả
      if (responseData.success) {
        // ======================================================
        // *** BẮT ĐẦU CODE MỚI: Xóa sản phẩm khỏi giỏ hàng ***
        // ======================================================

        // Tạo một mảng các promise để xóa từng sản phẩm
        // 'items' là mảng sản phẩm từ location.state
        // 'item._id' chính là 'addToCartProductId' mà backend cần
        const deletePromises = items.map((item) => {
          return fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ _id: item._id }), // Gửi ID của cart item
          });
        });

        // Chờ tất cả các API xóa hoàn thành
        await Promise.all(deletePromises);

        // (Tùy chọn) Cập nhật lại số lượng giỏ hàng trên Header (nếu dùng Redux)
        // dispatch(fetchAddToCartProductCount());

        // ======================================================
        // *** KẾT THÚC CODE MỚI ***
        // ======================================================

        // 3. Điều hướng (không đổi)
        if (paymentMethod === "CASH") {
          navigate("/order-success", {
            state: { orderId: responseData.data._id },
          });
        } else if (paymentMethod === "VNPAY") {
          if (responseData.paymentUrl) {
            window.location.href = responseData.paymentUrl;
          } else {
            toast.error("Không nhận được URL thanh toán VNPAY.");
          }
        }
      } else {
        toast.error("Đặt hàng thất bại: " + responseData.message);
      }
    } catch (err) {
      toast.error("Lỗi khi đặt hàng: " + err.message);
    } finally {
      setOrderLoading(false);
    }
  };
  // =================================================================
  // === HẾT PHẦN CẬP NHẬT
  // =================================================================

  if (loading && addresses.length === 0) {
    return <CheckoutLoading />;
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  return (
    <>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={(addressId) => setSelectedAddressId(addressId)}
        onSetDefault={handleSetDefaultAddress}
        loading={loading}
      />

      <div className="container mx-auto p-4 min-h-[calc(100vh-120px)]">
        <h1 className="text-3xl font-bold text-center mb-8">
          Xác Nhận Đơn Hàng
        </h1>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ==========================
            CỘT BÊN TRÁI (CHỌN ĐỊA CHỈ & THANH TOÁN)
          ========================== */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* --- Phần Chọn Địa Chỉ --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">1. Địa Chỉ Giao Hàng</h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Thay đổi
                </button>
              </div>

              {selectedAddress ? (
                <div className="flex items-center p-4 border rounded-lg border-slate-300">
                  <div className="ml-4">
                    <p className="font-semibold text-lg flex items-center">
                      {selectedAddress.name}
                      {selectedAddress.isDefault && (
                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full ml-2">
                          Mặc định
                        </span>
                      )}
                    </p>
                    <p className="text-slate-600">{selectedAddress.phone}</p>
                    <p className="text-slate-600">
                      {selectedAddress.addressDetail}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-lg border-slate-300">
                  <p className="text-slate-500">
                    Bạn chưa có địa chỉ nào. Vui lòng
                    <button
                      onClick={() => navigate("/profile/address")}
                      className="text-red-600 font-medium ml-1 hover:underline"
                    >
                      thêm địa chỉ
                    </button>
                    .
                  </p>
                </div>
              )}
            </div>

            {/* --- Phần Chọn Phương Thức Thanh Toán --- */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                2. Chọn Phương Thức Thanh Toán
              </h2>
              <div className="space-y-4">
                {/* (label cho CASH) */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "CASH"
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === "CASH"}
                    onChange={() => setPaymentMethod("CASH")}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-lg">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-slate-600">
                      Trả tiền mặt khi nhân viên giao hàng đến.
                    </p>
                  </div>
                </label>

                {/* (label cho VNPAY) */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "VNPAY"
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => setPaymentMethod("VNPAY")}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-lg">
                      Thanh toán qua VNPAY
                    </p>
                    <p className="text-slate-600">
                      Thanh toán an toàn qua cổng VNPAY (hỗ trợ thẻ nội địa, QR
                      Code...).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ==========================
            CỘT BÊN PHẢI (TÓM TẮT ĐƠN HÀNG)
          ========================== */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-lg border border-slate-300 shadow-md">
              <h2 className="text-xl font-semibold p-4 border-b">
                Tóm Tắt Đơn Hàng
              </h2>
              <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productId?.productImage[0]}
                        alt={item.productId?.productName}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div>
                        <p className="font-medium text-ellipsis line-clamp-1">
                          {item.productId?.productName}
                        </p>
                        <p className="text-sm text-slate-500">
                          SL: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-slate-700">
                      {displayVNDCurrency(
                        item.productId?.sellingPrice * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t space-y-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng tiền hàng</span>
                  <span>{displayVNDCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl text-red-600">
                  <span>Tổng Thanh Toán</span>
                  <span>{displayVNDCurrency(totalAmount)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading || addresses.length === 0}
                  className={`w-full bg-red-600 text-white font-semibold text-lg p-3 rounded-lg ${
                    orderLoading || addresses.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-700"
                  }`}
                >
                  {orderLoading ? "Đang xử lý..." : "Đặt Hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
