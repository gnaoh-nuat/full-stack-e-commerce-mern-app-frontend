import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Chính sách đổi trả
        </h1>
        <div className="space-y-4 text-slate-600 prose">
          <p>
            Chúng tôi cam kết mang đến sự hài lòng tối đa cho khách hàng. Nếu
            bạn không hài lòng với sản phẩm, bạn có thể yêu cầu đổi trả trong
            vòng 7 ngày kể từ ngày nhận hàng.
          </p>

          <h2 className="text-xl font-semibold text-slate-700">
            1. Điều kiện đổi trả
          </h2>
          <ul className="list-disc list-inside">
            <li>Sản phẩm còn nguyên tem, mác, và chưa qua sử dụng.</li>
            <li>
              Sản phẩm còn đầy đủ phụ kiện, quà tặng (nếu có) và hóa đơn mua
              hàng.
            </li>
            <li>Sản phẩm bị lỗi do nhà sản xuất (lỗi kỹ thuật, hỏng hóc).</li>
            <li>Sản phẩm giao không đúng mẫu mã, chủng loại bạn đã đặt.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-700">
            2. Các trường hợp không áp dụng đổi trả
          </h2>
          <ul className="list-disc list-inside">
            <li>Sản phẩm đã qua sử dụng.</li>
            <li>
              Sản phẩm bị hỏng hóc do lỗi người dùng (va đập, vào nước...).
            </li>
            <li>Quá 7 ngày kể từ khi nhận hàng.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-700">
            3. Quy trình đổi trả
          </h2>
          <ol className="list-decimal list-inside">
            <li>
              Liên hệ hotline <strong>1900 1234</strong> hoặc email{" "}
              <strong>support@amit.com</strong> để thông báo về yêu cầu đổi trả.
            </li>
            <li>Đóng gói sản phẩm cẩn thận và gửi về địa chỉ của Amit Shop.</li>
            <li>
              Sau khi nhận và kiểm tra, chúng tôi sẽ tiến hành đổi sản phẩm mới
              hoặc hoàn tiền cho bạn trong vòng 3-5 ngày làm việc.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
