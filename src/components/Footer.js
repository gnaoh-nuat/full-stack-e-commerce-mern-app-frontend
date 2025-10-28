// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// Import helper danh mục
import productCategory from "../helpers/productCategory";

const Footer = () => {
  // [THÊM MỚI] Tự động tạo query string cho "Tất cả danh mục"
  // 1. Lấy tất cả các 'value' (VD: ['mobiles', 'airpods', ...])
  // 2. Chuyển thành query string (VD: 'category=mobiles&category=airpods&...')
  const allCategoryQueryString = productCategory
    .map((category) => `category=${category.value}`)
    .join("&");

  // 3. Tạo đường dẫn cuối cùng
  const allCategoriesPath = `/product-category?${allCategoryQueryString}`;
  // Đường dẫn này sẽ là: /product-category?category=airpods&category=mobiles&...

  return (
    <footer className="bg-slate-800 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <h2 className="font-bold text-2xl text-white">
              <Link to={"/"}>Amit Shop</Link>
            </h2>
            <p className="text-sm">
              Cửa hàng của bạn cho mọi thiết bị điện tử. Chúng tôi cam kết mang
              đến những sản phẩm chất lượng với giá tốt nhất.
            </p>
            <div className="flex space-x-4">
              {/* ... icons mạng xã hội ... */}
            </div>
          </div>

          {/* Cột 2: Danh mục sản phẩm (Đã sửa) */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-2">Danh mục</h3>
            <ul className="space-y-2">
              {/* Lấy 5 danh mục đầu tiên */}
              {productCategory.slice(0, 5).map((category) => (
                <li key={category.value}>
                  <Link
                    to={`/product-category?category=${category.value}`}
                    className="hover:text-white hover:underline"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  // [SỬA LỖI] Sử dụng đường dẫn động đã tạo
                  to={allCategoriesPath}
                  className="hover:text-white hover:underline pt-2 font-semibold"
                >
                  Xem tất cả...
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-2">
              {/* Cập nhật link tiêu đề */}
              <Link to="/support" className="hover:text-white hover:underline">
                Hỗ trợ
              </Link>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/support/contact" // <-- Cập nhật
                  className="hover:text-white hover:underline"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  to="/support/faq" // <-- Cập nhật
                  className="hover:text-white hover:underline"
                >
                  Câu hỏi thường gặp (FAQs)
                </Link>
              </li>
              <li>
                <Link
                  to="/support/shipping-policy" // <-- Cập nhật
                  className="hover:text-white hover:underline"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/support/return-policy" // <-- Cập nhật
                  className="hover:text-white hover:underline"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/support/privacy-policy" // <-- Cập nhật
                  className="hover:text-white hover:underline"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-10">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Amit Shop. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
