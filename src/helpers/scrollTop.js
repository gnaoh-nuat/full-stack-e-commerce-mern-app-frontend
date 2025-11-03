// src/helpers/scrollTop.js (hoặc nơi bạn lưu file)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Lấy ra `key` thay vì `pathname`
  // `key` là một giá trị duy nhất được tạo ra cho MỖI LẦN điều hướng.
  const { key } = useLocation();

  useEffect(() => {
    // Cuộn cửa sổ trình duyệt về vị trí (0, 0)
    window.scrollTo(0, 0);
  }, [key]); // <-- Thay đổi dependency thành [key]

  // Component này không render ra bất cứ thứ gì
  return null;
};

export default ScrollToTop;
