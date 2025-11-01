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
    stock: 0,
    averageRating: 0,
    numberOfReviews: 0,
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

  // Review states
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all"); // all, 5, 4, 3, 2, 1

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

  const fetchProductReviews = async () => {
    if (!params?.id) return;

    setLoadingReviews(true);
    try {
      const url = `${SummaryApi.getProductReviews.url}/${params.id}`;
      const response = await fetch(url, {
        method: SummaryApi.getProductReviews.method,
        headers: {
          "content-type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setReviews(result.data || []);
        setFilteredReviews(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Filter reviews when ratingFilter changes
  useEffect(() => {
    if (ratingFilter === "all") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
      setFilteredReviews(filtered);
    }
  }, [ratingFilter, reviews]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

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

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-500" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-6">
        {/***product Image */}
        <div className="flex flex-col lg:flex-row-reverse gap-4">
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

          <div className="h-20 lg:h-96">
            {loading ? (
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
          <div className="flex flex-col gap-2 md:gap-3 flex-1">
            <p className="bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block w-fit text-sm font-medium">
              {data?.brandName}
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold text-black">
              {data?.productName}
            </h2>

            <p className="capitalize text-slate-500">{data?.category}</p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(data?.averageRating || 0)}
              </div>
              <span className="text-sm text-slate-600">
                {data?.averageRating?.toFixed(1) || "0.0"} / 5.0
              </span>
              <span className="text-sm text-slate-500">
                ({data?.numberOfReviews || 0} đánh giá)
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Tình trạng:
              </span>
              {data?.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  Còn {data?.stock} sản phẩm
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  Hết hàng
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xl lg:text-2xl font-medium my-2">
              <p className="text-red-600">
                {displayVNDCurrency(data.sellingPrice)}
              </p>
              <p className="text-slate-400 line-through text-lg">
                {displayVNDCurrency(data.price)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 my-2">
              <button
                className="w-full sm:w-auto border-2 border-red-600 rounded-full px-6 py-2 min-w-[140px] text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => handleBuyProduct(e, data?._id)}
                disabled={data?.stock <= 0}
              >
                Mua ngay
              </button>

              <button
                className="w-full sm:w-auto border-2 border-red-600 rounded-full px-6 py-2 min-w-[140px] font-semibold text-white bg-red-600 hover:text-red-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => handleAddToCart(e, data?._id)}
                disabled={data?.stock <= 0}
              >
                Thêm vào giỏ
              </button>
            </div>

            <div>
              <p className="text-slate-700 font-semibold my-1">Mô tả: </p>
              <p className="text-slate-600 leading-relaxed">
                {data?.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">
          Đánh giá sản phẩm ({reviews.length})
        </h3>

        {/* Rating Summary & Filter */}
        <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Average Rating */}
            <div className="flex flex-col items-center justify-center text-center border-r-0 md:border-r border-slate-200">
              <div className="text-5xl font-bold text-slate-800 mb-2">
                {data?.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(data?.averageRating || 0)}
              </div>
              <p className="text-sm text-slate-600">
                {data?.numberOfReviews || 0} đánh giá
              </p>
            </div>

            {/* Right: Rating Distribution & Filter */}
            <div className="space-y-2">
              <button
                onClick={() => setRatingFilter("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors ${
                  ratingFilter === "all" ? "bg-slate-100 font-medium" : ""
                }`}
              >
                <span className="text-sm">Tất cả</span>
                <span className="text-sm text-slate-600">
                  ({reviews.length})
                </span>
              </button>

              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating] || 0;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <button
                    key={rating}
                    onClick={() => setRatingFilter(rating.toString())}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors ${
                      ratingFilter === rating.toString()
                        ? "bg-slate-100 font-medium"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-sm">{rating}</span>
                      <FaStar className="text-yellow-500 text-xs" />
                    </div>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 min-w-[40px] text-right">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
              <p className="mt-2 text-slate-600">Đang tải đánh giá...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600">
                {ratingFilter === "all"
                  ? "Chưa có đánh giá nào cho sản phẩm này"
                  : `Không có đánh giá ${ratingFilter} sao`}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {review.user?.profilePic ? (
                      <img
                        src={review.user.profilePic}
                        alt={review.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-lg">
                          {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-slate-800">
                          {review.user?.name || "Người dùng"}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-slate-700 leading-relaxed mt-2">
                        {review.comment}
                      </p>
                    )}

                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.reviewImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border border-slate-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {data.category && (
        <div className="mt-12">
          <CategoryWiseProductDisplay
            category={data?.category}
            heading={"Sản phẩm tương tự"}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
