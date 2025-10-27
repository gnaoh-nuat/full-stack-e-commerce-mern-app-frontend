import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard"; // Giả định component này render grid sản phẩm
import SummaryApi from "../common";

// ===================================================================
// === TÁCH COMPONENT: FILTER SIDEBAR ===
// Tách riêng UI của sidebar để tái sử dụng cho cả Mobile và Desktop
// ===================================================================
const FilterSidebar = ({
  sortBy,
  handleOnChangeSortBy,
  selectCategory,
  handleSelectCategory,
}) => {
  return (
    // Thêm `space-y-6` để tạo khoảng cách giữa các khối "widget"
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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Danh mục</h3>
        <form className="text-sm flex flex-col gap-3">
          {productCategory.map((categoryName, index) => (
            <div key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name={"category"}
                checked={selectCategory[categoryName?.value] || false} // Đảm bảo giá trị là boolean
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
// === COMPONENT CHÍNH: CATEGORY PRODUCT ===
// ===================================================================
const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const isInitialMount = useRef(true);

  // State cho bộ lọc trên di động
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async (categoryList) => {
    setLoading(true);
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: categoryList,
      }),
    });

    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
    setLoading(false);
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((preve) => ({
      ...preve,
      [value]: checked,
    }));
  };

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter((el) => el);

    fetchData(arrayOfCategory);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const urlFormat = arrayOfCategory
        .map((el) => `category=${el}`)
        .join("&&"); // Đơn giản hóa việc join
      navigate("/product-category?" + urlFormat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCategory, navigate]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    if (value === "asc") {
      setData((preve) =>
        [...preve].sort((a, b) => a.sellingPrice - b.sellingPrice)
      );
    }

    if (value === "dsc") {
      setData((preve) =>
        [...preve].sort((a, b) => b.sellingPrice - a.sellingPrice)
      );
    }
  };

  // Tạo props để truyền xuống
  const filterSidebarProps = {
    sortBy,
    handleOnChangeSortBy,
    selectCategory,
    handleSelectCategory,
  };

  return (
    <div className="container mx-auto p-4">
      {/* === HEADER (Mobile) === */}
      {/* Nút filter và số kết quả cho di động */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <p className="font-medium text-slate-800">Kết quả: {data.length}</p>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
        >
          {/* Filter Icon SVG */}
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

      {/* === LAYOUT CHÍNH (Desktop) === */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        {/* --- 1. SIDEBAR (Desktop) --- */}
        {/* `hidden lg:block` để ẩn trên di động */}
        {/* `lg:sticky lg:top-20` để sidebar dính lại khi cuộn */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </div>

        {/* --- 2. KHU VỰC NỘI DUNG (Sản phẩm) --- */}
        <div className="lg:col-span-3">
          {/* Tiêu đề cho Desktop */}
          <p className="hidden lg:block font-medium text-slate-800 text-lg mb-4">
            Kết quả : {data.length}
          </p>

          {/* Xóa `min-h` và `overflow` để trang cuộn tự nhiên */}
          <div className="">
            {data.length !== 0 && !loading && (
              <VerticalCard data={data} loading={loading} />
            )}
            {/* TODO: Thêm skeleton loading và thông báo "Không có sản phẩm" */}
          </div>
        </div>
      </div>

      {/* === 3. NGĂN KÉO FILTER (Mobile) === */}
      {/* Hiện ra khi `mobileFilterOpen` là true */}
      {mobileFilterOpen && (
        <>
          {/* Lớp nền mờ */}
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          ></div>

          {/* Nội dung ngăn kéo */}
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
            {/* Tái sử dụng component sidebar */}
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryProduct;
