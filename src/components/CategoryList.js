import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryLoading = new Array(8).fill(null);

  const fetchCategoryProduct = async () => {
    try {
      setLoading(true);

      // ✅ kiểm tra cache trước
      const cache = localStorage.getItem("category-cache");
      if (cache) {
        setCategoryProduct(JSON.parse(cache));
        setLoading(false);
      }

      const res = await fetch(SummaryApi.categoryProduct.url);
      const json = await res.json();

      // ✅ lưu cache
      localStorage.setItem("category-cache", JSON.stringify(json.data));

      setCategoryProduct(json.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh Mục Sản Phẩm</h2>

      <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none px-2">
        {loading
          ? categoryLoading.map((_, index) => (
              <div className="flex flex-col items-center gap-2" key={index}>
                <div className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-white shadow animate-pulse flex items-center justify-center">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))
          : categoryProduct.map((product, index) => (
              <Link
                to={"/product-category?category=" + product?.category}
                key={product?.category || index}
                className="flex flex-col items-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-white shadow flex items-center justify-center">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.category}
                    loading="lazy" // ✅ Lazy load ảnh
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-center text-sm md:text-base capitalize text-slate-700 font-medium group-hover:text-red-600">
                  {product?.category}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryList;
