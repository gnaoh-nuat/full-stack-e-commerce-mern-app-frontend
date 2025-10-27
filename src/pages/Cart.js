import React, { useContext, useEffect, useState } from "react";
// *** THÊM MỚI: Import 'Link' để điều hướng ***
import { useNavigate, Link } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
import displayVNDCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();
    if (responseData.success) {
      setData(responseData.data);
    }
  };

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      try {
        await fetchData();
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCartData();
  }, []);

  const increaseQty = async (id, qty) => {
    // ... (logic không đổi)
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
    }
  };

  const decraseQty = async (id, qty) => {
    // ... (logic không đổi)
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    // ... (logic không đổi)
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item._id));
    }
  };

  const selectedProducts = data.filter((product) =>
    selectedItems.includes(product._id)
  );

  const selectedTotalQty = selectedProducts.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );

  const selectedTotalPrice = selectedProducts.reduce(
    (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  const handleCheckout = () => {
    const itemsToCheckout = data.filter((product) =>
      selectedItems.includes(product._id)
    );
    navigate("/checkout", {
      state: {
        items: itemsToCheckout,
        totalAmount: selectedTotalPrice,
      },
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-120px)]">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">Giỏ hàng của bạn đang trống</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between">
        {/*** Danh sách sản phẩm ***/}
        <div className="w-full lg:max-w-3xl">
          {data.length > 0 && (
            <div className="flex items-center justify-between bg-white p-2 rounded border mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 && selectedItems.length === data.length
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5"
                />
                <label>Chọn tất cả ({data.length} sản phẩm)</label>
              </div>
            </div>
          )}

          {loading
            ? loadingCart?.map((el, index) => {
                return (
                  <div
                    key={"LoadingCart" + index}
                    className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                  ></div>
                );
              })
            : data.map((product, index) => {
                return (
                  <div
                    key={product?._id}
                    className={`w-full bg-white my-2 border rounded grid grid-cols-[40px,128px,1fr] items-center ${
                      selectedItems.includes(product._id)
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  >
                    <div className="pl-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product._id)}
                        onChange={() => handleSelectItem(product._id)}
                        className="w-5 h-5"
                      />
                    </div>

                    {/* Hình ảnh sản phẩm */}
                    <div className="w-32 h-32 bg-slate-200 p-1">
                      {/* *** THÊM MỚI: Bọc Link quanh ảnh *** */}
                      <Link to={`/product/${product?.productId?._id}`}>
                        <img
                          src={product?.productId?.productImage?.[0]}
                          className="w-full h-full object-contain mix-blend-multiply cursor-pointer"
                          alt={product?.productId?.productName}
                        />
                      </Link>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="px-4 py-2 relative h-full flex flex-col justify-between">
                      <div>
                        {/** Nút Xóa **/}
                        <div
                          className="absolute top-1 right-1 text-slate-500 hover:text-red-600 rounded-full p-2 cursor-pointer"
                          onClick={() => deleteCartProduct(product?._id)}
                        >
                          <MdDelete size={20} />
                        </div>

                        {/* *** THÊM MỚI: Bọc Link quanh tên sản phẩm *** */}
                        <Link to={`/product/${product?.productId?._id}`}>
                          <h2 className="text-lg lg:text-xl font-medium text-ellipsis line-clamp-1 hover:text-red-600 cursor-pointer">
                            {product?.productId?.productName}
                          </h2>
                        </Link>

                        <p className="capitalize text-slate-500">
                          {product?.productId?.category}
                        </p>

                        <p className="text-red-600 font-medium text-lg mt-1">
                          {displayVNDCurrency(product?.productId?.sellingPrice)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Tăng/Giảm số lượng */}
                        <div className="flex items-center gap-3">
                          <button
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                            onClick={() =>
                              decraseQty(product?._id, product?.quantity)
                            }
                          >
                            -
                          </button>
                          <span className="text-lg">{product?.quantity}</span>
                          <button
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                            onClick={() =>
                              increaseQty(product?._id, product?.quantity)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Tổng giá của sản phẩm này */}
                        <p className="text-slate-700 font-semibold text-lg">
                          {displayVNDCurrency(
                            product?.productId?.sellingPrice * product?.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/*** Tóm tắt đơn hàng (Summary) ***/}
        <div className="mt-5 lg:mt-0 w-full max-w-sm lg:sticky lg:top-4 h-fit">
          {loading ? (
            <div className="h-48 bg-slate-200 border border-slate-300 animate-pulse rounded"></div>
          ) : (
            data.length > 0 && (
              <div className="bg-white rounded border border-slate-300">
                <h2 className="text-white bg-red-600 px-4 py-2 rounded-t text-lg font-semibold">
                  Tóm tắt đơn hàng
                </h2>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between font-medium text-slate-600">
                    <p>Số lượng (sản phẩm đã chọn)</p>
                    <p>{selectedTotalQty}</p>
                  </div>

                  <div className="flex items-center justify-between font-semibold text-lg">
                    <p>Tổng tiền</p>
                    <p className="text-red-600">
                      {displayVNDCurrency(selectedTotalPrice)}
                    </p>
                  </div>

                  <button
                    className={`bg-red-600 p-3 text-white w-full mt-4 rounded-lg font-semibold text-lg ${
                      selectedItems.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-700"
                    }`}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Tiến hành thanh toán ({selectedItems.length})
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
