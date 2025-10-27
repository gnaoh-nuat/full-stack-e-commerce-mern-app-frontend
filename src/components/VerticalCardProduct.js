import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayVNDCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

// [THAY ĐỔI] Đã xóa: FaAngleLeft, FaAngleRight, useRef

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  // [THAY ĐỔI] Đã xóa: scrollElement

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // [THAY ĐỔI] Đã xóa: scrollRight, scrollLeft

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      {/* [THAY ĐỔI] Đã xóa các nút cuộn ngang */}

      {/* [THAY ĐỔI] 
          - Đã thay đổi từ `flex` cuộn ngang sang `grid` cuộn dọc
          - Tùy chỉnh số cột theo kích thước màn hình
      */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-2"
        // Đã xóa: ref={scrollElement}
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                // [THAY ĐỔI] Đã xóa min-w/max-w
                className="w-full bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <div className="h-5 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="flex gap-3">
                    <div className="w-1/2 h-4 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                key={index}
                to={`product/${product?._id}`}
                // [THAY ĐỔI] Đã xóa min-w/max-w
                className="w-full bg-white rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
              >
                <div className="bg-slate-50 h-48 p-4 flex justify-center items-center">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-contain h-full"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-2 text-black h-12">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>
                  <div className="flex gap-3">
                    <p className="text-red-600 font-medium">
                      {displayVNDCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through text-sm">
                      {displayVNDCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full transition-colors"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
