import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import AdminEditProduct from "../components/AdminEditProduct";
import { FaPlus } from "react-icons/fa"; // Thêm icon

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const handleOpenEditModal = (product) => {
    setEditProductData(product);
    setOpenEditProduct(true);
    setOpenUploadProduct(false);
  };

  const handleOpenUploadModal = () => {
    setOpenUploadProduct(true);
    setOpenEditProduct(false);
  };

  return (
    <div>
      {/* Header được làm rõ ràng hơn */}
      <div className="bg-white py-4 px-6 flex justify-between items-center border-b border-slate-200">
        <h2 className="font-semibold text-2xl text-slate-800">All Product</h2>
        <button
          className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-all py-2 px-4 rounded-lg shadow-md"
          onClick={handleOpenUploadModal}
        >
          <FaPlus />
          Upload Product
        </button>
      </div>

      {/**all product */}
      {/* Thêm padding (p-6) cho khu vực scroll */}
      <div className="flex flex-wrap gap-5 p-6 h-[calc(100vh-120px)] overflow-y-auto">
        {allProduct.map((product, index) => {
          return (
            <AdminProductCard
              data={product}
              key={index + "allProduct"}
              fetchdata={fetchAllProduct}
              onEdit={handleOpenEditModal}
            />
          );
        })}
      </div>

      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}

      {/**edit product component */}
      {openEditProduct && editProductData && (
        <AdminEditProduct
          productData={editProductData}
          onClose={() => setOpenEditProduct(false)}
          fetchdata={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
