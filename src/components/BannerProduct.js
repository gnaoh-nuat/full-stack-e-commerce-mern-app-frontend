import React, { useEffect, useRef, useState } from "react";
import image1 from "../assest/banner/banner-pc-1.jpg";
import image2 from "../assest/banner/banner-pc-2.jpg";
import image3 from "../assest/banner/banner-pc-3.jpg";
import image4 from "../assest/banner/banner-pc-4.jpg";
import image5 from "../assest/banner/banner-pc-5.jpg";

import image1Mobile from "../assest/banner/img1_mobile.jpg";
import image2Mobile from "../assest/banner/img2_mobile.webp";
import image3Mobile from "../assest/banner/img3_mobile.jpg";
import image4Mobile from "../assest/banner/img4_mobile.jpg";
import image5Mobile from "../assest/banner/img5_mobile.png";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);
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

  // Dừng tự động chạy
  const stopAutoPlay = () => {
    clearInterval(intervalIdRef.current);
    clearTimeout(timeoutIdRef.current);
  };

  // Bắt đầu tự động chạy
  const startAutoPlay = () => {
    stopAutoPlay();
    intervalIdRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % desktopImages.length);
    }, 3000);
  };

  // Điều hướng thủ công
  const handleNavigation = (newIndex) => {
    stopAutoPlay();
    setCurrentImage(newIndex);
    timeoutIdRef.current = setTimeout(startAutoPlay, 5000);
  };

  const nextImage = () => {
    const newIndex = (currentImage + 1) % desktopImages.length;
    handleNavigation(newIndex);
  };

  const prevImage = () => {
    const newIndex =
      (currentImage - 1 + desktopImages.length) % desktopImages.length;
    handleNavigation(newIndex);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* ✅ Chiều cao banner responsive */}
      <div className="h-[220px] sm:h-[280px] md:h-[360px] lg:h-[440px] w-full bg-slate-200 relative rounded-lg overflow-hidden">
        {/* === Nút điều hướng (desktop) === */}
        <div className="absolute z-10 h-full w-full md:flex items-center hidden">
          <div className="flex justify-between w-full text-2xl px-6">
            <button
              onClick={prevImage}
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 text-slate-700 hover:bg-white transition-colors"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 text-slate-700 hover:bg-white transition-colors"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* === Banner Desktop === */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageUrl, index) => (
            <div
              key={"desktop" + index}
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageUrl}
                alt={`Banner ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-left"
              />
            </div>
          ))}
        </div>

        {/* === Banner Mobile === */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageUrl, index) => (
            <div
              key={"mobile" + index}
              className="w-full h-full min-w-full min-h-full transition-all duration-500"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageUrl}
                alt={`Mobile Banner ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* === Indicator (Dấu chấm chuyển slide) === */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {desktopImages.map((_, index) => (
            <button
              key={"indicator" + index}
              onClick={() => handleNavigation(index)}
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
