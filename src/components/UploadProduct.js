import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { IoIosRefresh } from "react-icons/io"; // Import icon spinner

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
  const [isUploading, setIsUploading] = useState(false); // Thêm state cho việc tải ảnh

  // Style chung cho input hiện đại
  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true); // Bắt đầu loading
    try {
      const uploadImageCloudinary = await uploadImage(file);

      if (uploadImageCloudinary.url) {
        setData((preve) => {
          return {
            ...preve,
            productImage: [...preve.productImage, uploadImageCloudinary.url],
          };
        });
        toast.success("Tải ảnh lên thành công!");
      } else {
        toast.error("Tải ảnh lên thất bại.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải ảnh lên.");
      console.error(error);
    } finally {
      setIsUploading(false); // Kết thúc loading
    }
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage],
      };
    });
  };

  /** upload product */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cảnh báo nếu chưa có ảnh
    if (data.productImage.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh sản phẩm!");
      return;
    }

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
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
    // Lớp phủ nền modal
    <div className="fixed w-full h-full bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      {/* Card Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
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

        {/* Form Content - Cho phép cuộn */}
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
              {productCategory.map((el, index) => {
                return (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                );
              })}
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
                  // Trạng thái đang tải lên
                  <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                    <IoIosRefresh className="text-4xl animate-spin text-indigo-600" />
                    <p className="text-sm">Đang tải lên...</p>
                  </div>
                ) : (
                  // Trạng thái chờ tải
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
                {data.productImage.map((el, index) => {
                  return (
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

                      {/* Nút xóa ảnh */}
                      <div
                        className="absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer transition-all"
                        onClick={() => handleDeleteProductImage(index)}
                        title="Xóa ảnh"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
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
            disabled={isUploading} // Vô hiệu hóa nút khi đang tải ảnh
          >
            {isUploading ? "Đang xử lý..." : "Upload Product"}
          </button>
        </form>
      </div>

      {/***display image full screen */}
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
