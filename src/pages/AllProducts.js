import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import { FaPlus, FaBoxOpen } from "react-icons/fa6";

// ======================
// Skeleton Card
// ======================
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded-md mb-3 w-4/5"></div>
    <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-4"></div>
    <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-5"></div>
    <div className="flex justify-between gap-3">
      <div className="h-9 w-full bg-gray-200 rounded-lg"></div>
      <div className="h-9 w-full bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// ======================
// Component Chính
// ======================
const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    setLoading(false);
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-8 bg-slate-50 min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center bg-white py-4 px-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="font-bold text-2xl text-slate-800">
            Quản lý sản phẩm
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Xem, chỉnh sửa và thêm mới sản phẩm trong cửa hàng của bạn
          </p>
        </div>
        <button
          onClick={() => setOpenUploadProduct(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300"
        >
          <FaPlus />
          Thêm sản phẩm
        </button>
      </div>

      {/* ===== Danh sách sản phẩm ===== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : allProduct.length === 0 ? (
        // ===== Trạng thái trống =====
        <div className="flex flex-col items-center justify-center text-center p-20 bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
          <FaBoxOpen className="w-24 h-24 text-slate-300" />
          <h3 className="text-2xl font-semibold text-slate-800 mt-6">
            Chưa có sản phẩm nào
          </h3>
          <p className="text-slate-500 mt-2 max-w-xs">
            Bắt đầu quản lý bằng cách thêm sản phẩm đầu tiên của bạn ngay bây
            giờ.
          </p>
          <button
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-5 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => setOpenUploadProduct(true)}
          >
            <FaPlus />
            Thêm sản phẩm
          </button>
        </div>
      ) : (
        // ===== Grid sản phẩm =====
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allProduct.map((product, index) => (
            <div
              key={index}
              className="
                bg-white 
                border border-slate-200 
                rounded-xl 
                shadow-sm 
                hover:shadow-lg 
                hover:-translate-y-1 
                transition-all 
                duration-300 
                h-full
              "
            >
              <AdminProductCard data={product} fetchdata={fetchAllProduct} />
            </div>
          ))}
        </div>
      )}

      {/* ===== Modal Upload ===== */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
