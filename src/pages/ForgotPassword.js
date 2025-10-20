import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common"; // Đảm bảo đường dẫn này chính xác
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginIcons from "../assest/signin.gif"; // Đảm bảo đường dẫn này chính xác

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // THAY ĐỔI 1: Thêm state mới để lưu resetToken từ backend
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // BƯỚC 1: Gửi yêu cầu lấy OTP qua email (Không thay đổi)
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
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // BƯỚC 2: Xác thực OTP và nhận về resetToken
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

        // THAY ĐỔI 2: Lấy resetToken từ response và lưu vào state
        setResetToken(data.resetToken); // Giả sử backend trả token qua key 'resetToken'

        setStep(3); // Chuyển sang bước 3
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi xác thực OTP.");
    }
  };

  // BƯỚC 3: Đặt lại mật khẩu mới bằng resetToken
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch(SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          // THAY ĐỔI 3: Gửi 'resetToken' đã lưu thay vì 'otp'
          resetToken: resetToken,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi đặt lại mật khẩu.");
    }
  };

  return (
    <section id="forgot-password">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="forgot password icon" />
          </div>
          <h2 className="text-center text-2xl font-bold pt-3">Quên Mật Khẩu</h2>

          {/* Form cho Bước 1: Nhập Email */}
          {step === 1 && (
            <form className="pt-6 flex flex-col gap-2" onSubmit={handleSendOtp}>
              <div className="grid">
                <label>Email : </label>
                <div className="bg-slate-100 p-2 rounded">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
              >
                Gửi OTP
              </button>
            </form>
          )}

          {/* Form cho Bước 2: Nhập OTP */}
          {step === 2 && (
            <form
              className="pt-6 flex flex-col gap-3"
              onSubmit={handleVerifyCode}
            >
              <div className="grid">
                <label>Mã OTP :</label>
                <div className="bg-slate-100 p-2 rounded">
                  <input
                    type="text"
                    placeholder="Nhập mã OTP đã nhận"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
              >
                Xác Thực
              </button>
            </form>
          )}

          {/* Form cho Bước 3: Nhập Mật Khẩu Mới */}
          {step === 3 && (
            <form
              className="pt-6 flex flex-col gap-3"
              onSubmit={handleResetPassword}
            >
              <div className="grid">
                <label>Mật khẩu mới :</label>
                <div className="bg-slate-100 p-2 flex rounded">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    <span>{showNewPassword ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                </div>
              </div>
              <div className="grid">
                <label>Xác nhận mật khẩu mới :</label>
                <div className="bg-slate-100 p-2 flex rounded">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <span>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
              >
                Đặt Lại Mật Khẩu
              </button>
            </form>
          )}

          <p className="my-5 text-center">
            Nhớ mật khẩu?{" "}
            <Link
              to={"/login"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
