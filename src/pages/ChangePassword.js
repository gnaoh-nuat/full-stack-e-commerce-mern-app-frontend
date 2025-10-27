import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import SummaryApi from "../common";
import { toast } from "react-toastify"; // Import toast

const ChangePassword = () => {
  const [showCurrentPassword, setCurrentShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State để lưu dữ liệu form
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hàm xử lý khi nhập input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang

    // 1. Kiểm tra mật khẩu khớp
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu mới (ví dụ: ít nhất 8 ký tự)
    if (data.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    try {
      // 3. Gọi API
      const response = await fetch(SummaryApi.changePassword.url, {
        method: SummaryApi.changePassword.method,
        credentials: "include", // Quan trọng: để gửi cookie/token
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataApi = await response.json();

      // 4. Xử lý kết quả
      if (dataApi.success) {
        toast.success(dataApi.message || "Đổi mật khẩu thành công!");
        // Xóa sạch form
        setData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(dataApi.message || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi: " + error.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">Đổi mật khẩu</h1>

      {/* 1. Thêm thẻ <form> và onSubmit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-10"
      >
        <div className="space-y-6">
          {/* Mật khẩu hiện tại */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Mật khẩu hiện tại:</div>
            {/* 2. Thêm 'relative' để đặt icon */}
            <div className="col-span-2 relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1 pr-8" // Thêm pr-8
                name="currentPassword" // 3. Thêm name
                value={data.currentPassword} // 4. Thêm value
                onChange={handleOnChange} // 5. Thêm onChange
                required // 6. Thêm required
              />
              {/* 7. Thêm icon */}
              <span
                className="absolute right-2 top-1 cursor-pointer text-gray-500"
                onClick={() => setCurrentShowPassword((prev) => !prev)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Mật khẩu mới: </div>
            <div className="col-span-2 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nhập mật mới (ít nhất 8 ký tự)"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1 pr-8"
                name="newPassword"
                value={data.newPassword}
                onChange={handleOnChange}
                required
              />
              <span
                className="absolute right-2 top-1 cursor-pointer text-gray-500"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Xác nhận lại mật khẩu </div>
            <div className="col-span-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1 pr-8"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
              />
              <span
                className="absolute right-2 top-1 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>

        {/* button (đã nằm trong form) */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit" // 8. Thêm type="submit"
            className="bg-red-600 hover:bg-red-700 rounded-full text-white py-2 px-6"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
