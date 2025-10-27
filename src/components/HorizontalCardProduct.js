import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayVNDCurrency from "../helpers/displayCurrency"; //
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context); //

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id); //
    fetchUserAddToCart(); //
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category); //
    setLoading(false);
    setData(categoryProduct?.data); //
  };

  useEffect(() => {
    fetchData();
  }, []); //

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300; //
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300; //
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div className="relative">
        {/* [CẬP NHẬT] Nút điều khiển */}
        <button
          className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block hover:bg-white transition-all"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block hover:bg-white transition-all"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {/* [CẬP NHẬT] Thêm padding `py-2` để shadow không bị cắt khi hover */}
        <div
          className="flex gap-4 md:gap-6 overflow-x-scroll scrollbar-none scroll-smooth py-2"
          ref={scrollElement}
        >
          {loading
            ? // [CẬP NHẬT] Skeleton UI
              loadingList.map((product, index) => (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="bg-slate-200 h-48 p-4 animate-pulse"></div>
                  <div className="p-4 grid gap-3">
                    <h2 className="bg-slate-200 animate-pulse h-4 rounded-full"></h2>
                    <p className="bg-slate-200 animate-pulse h-4 rounded-full"></p>
                    <div className="flex gap-3">
                      <p className="bg-slate-200 animate-pulse h-4 w-full rounded-full"></p>
                      <p className="bg-slate-200 animate-pulse h-4 w-full rounded-full"></p>
                    </div>
                    <button className="bg-slate-200 animate-pulse h-8 rounded-full w-full"></button>
                  </div>
                </div>
              ))
            : // [CẬP NHẬT] Card sản phẩm thật
              data.map((product, index) => (
                <Link
                  to={"product/" + product?._id} //
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                >
                  {/* [CẬP NHẬT] Nền ảnh và hiệu ứng */}
                  <div className="bg-slate-50 h-48 p-4 flex justify-center items-center">
                    <img
                      src={product.productImage[0]}
                      className="object-contain h-full" // [CẬP NHẬT] Bỏ hover:scale-110
                      alt={product?.productName}
                    />
                  </div>
                  {/* [CẬP NHẬT] Tăng `gap-2` */}
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-2 text-black h-12">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.category}
                    </p>
                    <div className="flex gap-2 items-center">
                      <p className="text-red-600 font-medium text-sm">
                        {displayVNDCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through text-xs">
                        {displayVNDCurrency(product?.price)}
                      </p>
                    </div>
                    {/* [CẬP NHẬT] Thêm `transition-colors` */}
                    <button
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full mt-auto transition-colors"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
