import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();

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

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div className="relative">
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {/* SỬA LỖI: Bỏ 'items-center' để các card có thể co giãn chiều cao bằng nhau */}
        <div
          className="flex gap-4 md:gap-6 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={scrollElement}
        >
          {loading
            ? // Phần code loading giữ nguyên
              loadingList.map((product, index) => {
                return (
                  <div
                    key={index}
                    className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow"
                  >
                    <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] animate-pulse"></div>
                    <div className="p-4 grid gap-3">
                      <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full"></h2>
                      <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full"></p>
                      <div className="flex gap-3">
                        <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                        <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                      </div>
                      <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse"></button>
                    </div>
                  </div>
                );
              })
            : data.map((product, index) => {
                return (
                  <Link
                    to={"product/" + product?._id}
                    key={index}
                    className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow"
                  >
                    <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
                      <img
                        src={product.productImage[0]}
                        className="object-scale-down h-full hover:scale-110 transition-all"
                        alt={product?.productName}
                      />
                    </div>
                    {/* SỬA LỖI 1: Chuyển layout từ 'grid' thành 'flex flex-col' để kiểm soát tốt hơn */}
                    <div className="p-4 flex flex-col gap-1">
                      {/* SỬA LỖI 2: Đặt chiều cao cố định và cho phép 2 dòng text */}
                      <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-2 text-black h-12">
                        {product?.productName}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product?.category}
                      </p>
                      <div className="flex gap-2 flex-nowrap items-center">
                        <p className="text-red-600 font-medium text-sm">
                          {displayINRCurrency(product?.sellingPrice)}
                        </p>
                        <p className="text-slate-500 line-through text-xs">
                          {displayINRCurrency(product?.price)}
                        </p>
                      </div>
                      {/* SỬA LỖI 3: Thêm 'mt-auto' để đẩy nút xuống dưới cùng */}
                      <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full mt-auto">
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
