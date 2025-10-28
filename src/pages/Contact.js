import React from "react";

const Contact = () => {
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Liên hệ</h1>
        <p className="text-slate-600 mb-6">
          Chúng tôi luôn sẵn sàng lắng nghe bạn. Vui lòng liên hệ với chúng tôi
          qua các kênh dưới đây hoặc điền vào biểu mẫu:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3 text-slate-700">
            <h2 className="text-xl font-semibold">Thông tin liên lạc</h2>
            <p>
              <strong>Email:</strong> support@amit.com
            </p>
            <p>
              <strong>Hotline:</strong> 1900 1234
            </p>
            <p>
              <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
            </p>
            <p>
              <strong>Giờ làm việc:</strong> 8:00 - 21:00 (Thứ 2 - Chủ Nhật)
            </p>
          </div>
          <div className="space-y-3 text-slate-700">
            <h2 className="text-xl font-semibold">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Tên của bạn
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Nội dung
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
