import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
// Loại bỏ import VerticalCardProduct vì không dùng nữa
// import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      {/* Các sản phẩm hiển thị theo chiều ngang (HorizontalCardProduct) */}
      <HorizontalCardProduct category={"AirPods"} heading={"Top's AirPods"} />
      <HorizontalCardProduct
        category={"Watches"}
        heading={"Popular's Watches"}
      />

      {/* Các danh mục trước đây dùng VerticalCardProduct, nay chuyển sang HorizontalCardProduct */}
      <HorizontalCardProduct category={"Mobiles"} heading={"Mobiles"} />
      <HorizontalCardProduct category={"Mouse"} heading={"Mouse"} />
      <HorizontalCardProduct category={"Televisions"} heading={"Televisions"} />
      <HorizontalCardProduct
        category={"Camera"}
        heading={"Camera & Photography"}
      />
      <HorizontalCardProduct
        category={"Earphones"}
        heading={"Wired Earphones"}
      />
      <HorizontalCardProduct
        category={"Speakers"}
        heading={"Bluetooth Speakers"}
      />
      <HorizontalCardProduct
        category={"Refrigerator"}
        heading={"Refrigerator"}
      />
      <HorizontalCardProduct category={"Trimmers"} heading={"Trimmers"} />
      <HorizontalCardProduct category={"Printer"} heading={"Printer"} />
    </div>
  );
};

export default Home;
