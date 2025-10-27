import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cập nhật: Giảm số lượng skeleton cho gọn gàng hơn
  const categoryLoading = new Array(8).fill(null);

  const fetchCategoryProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.categoryProduct.url); // [cite: index.js]
    const dataResponse = await response.json();
    setLoading(false);
    setCategoryProduct(dataResponse.data);
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    // [CẬP NHẬT] Thêm tiêu đề và khoảng đệm cho component
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh Mục Sản Phẩm</h2>

      {/* [CẬP NHẬT] Thêm padding ngang (px-2) để tránh bị dính 2 đầu */}
      <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none px-2">
        {loading
          ? // [CẬP NHẬT] Giao diện Skeleton Loading (thêm thanh text)
            categoryLoading.map((el, index) => {
              return (
                <div
                  className="flex flex-col items-center gap-2"
                  key={"categoryLoading" + index}
                >
                  <div className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-slate-200 animate-pulse"></div>
                  <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                </div>
              );
            })
          : categoryProduct.map((product, index) => {
              return (
                // [CẬP NHẬT] Thêm flex-col, items-center, gap-2
                // Thêm group để hover chữ khi hover cả khối
                // Thêm hiệu ứng transform
                <Link
                  to={"/product-category?category=" + product?.category} // [cite: index.js]
                  className="flex flex-col items-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-105"
                  key={product?.category}
                >
                  {/* [CẬP NHẬT] 
                                    - Đổi bg-slate-200 -> bg-slate-100 
                                    - Đổi p-4 -> p-3
                                    - Thêm hiệu ứng group-hover:shadow-md
                                */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-slate-100 flex items-center justify-center transition-shadow duration-300 group-hover:shadow-md">
                    {/* [CẬP NHẬT] 
                                        - Bỏ mix-blend-multiply
                                        - Đổi object-scale-down -> object-contain
                                        - Bỏ hover:scale-125 (đã chuyển ra ngoài)
                                    */}
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* [CẬP NHẬT] 
                                    - Thêm text-slate-700
                                    - Thêm font-medium
                                    - Thêm hiệu ứng group-hover:text-red-600
                                */}
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
