import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayVNDCurrency from "../helpers/displayCurrency";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataReponse = await response.json();

    setData(dataReponse?.data);
    setActiveImage(dataReponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  // [TỐI ƯU] Xóa dependency `zoomImageCoordinate` không cần thiết
  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({
      x,
      y,
    });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-6">
        {/***product Image */}
        {/* [THAY ĐỔI] Tăng `gap-4` -> `gap-6` */}
        <div className="flex flex-col lg:flex-row-reverse gap-4">
          {/* [THAY ĐỔI] 
              - Mobile: `w-full aspect-square` -> Hiện đại, full-width, tỷ lệ 1:1
              - Desktop: Giữ nguyên `lg:h-96 lg:w-96`
          */}
          <div className="w-full aspect-square lg:h-96 lg:w-96 bg-slate-100 relative p-2 rounded-lg">
            <img
              src={activeImage}
              className="h-full w-full object-contain mix-blend-multiply"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              alt="Product"
            />

            {/**product zoom */}
            {zoomImage && (
              <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-100 p-1 -right-[510px] top-0 border shadow-lg rounded-lg">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* [THAY ĐỔI] 
              - Mobile: `h-20` -> Constrain chiều cao của thumbnails
              - Desktop: `lg:h-96` -> Khớp chiều cao ảnh chính
          */}
          <div className="h-20 lg:h-96">
            {loading ? (
              // Skeleton for thumbnails
              <div className="flex gap-2 lg:flex-col overflow-hidden h-full">
                {productImageListLoading.map((_, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              // Actual thumbnails
              // [THAY ĐỔI] `lg:h-full` để scrollbar chỉ xuất hiện trên desktop
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none lg:h-full">
                {data?.productImage?.map((imgURL, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-100 rounded p-1"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        className={`w-full h-full object-contain mix-blend-multiply cursor-pointer rounded transition-all
                          ${
                            activeImage === imgURL
                              ? "border-2 border-red-500"
                              : "border border-transparent"
                          }
                        `}
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {/* [THAY ĐỔI] Cập nhật Skeleton để khớp 1:1 với layout mới */}
        {loading ? (
          <div className="flex-1 flex flex-col gap-3">
            <div className="w-28 h-6 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-4/5 h-8 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-5 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-32 h-5 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-1/2 h-7 bg-slate-200 rounded-full animate-pulse my-2"></div>
            <div className="flex flex-col sm:flex-row gap-3 my-2">
              <div className="w-full sm:w-32 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="w-full sm:w-32 h-10 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="w-32 h-6 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="w-full h-20 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : (
          // [THAY ĐỔI] Tăng `gap-1` -> `gap-2 md:gap-3`
          <div className="flex flex-col gap-2 md:gap-3 flex-1">
            <p className="bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block w-fit text-sm font-medium">
              {data?.brandName}
            </p>
            {/* [THAY ĐỔI] `font-bold` và `lg:text-3xl` */}
            <h2 className="text-2xl lg:text-3xl font-bold text-black">
              {data?.productName}
            </h2>
            <p className="capitalize text-slate-500">{data?.category}</p>

            <div className="text-yellow-500 flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
              <span className="text-sm text-slate-500 ml-1">(4.5)</span>
            </div>

            {/* [THAY ĐỔI] Tăng `my-1` -> `my-2` */}
            <div className="flex items-center gap-2 text-xl lg:text-2xl font-medium my-2">
              <p className="text-red-600">
                {displayVNDCurrency(data.sellingPrice)}
              </p>
              <p className="text-slate-400 line-through text-lg">
                {displayVNDCurrency(data.price)}
              </p>
            </div>

            {/* [THAY ĐỔI] 
                - Mobile: `flex-col w-full`
                - Desktop: `sm:flex-row sm:w-auto`
            */}
            <div className="flex flex-col sm:flex-row items-center gap-3 my-2">
              <button
                className="w-full sm:w-auto border-2 border-red-600 rounded-full px-6 py-2 min-w-[140px] text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-all"
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy Now
              </button>
              <button
                className="w-full sm:w-auto border-2 border-red-600 rounded-full px-6 py-2 min-w-[140px] font-semibold text-white bg-red-600 hover:text-red-600 hover:bg-white transition-all"
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>

            <div>
              <p className="text-slate-700 font-semibold my-1">
                Description :{" "}
              </p>
              {/* [THAY ĐỔI] Thêm `leading-relaxed` để dễ đọc */}
              <p className="text-slate-600 leading-relaxed">
                {data?.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {data.category && (
        <CategoryWiseProductDisplay
          category={data?.category}
          heading={"Recommended Product"}
        />
      )}
    </div>
  );
};

export default ProductDetails;
