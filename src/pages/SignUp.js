import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import imageTobase64 from "../helpers/imageTobase64";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((prev) => ({ ...prev, profilePic: imagePic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message || "Đăng ký thành công!");
        navigate("/login");
      } else if (dataApi.error) {
        toast.error(dataApi.message || "Đăng ký thất bại. Vui lòng thử lại!");
      }
    } else {
      toast.error("Mật khẩu xác nhận không khớp!");
    }
  };

  return (
    <section
      id="signup"
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        {/* Ảnh đại diện */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-100 shadow-inner">
            <img
              src={
                data.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Ảnh đại diện"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-1 text-xs bg-slate-100 bg-opacity-80 hover:bg-slate-200 px-3 py-1 rounded-md cursor-pointer text-slate-700">
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadPic}
            />
          </label>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-slate-700">
          Tạo tài khoản mới
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Điền thông tin bên dưới để đăng ký
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-slate-600 text-sm font-medium">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
              placeholder="Nhập họ và tên"
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            />
          </div>

          <div>
            <label className="text-slate-600 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              placeholder="Nhập email của bạn"
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            />
          </div>

          <div>
            <label className="text-slate-600 text-sm font-medium">
              Mật khẩu
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                placeholder="Nhập mật khẩu"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition pr-10"
              />
              <div
                className="absolute right-3 top-2.5 text-lg text-slate-500 cursor-pointer hover:text-red-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-600 text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition pr-10"
              />
              <div
                className="absolute right-3 top-2.5 text-lg text-slate-500 cursor-pointer hover:text-red-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition-transform transform hover:scale-[1.03] mt-4"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-700 hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
