import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";
import productCategory from "../helpers/productCategory";

// ===================================================================
// === COMPONENT FILTER SIDEBAR (Giữ nguyên) ===
// ===================================================================
const FilterSidebar = ({
  sortBy,
  handleOnChangeSortBy,
  selectCategory,
  handleSelectCategory,
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/** === WIDGET: SẮP XẾP === */}
      <div className="p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Sắp xếp theo
        </h3>
        <form className="text-sm flex flex-col gap-3">
          <div className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              id="sort_asc"
              checked={sortBy === "asc"}
              onChange={handleOnChangeSortBy}
              value={"asc"}
              className="w-4 h-4 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="sort_asc" className="flex-1 cursor-pointer">
              Giá: Thấp đến Cao
            </label>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              id="sort_dsc"
              checked={sortBy === "dsc"}
              onChange={handleOnChangeSortBy}
              value={"dsc"}
              className="w-4 h-4 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="sort_dsc" className="flex-1 cursor-pointer">
              Giá: Cao đến Thấp
            </label>
          </div>
        </form>
      </div>

      {/** === WIDGET: DANH MỤC === */}
      <div className="p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Lọc theo danh mục
        </h3>
        <form className="text-sm flex flex-col gap-3">
          {productCategory.map((categoryName, index) => (
            <div key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name={"category"}
                // Sửa lỗi: Đảm bảo key tồn tại trong selectCategory
                // '!!' (dấu !! an toàn) sẽ chuyển đổi undefined thành false
                checked={!!selectCategory[categoryName?.value]}
                value={categoryName?.value}
                id={categoryName?.value}
                onChange={handleSelectCategory}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label
                htmlFor={categoryName?.value}
                className="flex-1 cursor-pointer"
              >
                {categoryName?.label}
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

// ===================================================================
// === CÁC COMPONENT SKELETON (Giữ nguyên) ===
// ===================================================================
const SkeletonSidebar = () => (
  <div className="flex flex-col space-y-6">
    {/* Skeleton Sắp xếp */}
    <div className="p-4 rounded-lg border border-slate-200">
      <div className="h-6 w-3/5 bg-slate-200 rounded-full mb-4 animate-pulse"></div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
    </div>
    {/* Skeleton Danh mục */}
    <div className="p-4 rounded-lg border border-slate-200">
      <div className="h-6 w-3/5 bg-slate-200 rounded-full mb-4 animate-pulse"></div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-slate-200 h-48 w-full animate-pulse"></div>
    <div className="p-4 grid gap-3">
      <div className="h-5 bg-slate-200 rounded-full animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
      <div className="flex gap-3">
        <div className="w-1/2 h-4 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="w-1/2 h-4 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
      <div className="h-8 w-full bg-slate-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

// ===================================================================
// === COMPONENT CHÍNH: SEARCH PRODUCT ===
// ===================================================================

// FIX 4: Hàm trợ giúp để tạo state "tất cả được chọn"
const initializeAllCategories = () => {
  // Dùng reduce để biến mảng productCategory thành object
  // Vd: { "airpodes": true, "watches": true, ... }
  return productCategory.reduce((acc, category) => {
    if (category.value) {
      acc[category.value] = true;
    }
    return acc;
  }, {});
};

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]); // Mặc định là mảng rỗng
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");

  // FIX 4: Giá trị mặc định là "tất cả được chọn"
  const [selectCategory, setSelectCategory] = useState(
    initializeAllCategories()
  );

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const searchQuery = new URLSearchParams(query.search).get("q");

  const loadingList = new Array(8).fill(null);

  // FIX 2 & 3: Sửa fetchProduct để xử lý ký tự đặc biệt VÀ lỗi crash (Giữ nguyên)
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = new URL(SummaryApi.searchProduct.url);
      const queryValue = new URLSearchParams(query.search).get("q");
      apiUrl.searchParams.set("q", queryValue || "");

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataResponse = await response.json();

      if (Array.isArray(dataResponse.data)) {
        setData(dataResponse.data);
      } else {
        console.warn("API response data is not an array:", dataResponse);
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // FIX 4 (tiếp): Reset bộ lọc về "tất cả được chọn" khi tìm kiếm
    setSelectCategory(initializeAllCategories());
    setSortBy("");
  }, [query.search]);

  // FIX 1 (tiếp): Sửa logic lọc (Giữ nguyên logic của bạn)
  useEffect(() => {
    let tempFilteredData = [...data];
    const arrayOfCategory = Object.keys(selectCategory).filter(
      (key) => selectCategory[key] // Lấy tất cả key có giá trị 'true'
    );

    // Logic này của bạn vẫn đúng với yêu cầu mới:
    // 1. Khi "tất cả được chọn" (mặc định), arrayOfCategory.length > 0 -> Lọc.
    //    Kết quả là tất cả sản phẩm (vì tất cả đều nằm trong bộ lọc).
    // 2. Khi người dùng bỏ chọn 1, 2 mục... arrayOfCategory.length > 0 -> Lọc.
    //    Chỉ hiển thị các mục được chọn.
    // 3. Khi người dùng bỏ chọn TẤT CẢ, arrayOfCategory.length === 0 -> Không lọc.
    //    Hiển thị TẤT CẢ kết quả (theo logic code hiện tại của bạn).
    if (arrayOfCategory.length > 0) {
      tempFilteredData = tempFilteredData.filter((product) =>
        arrayOfCategory.includes(product.category)
      );
    }
    // Bỏ khối 'else'

    if (sortBy === "asc") {
      tempFilteredData.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }
    if (sortBy === "dsc") {
      tempFilteredData.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }
    setFilteredData(tempFilteredData);
  }, [data, selectCategory, sortBy]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((preve) => ({
      ...preve,
      [value]: checked,
    }));
  };

  const handleOnChangeSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const filterSidebarProps = {
    sortBy,
    handleOnChangeSortBy,
    selectCategory,
    handleSelectCategory,
  };

  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-120px)]">
      {/* === HEADER (Mobile) === */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h1 className="text-lg font-semibold truncate pr-2">
          Kết quả cho "{searchQuery}"
        </h1>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          Lọc & Sắp xếp
        </button>
      </div>

      {/* Render layout 2 cột NGAY LẬP TỨC */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        {/* === 1. SIDEBAR (Desktop) === */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            {loading ? (
              <SkeletonSidebar />
            ) : (
              <FilterSidebar {...filterSidebarProps} />
            )}
          </div>
        </div>

        {/* === 2. KHU VỰC NỘI DUNG (Sản phẩm) === */}
        <div className="lg:col-span-3">
          {/* Tiêu đề (Desktop) */}
          <div className="hidden lg:block mb-4">
            <h1 className="text-2xl font-bold text-slate-800">
              Kết quả cho "{searchQuery}"
            </h1>
            <div className="h-6 mt-1">
              {loading ? (
                <div className="h-5 w-48 bg-slate-200 rounded-full animate-pulse"></div>
              ) : (
                <p className="text-base text-slate-600">
                  {filteredData.length > 0
                    ? `Tìm thấy ${filteredData.length} sản phẩm.`
                    : "Không tìm thấy sản phẩm nào."}
                </p>
              )}
            </div>
          </div>

          {/* Skeleton Grid khi đang tải */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 py-2">
              {loadingList.map((_, index) => (
                <SkeletonCard key={"search-skeleton-" + index} />
              ))}
            </div>
          )}

          {/* Trạng thái không có dữ liệu */}
          {filteredData.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg shadow-sm mt-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-slate-800 mt-4">
                Không tìm thấy kết quả
              </h2>
              <p className="text-slate-500 mt-2">
                Không có sản phẩm nào phù hợp với tìm kiếm hoặc bộ lọc của bạn.
              </p>
              <Link
                to="/"
                className="mt-6 px-5 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          )}

          {/* Hiển thị kết quả */}
          {filteredData.length !== 0 && !loading && (
            <VerticalCard loading={loading} data={filteredData} />
          )}
        </div>
      </div>

      {/* === 3. NGĂN KÉO FILTER (Mobile) === */}
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 p-4 overflow-y-auto lg:hidden">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold">Lọc & Sắp xếp</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-3xl text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            {loading ? (
              <SkeletonSidebar />
            ) : (
              <FilterSidebar {...filterSidebarProps} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchProduct;
