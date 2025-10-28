import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Chính sách bảo mật
        </h1>
        <div className="space-y-4 text-slate-600 prose">
          <p>
            Amit Shop coi trọng việc bảo vệ thông tin cá nhân của bạn. Chính
            sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin
            của bạn khi bạn truy cập website của chúng tôi.
          </p>

          <h2 className="text-xl font-semibold text-slate-700">
            1. Thông tin chúng tôi thu thập
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Thông tin cá nhân:</strong> Tên, địa chỉ email, số điện
              thoại, và địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc đặt
              hàng.
            </li>
            <li>
              <strong>Thông tin phi cá nhân:</strong> Dữ liệu về trình duyệt,
              địa chỉ IP, các trang bạn xem để cải thiện trải nghiệm người dùng.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-700">
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <ul className="list-disc list-inside">
            <li>Xử lý đơn hàng, thanh toán và giao hàng.</li>
            <li>Cung cấp dịch vụ hỗ trợ khách hàng.</li>
            <li>
              Gửi các thông báo về khuyến mãi, cập nhật (nếu bạn đồng ý nhận
              email).
            </li>
            <li>Cải thiện chất lượng dịch vụ và giao diện website.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-700">
            3. Bảo mật thông tin
          </h2>
          <p>
            Chúng tôi cam kết không chia sẻ, bán hoặc tiết lộ thông tin cá nhân
            của bạn cho bất kỳ bên thứ ba nào khác, ngoại trừ các trường hợp cần
            thiết để hoàn thành đơn hàng (ví dụ: cung cấp cho đơn vị vận chuyển)
            hoặc khi có yêu cầu của pháp luật.
          </p>
          <h2 className="text-xl font-semibold text-slate-700">
            4. Sử dụng Cookies
          </h2>
          <p>
            Website của chúng tôi sử dụng cookies để lưu trữ thông tin về giỏ
            hàng và giúp cá nhân hóa trải nghiệm của bạn. Bạn có thể tắt cookies
            trong trình duyệt của mình, nhưng một số tính năng của website có
            thể không hoạt động.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
