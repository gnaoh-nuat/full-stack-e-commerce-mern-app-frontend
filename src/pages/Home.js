import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"AirPods"} heading={"Top's AirPods"} />
      <HorizontalCardProduct
        category={"Watches"}
        heading={"Popular's Watches"}
      />

      <VerticalCardProduct category={"Mobiles"} heading={"Mobiles"} />
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"} />
      <VerticalCardProduct category={"Televisions"} heading={"Televisions"} />
      <VerticalCardProduct
        category={"Camera"}
        heading={"Camera & Photography"}
      />
      <VerticalCardProduct category={"Earphones"} heading={"Wired Earphones"} />
      <VerticalCardProduct
        category={"Speakers"}
        heading={"Bluetooth Speakers"}
      />
      <VerticalCardProduct category={"Refrigerator"} heading={"Refrigerator"} />
      <VerticalCardProduct category={"Trimmers"} heading={"Trimmers"} />
      <VerticalCardProduct category={"Printer"} heading={"Printer"} />
    </div>
  );
};

export default Home;
