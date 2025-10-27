import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
// 1. SỬA LỖI: Import helper 'uploadImage' giống như file AdminEditProduct
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { IoIosRefresh } from "react-icons/io";

// 2. SỬA LỖI: Xóa 2 import không dùng đến
// import imageTobase64 from "../helpers/imageTobase64";
// import imageCompression from "browser-image-compression";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  // 3. SỬA LỖI: Thay thế hoàn toàn hàm này bằng logic từ file AdminEditProduct
  //    (Chúng ta giữ lại phần 'setIsUploading' và 'try...catch...finally')
  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadResponse = await uploadImage(file);
      console.log("Kết quả từ API:", uploadResponse);

      if (
        uploadResponse.success &&
        uploadResponse.result &&
        uploadResponse.result[0]
      ) {
        // SỬA LỖI (LẦN 2): Lấy đúng tên trường 'imageUrl' từ log của bạn
        const imageUrl = uploadResponse.result[0].imageUrl;

        if (imageUrl) {
          // Nếu tìm thấy URL, thêm vào state
          setData((preve) => {
            return {
              ...preve,
              productImage: [...preve.productImage, imageUrl],
            };
          });
          toast.success("Tải ảnh lên thành công!");
        } else {
          // Log này không nên chạy nữa
          toast.error("Tải lên thành công nhưng không tìm thấy URL ảnh.");
          console.log(
            "Không tìm thấy .imageUrl trong:",
            uploadResponse.result[0]
          );
        }
      } else {
        toast.error("Tải ảnh lên thất bại. (API báo lỗi)");
        console.log("API upload báo lỗi:", uploadResponse);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xử lý ảnh.");
      console.error("Lỗi từ catch:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => ({
      ...preve,
      productImage: [...newProductImage],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.productImage.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh sản phẩm!");
      return;
    }

    console.log("Đang gửi đến URL:", SummaryApi.uploadProduct.url);
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      // Bây giờ body sẽ rất nhỏ vì chỉ chứa URL
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="fixed w-full h-full bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Product
          </h2>
          <div
            className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="flex-grow overflow-y-auto p-4 space-y-5"
          onSubmit={handleSubmit}
        >
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name :
            </label>
            <input
              type="text"
              id="productName"
              placeholder="Enter product name"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label
              htmlFor="brandName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand Name :
            </label>
            <input
              type="text"
              id="brandName"
              placeholder="Enter brand name"
              name="brandName"
              value={data.brandName}
              onChange={handleOnChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Price & Selling Price (Side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price :
              </label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                value={data.price}
                name="price"
                onChange={handleOnChange}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label
                htmlFor="sellingPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Selling Price :
              </label>
              <input
                type="number"
                id="sellingPrice"
                placeholder="Enter selling price"
                value={data.sellingPrice}
                name="sellingPrice"
                onChange={handleOnChange}
                className={inputStyle}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category :
            </label>
            <select
              required
              value={data.category}
              name="category"
              onChange={handleOnChange}
              className={inputStyle}
            >
              <option value={""}>Select Category</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>
                  {el.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image :
            </label>
            <label htmlFor="uploadImageInput">
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                {isUploading ? (
                  <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                    <IoIosRefresh className="text-4xl animate-spin text-indigo-600" />
                    <p className="text-sm">Đang xử lý...</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="text-4xl">
                      <FaCloudUploadAlt />
                    </span>
                    <p className="text-sm mt-2">Nhấn để tải ảnh lên</p>
                    <p className="text-xs text-gray-400">hoặc kéo và thả</p>
                    <input
                      type="file"
                      id="uploadImageInput"
                      className="hidden"
                      onChange={handleUploadProduct}
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Image Preview */}
          <div>
            {data?.productImage[0] ? (
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {data.productImage.map((el, index) => (
                  <div key={index} className="relative group h-20 w-20">
                    <img
                      src={el}
                      alt={"product image " + index}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-md border border-gray-200 cursor-pointer"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div
                      className="absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer transition-all"
                      onClick={() => handleDeleteProductImage(index)}
                      title="Xóa ảnh"
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isUploading && (
                <p className="text-red-600 text-xs">
                  *Vui lòng tải lên ít nhất một ảnh
                </p>
              )
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description :
            </label>
            <textarea
              className={`${inputStyle} min-h-[100px] resize-y`}
              placeholder="Enter product description"
              rows={4}
              onChange={handleOnChange}
              name="description"
              value={data.description}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? "Đang xử lý..." : "Upload Product"}
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default UploadProduct;
