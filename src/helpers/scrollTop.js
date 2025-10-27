// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Lấy ra `pathname` (ví dụ: "/contact", "/search") từ URL
  const { pathname } = useLocation();

  // Sử dụng useEffect để thực hiện một hành động mỗi khi `pathname` thay đổi
  useEffect(() => {
    // Cuộn cửa sổ trình duyệt về vị trí (0, 0) ngay lập tức
    // Dùng (0, 0) sẽ tốt hơn 'smooth' vì nó tức thì,
    // người dùng không thấy trang bị cuộn.
    window.scrollTo(0, 0);
  }, [pathname]); // <-- Dependency array: Chạy lại effect này khi pathname thay đổi

  // Component này không render ra bất cứ thứ gì
  return null;
};

export default ScrollToTop;
