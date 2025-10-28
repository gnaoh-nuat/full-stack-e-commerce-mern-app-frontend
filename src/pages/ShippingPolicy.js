import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Chính sách vận chuyển
        </h1>
        <div className="space-y-4 text-slate-600 prose">
          <h2 className="text-xl font-semibold text-slate-700">
            1. Phí vận chuyển
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Miễn phí vận chuyển:</strong> Áp dụng cho tất cả đơn hàng
              có giá trị từ 500.000 VNĐ trở lên.
            </li>
            <li>
              <strong>Phí vận chuyển tiêu chuẩn:</strong> 30.000 VNĐ cho các đơn
              hàng dưới 500.000 VNĐ.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-700">
            2. Thời gian giao hàng
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Nội thành (TP.HCM, Hà Nội):</strong> 1-2 ngày làm việc.
            </li>
            <li>
              <strong>Ngoại thành và các tỉnh khác:</strong> 3-5 ngày làm việc.
            </li>
          </ul>
          <p>
            Lưu ý: Thời gian giao hàng có thể kéo dài hơn dự kiến do các điều
            kiện bất khả kháng (thời tiết, lễ tết...).
          </p>

          <h2 className="text-xl font-semibold text-slate-700">
            3. Kiểm tra đơn hàng
          </h2>
          <p>
            Bạn có thể theo dõi tình trạng đơn hàng của mình thông qua email xác
            nhận hoặc trong mục "Đơn hàng của tôi" sau khi đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
