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

  // Logic (useRef, start/stopAutoPlay, handleNavigation) giữ nguyên
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
    stopAutoPlay();
    intervalIdRef.current = setInterval(() => {
      setCurrentImage((preve) => (preve + 1) % desktopImages.length);
    }, 3000);
  };

  const handleNavigation = (newIndex) => {
    stopAutoPlay();
    setCurrentImage(newIndex);
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
    return () => stopAutoPlay();
  }, []);

  return (
    // [CẬP NHẬT] Bỏ `rounded` ở đây
    <div className="container mx-auto px-4">
      {/* [CẬP NHẬT] 
          - Thêm `rounded-lg` và `overflow-hidden` để bo góc banner.
          - `bg-slate-200` vẫn giữ làm màu nền chờ tải.
      */}
      <div className="h-56 md:h-72 w-full bg-slate-200 relative rounded-lg overflow-hidden">
        {/* [CẬP NHẬT] Các nút điều khiển Next/Prev */}
        <div className="absolute z-10 h-full w-full md:flex items-center hidden ">
          {/* [CẬP NHẬT] Tăng `px-4` -> `px-6` để lùi nút vào trong */}
          <div className="flex justify-between w-full text-2xl px-6">
            <button
              onClick={preveImage}
              // [CẬP NHẬT] Thêm `p-2`, `bg-white/80`, `backdrop-blur-sm`
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 text-slate-700 hover:bg-white transition-colors"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              // [CẬP NHẬT] Thêm `p-2`, `bg-white/80`, `backdrop-blur-sm`
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 text-slate-700 hover:bg-white transition-colors"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Container cho ảnh (Desktop) - Giữ nguyên */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              key={"desktop" + index}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageURl}
                className="w-full h-full object-cover"
                alt={`Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Container cho ảnh (Mobile) - Giữ nguyên */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageURl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              key={"mobile" + index}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageURl}
                className="w-full h-full object-cover"
                alt={`Mobile Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* [CẬP NHẬT] Các nút chỉ báo (Indicator Dots/Pills) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {desktopImages.map((_, index) => (
            <button
              key={"indicator" + index}
              onClick={() => handleNavigation(index)}
              // [CẬP NHẬT] Thay đổi style:
              // - h-3/w-3 -> h-2.5
              // - active: w-6 (dài ra)
              // - inactive: w-2.5 (chấm tròn), bg-white/70 (trắng mờ)
              className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                currentImage === index
                  ? "w-6 bg-red-600"
                  : "w-2.5 bg-white/70 backdrop-blur-sm"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
