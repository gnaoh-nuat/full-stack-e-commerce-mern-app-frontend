import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

const Address = () => {
  const [allAddresses, setAllAddresses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // State cho form
  const [formData, setFormData] = useState({
    phone: "",
    addressDetail: "",
    isDefault: false,
  });

  // Hàm gọi API lấy danh sách địa chỉ
  const fetchAddresses = async () => {
    try {
      const response = await fetch(SummaryApi.getUserAddresses.url, {
        method: SummaryApi.getUserAddresses.method,
        credentials: "include", // Quan trọng để gửi cookie/token
      });
      const dataApi = await response.json();

      if (dataApi.success) {
        setAllAddresses(dataApi.data);
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tải địa chỉ: " + error.message);
    }
  };

  // Tải địa chỉ khi component được mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Xử lý thay đổi input trên form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý khi submit form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = SummaryApi.createAddress.url;
    let method = SummaryApi.createAddress.method;

    // Nếu đang edit, thay đổi URL và method
    if (editingAddressId) {
      url = SummaryApi.updateAddress.url + editingAddressId;
      method = SummaryApi.updateAddress.method;
    }

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message || "Thao tác thành công!");
        setOpenModal(false); // Đóng modal
        fetchAddresses(); // Tải lại danh sách địa chỉ
      } else {
        toast.error(dataApi.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  // Mở modal để thêm mới
  const handleOpenCreateModal = () => {
    setFormData({ phone: "", addressDetail: "", isDefault: false });
    setEditingAddressId(null);
    setOpenModal(true);
  };

  // Mở modal để chỉnh sửa
  const handleOpenEditModal = (address) => {
    setFormData({
      phone: address.phone,
      addressDetail: address.addressDetail,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setOpenModal(true);
  };

  // Xử lý xóa địa chỉ
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        const response = await fetch(SummaryApi.deleteAddress.url + id, {
          method: SummaryApi.deleteAddress.method,
          credentials: "include",
        });

        const dataApi = await response.json();

        if (dataApi.success) {
          toast.success(dataApi.message || "Xóa địa chỉ thành công!");
          fetchAddresses(); // Tải lại danh sách
        } else {
          toast.error(dataApi.message || "Xóa thất bại");
        }
      } catch (error) {
        toast.error("Lỗi: " + error.message);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Địa chỉ của tôi</h2>
        <button
          onClick={handleOpenCreateModal}
          className="bg-black text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-800"
        >
          <IoMdAdd />
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Danh sách địa chỉ */}
      <div className="space-y-4">
        {allAddresses.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
        ) : (
          allAddresses.map((address) => (
            <div
              key={address._id}
              className="bg-white shadow rounded-lg p-5 flex justify-between items-start border border-gray-200"
            >
              <div>
                {address.isDefault && (
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-2 inline-block">
                    Mặc định
                  </span>
                )}
                <p className="font-semibold text-gray-800">
                  Địa chỉ:{" "}
                  <span className="font-normal">{address.addressDetail}</span>
                </p>
                <p className="font-semibold text-gray-800">
                  Số điện thoại:{" "}
                  <span className="font-normal">{address.phone}</span>
                </p>
              </div>
              <div className="flex gap-4 text-xl">
                <button
                  onClick={() => handleOpenEditModal(address)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm/Sửa Địa chỉ */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-6">
              {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="addressDetail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ chi tiết
                </label>
                <textarea
                  id="addressDetail"
                  name="addressDetail"
                  rows="3"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Số 1, Ngõ 1 Láng Hạ, Đống Đa, Hà Nội"
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-5 rounded-md hover:bg-gray-800"
                >
                  {editingAddressId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
