import React, { useEffect, useState, useMemo } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import AdminEditProduct from "../components/AdminEditProduct";
import { FaPlus, FaFilter } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

// --- COMPONENT SKELETON (ĐỂ HIỂN THỊ KHI TẢI) ---
// Bạn có thể đặt component này ở file riêng và import vào
const AdminProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-[280px] min-w-[280px] animate-pulse">
      {/* Skeleton cho hình ảnh */}
      <div className="w-32 h-32 bg-slate-200 mx-auto rounded"></div>
      {/* Skeleton cho tên sản phẩm */}
      <div className="h-4 bg-slate-200 rounded mt-4 w-3/4 mx-auto"></div>
      {/* Skeleton cho giá */}
      <div className="h-3 bg-slate-200 rounded mt-3 w-1/2 mx-auto"></div>
      {/* Skeleton cho 2 nút Edit/Delete */}
      <div className="flex justify-between items-center mt-5">
        <div className="h-8 w-16 bg-slate-200 rounded"></div>
        <div className="h-8 w-16 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};
// ---------------------------------------------------

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <-- THAY ĐỔI: Thêm state loading
  const [refreshKey, setRefreshKey] = useState(0); // <-- THAY ĐỔI: State để trigger fetch lại data

  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  // --- State mới cho Tìm kiếm và Lọc ---
  const [searchQuery, setSearchQuery] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  // <-- THAY ĐỔI: Xóa hàm fetchAllProduct riêng và gộp logic vào useEffect bên dưới
  // <-- THAY ĐỔI: Xóa useEffect[] cũ (tránh fetch 2 lần khi tải trang)

  // --- Hàm refetch data (dùng cho Upload, Edit, Delete) ---
  const refetchData = () => {
    setRefreshKey((prev) => prev + 1); // <-- THAY ĐỔI: Chỉ cần thay đổi key này là useEffect bên dưới sẽ chạy lại
  };

  // --- useEffect chính để xử lý TẤT CẢ việc fetch data ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true); // <-- THAY ĐỔI: Bắt đầu loading
      try {
        let response;
        if (searchQuery) {
          // --- Logic TÌM KIẾM ---
          response = await fetch(
            `${SummaryApi.searchProduct.url}?q=${searchQuery}`,
            {
              method: SummaryApi.searchProduct.method,
            }
          );
        } else if (selectedCategories.length > 0) {
          // --- Logic LỌC ---
          response = await fetch(SummaryApi.filterProduct.url, {
            method: SummaryApi.filterProduct.method,
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              category: selectedCategories,
            }),
          });
        } else {
          // --- Logic LẤY TẤT CẢ SẢN PHẨM (cho lần tải đầu hoặc khi reset) ---
          response = await fetch(SummaryApi.allProduct.url);
        }

        const dataResponse = await response.json();
        const products = dataResponse?.data || [];
        setAllProduct(products);

        // Tự động lấy danh sách category (chỉ khi lấy tất cả sản phẩm)
        if (
          !searchQuery &&
          selectedCategories.length === 0 &&
          products.length > 0
        ) {
          const categories = [
            ...new Set(products.map((product) => product.category)),
          ];
          setAvailableCategories(categories.sort());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllProduct([]); // Đảm bảo mảng rỗng nếu có lỗi
      } finally {
        setIsLoading(false); // <-- THAY ĐỔI: Tải xong (dù thành công hay lỗi)
      }
    }, 300); // 300ms debounce

    // Cleanup function
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, refreshKey]); // <-- THAY ĐỔI: Thêm refreshKey

  // --- Hàm xử lý thay đổi cho Tìm kiếm ---
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Khi tìm kiếm, xóa bộ lọc
    if (selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  };

  // --- Hàm xử lý thay đổi cho Lọc ---
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    // Khi lọc, xóa tìm kiếm
    if (searchQuery) {
      setSearchQuery("");
    }
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleOpenEditModal = (product) => {
    setEditProductData(product);
    setOpenEditProduct(true);
    setOpenUploadProduct(false);
  };

  const handleOpenUploadModal = () => {
    setOpenUploadProduct(true);
    setOpenEditProduct(false);
  };

  return (
    <div>
      {/* Header đã cập nhật với Search và Filter */}
      <div className="bg-white py-4 px-6 border-b border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-2xl text-slate-800">
            {/* <-- THAY ĐỔI: Không hiển thị count khi đang loading */}
            All Products {isLoading ? "" : `(${allProduct.length})`}
          </h2>
          <button
            className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-all py-2 px-4 rounded-lg shadow-md"
            onClick={handleOpenUploadModal}
          >
            <FaPlus />
            Upload Product
          </button>
        </div>

        {/* Thanh Search và Filter */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search product name or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-2 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg shadow-md transition-all ${
              selectedCategories.length > 0
                ? "bg-red-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <FaFilter />
            Filter
            {selectedCategories.length > 0 && ` (${selectedCategories.length})`}
          </button>
        </div>

        {/* Panel Filter (hiện khi bấm nút) */}
        {showFilter && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-slate-700 mb-2">
              Filter by Category
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                    className="form-checkbox text-red-600 rounded focus:ring-red-500"
                  />
                  {category}
                </label>
              ))}
            </div>
            {availableCategories.length === 0 && (
              <p className="text-sm text-slate-500">No categories found.</p>
            )}
          </div>
        )}
      </div>

      {/**all product */}
      {/* <-- THAY ĐỔI: Cập nhật logic render với isLoading --> */}
      <div className="flex flex-wrap gap-5 p-6 h-[calc(100vh-190px)] overflow-y-auto">
        {isLoading ? (
          // Hiển thị 8 Skeleton Card khi đang tải
          Array(8)
            .fill(null)
            .map((_, index) => <AdminProductCardSkeleton key={index} />)
        ) : allProduct.length > 0 ? (
          // Hiển thị sản phẩm khi tải xong và có dữ liệu
          allProduct.map((product, index) => (
            <AdminProductCard
              data={product}
              key={product._id || index}
              fetchdata={refetchData} // <-- THAY ĐỔI
              onEdit={handleOpenEditModal}
            />
          ))
        ) : (
          // Hiển thị thông báo khi tải xong và không có dữ liệu
          <p className="text-slate-500 w-full text-center mt-10">
            No products found.
          </p>
        )}
      </div>

      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={refetchData} // <-- THAY ĐỔI
        />
      )}

      {/**edit product component */}
      {openEditProduct && editProductData && (
        <AdminEditProduct
          productData={editProductData}
          onClose={() => setOpenEditProduct(false)}
          fetchdata={refetchData} // <-- THAY ĐỔI
        />
      )}
    </div>
  );
};

export default AllProducts;
