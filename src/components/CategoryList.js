import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryLoading = new Array(8).fill(null);

  const fetchCategoryProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.categoryProduct.url);
    const dataResponse = await response.json();
    setLoading(false);
    setCategoryProduct(dataResponse.data);
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh Mục Sản Phẩm</h2>

      <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none px-2">
        {loading
          ? categoryLoading.map((el, index) => {
              return (
                <div
                  className="flex flex-col items-center gap-2"
                  key={"categoryLoading" + index}
                >
                  {/* --- SKELETON CŨNG NÊN ĐỔI THÀNH bg-white và CÓ SHADOW --- */}
                  <div className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-white shadow flex items-center justify-center animate-pulse">
                    {/* Thêm một vòng tròn bên trong để giả lập ảnh */}
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                </div>
              );
            })
          : categoryProduct.map((product, index) => {
              return (
                <Link
                  to={"/product-category?category=" + product?.category}
                  className="flex flex-col items-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-105"
                  key={product?.category}
                >
                  {/* --- ĐÂY LÀ DÒNG ĐÃ THAY ĐỔI --- */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-white shadow flex items-center justify-center transition-shadow duration-300 group-hover:shadow-md">
                    {/*
                      THAY ĐỔI:
                      - Đổi 'bg-slate-100' -> 'bg-white'
                      - Thêm 'shadow'
                    */}
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* ------------------------------- */}

                  <p className="text-center text-sm md:text-base capitalize text-slate-700 font-medium transition-colors duration-300 group-hover:text-red-600">
                    {product?.category}
                  </p>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryList;
