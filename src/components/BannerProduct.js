import React, { useEffect, useRef, useState } from "react";
import image1 from "../assest/banner/img1.webp";
import image2 from "../assest/banner/img2.webp";
import image3 from "../assest/banner/img3.jpg";
import image4 from "../assest/banner/img4.jpg";
import image5 from "../assest/banner/img5.webp";

import image1Mobile from "../assest/banner/img1_mobile.jpg";
import image2Mobile from "../assest/banner/img2_mobile.webp";
import image3Mobile from "../assest/banner/img3_mobile.jpg";
import image4Mobile from "../assest/banner/img4_mobile.jpg";
import image5Mobile from "../assest/banner/img5_mobile.png";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // SỬA 1: Dùng useRef để quản lý các bộ đếm thời gian
  const intervalIdRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const desktopImages = [image1, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const stopAutoPlay = () => {
    clearInterval(intervalIdRef.current);
    clearTimeout(timeoutIdRef.current);
  };

  const startAutoPlay = () => {
    stopAutoPlay(); // Đảm bảo không có interval nào đang chạy trước khi bắt đầu
    intervalIdRef.current = setInterval(() => {
      setCurrentImage((preve) => (preve + 1) % desktopImages.length);
    }, 3000); // Giảm thời gian tự động chuyển xuống 3 giây
  };

  const handleNavigation = (newIndex) => {
    stopAutoPlay();
    setCurrentImage(newIndex);
    // Khởi động lại auto-play sau 5 giây không tương tác
    timeoutIdRef.current = setTimeout(startAutoPlay, 5000);
  };

  const nextImage = () => {
    const newIndex = (currentImage + 1) % desktopImages.length;
    handleNavigation(newIndex);
  };

  const preveImage = () => {
    const newIndex =
      (currentImage - 1 + desktopImages.length) % desktopImages.length;
    handleNavigation(newIndex);
  };

  useEffect(() => {
    startAutoPlay();
    // Dọn dẹp khi component bị hủy
    return () => stopAutoPlay();
  }, []);

  return (
    <div className="container mx-auto px-4 rounded ">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative">
        {/* Các nút điều khiển Next/Prev */}
        <div className="absolute z-10 h-full w-full md:flex items-center hidden ">
          <div className="flex justify-between w-full text-2xl px-4">
            <button
              onClick={preveImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Container cho ảnh (Desktop) */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              key={"desktop" + index}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img src={imageURl} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Container cho ảnh (Mobile) */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageURl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              key={"mobile" + index}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img src={imageURl} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* SỬA 2: Thêm các nút chỉ báo (Indicator Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {desktopImages.map((_, index) => (
            <button
              key={"indicator" + index}
              onClick={() => handleNavigation(index)}
              className={`h-3 w-3 rounded-full ${
                currentImage === index ? "bg-red-600" : "bg-slate-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
