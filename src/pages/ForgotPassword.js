import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { FaUserCircle } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "Đã gửi mã OTP đến email của bạn!");
        setStep(2);
      } else toast.error(data.message || "Không thể gửi OTP!");
    } catch {
      toast.error("Lỗi khi gửi yêu cầu!");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.verifyCode.url, {
        method: SummaryApi.verifyCode.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Xác thực OTP thành công!");
        setResetToken(data.resetToken);
        setStep(3);
      } else toast.error(data.message || "Mã OTP không chính xác!");
    } catch {
      toast.error("Lỗi xác thực OTP!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Mật khẩu xác nhận không trùng khớp!");
    try {
      const response = await fetch(SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/login");
      } else toast.error(data.message || "Không thể đặt lại mật khẩu!");
    } catch {
      toast.error("Lỗi khi đặt lại mật khẩu!");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-slate-200">
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center">
          <FaUserCircle className="text-6xl text-red-500 mb-2" />
          <h2 className="text-2xl font-bold text-slate-800">Quên Mật Khẩu</h2>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 && "Nhập email để nhận mã OTP xác thực."}
            {step === 2 && "Nhập mã OTP bạn đã nhận trong email."}
            {step === 3 && "Đặt lại mật khẩu mới cho tài khoản của bạn."}
          </p>
        </div>

        {/* Bước 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
            <div>
              <label className="font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.03]"
            >
              Gửi Mã OTP
            </button>
          </form>
        )}

        {/* Bước 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
            <div>
              <label className="font-medium text-slate-700">Mã OTP</label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.03]"
            >
              Xác Thực OTP
            </button>
          </form>
        )}

        {/* Bước 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
            <div>
              <label className="font-medium text-slate-700">Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.03]"
            >
              Đặt Lại Mật Khẩu
            </button>
          </form>
        )}

        {/* Link */}
        <p className="text-center text-sm mt-6 text-slate-600">
          Nhớ mật khẩu?{" "}
          <Link
            to={"/login"}
            className="text-red-600 font-semibold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
