import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

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
    const uploadImageCloudinary = await uploadImage(file);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url],
      };
    });
  };

  const handleDeleteProductImage = async (index) => {
    console.log("image index", index);

    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
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
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    // Backdrop hiện đại hơn
    <div className="fixed w-full h-full bg-black bg-opacity-40 top-0 left-0 right-0 bottom-0 flex justify-center items-center p-4">
      {/* Modal Box với layout flex-col (Header, Body-scroll, Footer)
        Đã xóa 'h-full' để 'items-center' có thể căn giữa
      */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="font-semibold text-xl text-slate-800">Edit Product</h2>
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full text-2xl text-slate-600 hover:bg-slate-100 hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <form
          className="flex flex-col gap-4 p-6 overflow-y-auto"
          onSubmit={handleSubmit}
        >
          {/* Nhóm ProductName */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-slate-700 mb-1"
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
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Nhóm BrandName */}
          <div>
            <label
              htmlFor="brandName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Brand Name :
            </label>
            <input
              type="text"
              id="brandName"
              placeholder="Enter brand name"
              value={data.brandName}
              name="brandName"
              onChange={handleOnChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Nhóm Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Category :
            </label>
            <select
              required
              value={data.category}
              name="category"
              onChange={handleOnChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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

          {/* Nhóm Product Image */}
          <div>
            <label
              htmlFor="productImage"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Product Image :
            </label>
            <label htmlFor="uploadImageInput">
              <div className="p-2 border-2 border-dashed border-slate-300 rounded-md h-32 w-full flex justify-center items-center cursor-pointer hover:border-red-500 transition-all">
                <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                  <span className="text-4xl">
                    <FaCloudUploadAlt />
                  </span>
                  <p className="text-sm">Upload Product Image</p>
                  <input
                    type="file"
                    id="uploadImageInput"
                    className="hidden"
                    onChange={handleUploadProduct}
                  />
                </div>
              </div>
            </label>
            <div>
              {data?.productImage[0] ? (
                <div className="flex items-center gap-3 mt-3">
                  {data.productImage.map((el, index) => {
                    return (
                      <div className="relative group">
                        <img
                          src={el}
                          alt={el}
                          width={80}
                          height={80}
                          className="bg-slate-100 border rounded-md object-cover h-20 w-20 cursor-pointer"
                          onClick={() => {
                            setOpenFullScreenImage(true);
                            setFullScreenImage(el);
                          }}
                        />
                        {/* Nút delete (đã có màu đỏ, rất hợp) */}
                        <div
                          className="absolute -bottom-2 -right-2 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                          onClick={() => handleDeleteProductImage(index)}
                        >
                          <MdDelete />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-red-600 text-xs mt-1">
                  *Please upload product image
                </p>
              )}
            </div>
          </div>

          {/* Nhóm Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-700 mb-1"
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
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Nhóm Selling Price */}
          <div>
            <label
              htmlFor="sellingPrice"
              className="block text-sm font-medium text-slate-700 mb-1"
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
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Nhóm Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description :
            </label>
            <textarea
              className="w-full h-28 bg-white border border-slate-300 rounded-md shadow-sm resize-none p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter product description"
              rows={3}
              onChange={handleOnChange}
              name="description"
              value={data.description}
            ></textarea>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 mt-auto">
          <button
            onClick={handleSubmit} // Thêm onClick ở đây để submit, vì nút đã nằm ngoài <form>
            className="w-full px-3 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Update Product
          </button>
        </div>
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

export default AdminEditProduct;
