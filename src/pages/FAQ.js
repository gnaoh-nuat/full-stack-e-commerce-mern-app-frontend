import React from "react";

const FAQItem = ({ question, answer }) => (
  <details className="border-b border-slate-200 py-4">
    <summary className="font-semibold text-lg text-slate-800 cursor-pointer hover:text-red-600 transition-colors">
      {question}
    </summary>
    <p className="text-slate-600 mt-2 pl-4">{answer}</p>
  </details>
);

const FAQ = () => {
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Câu hỏi thường gặp (FAQs)
        </h1>
        <div className="space-y-4">
          <FAQItem
            question="Làm thế nào để đặt hàng?"
            answer="Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và điền thông tin thanh toán. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức."
          />
          <FAQItem
            question="Chính sách vận chuyển như thế nào?"
            answer="Chúng tôi miễn phí vận chuyển cho tất cả đơn hàng trên 500.000 VNĐ. Thời gian giao hàng dự kiến từ 2-5 ngày làm việc."
          />
          <FAQItem
            question="Tôi có thể đổi trả sản phẩm không?"
            answer="Có, chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác và chưa qua sử dụng. Vui lòng xem chi tiết tại trang Chính sách đổi trả."
          />
          <FAQItem
            question="Sản phẩm được bảo hành bao lâu?"
            answer="Tất cả sản phẩm điện tử đều được bảo hành chính hãng 12 tháng. Thông tin chi tiết bảo hành được đính kèm theo sản phẩm."
          />
          {/* ... Thêm các câu hỏi khác tại đây ... */}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
