import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import ChangePassword from "../pages/ChangePassword";
import PersonalInfo from "../pages/PersonalInfo";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import OrderSuccess from "../pages/OrderSuccess";
import OrderDetails from "../pages/OrderDetails";
import AllOrders from "../pages/AllOrders";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import ReturnPolicy from "../pages/ReturnPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ShippingPolicy from "../pages/ShippingPolicy";
import SupportHome from "../pages/SupportHome";
import SupportLayout from "../pages/SupportLayout";
import PaymentVNPAY from "../components/PaymentVNPAY";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "payment-vnpay",
        element: <PaymentVNPAY />,
      },
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: "",
            element: <PersonalInfo />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          {
            path: "all-orders",
            element: <AllOrders />,
          },
        ],
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "order/:id", // Trang chi tiết đơn hàng
        element: <OrderDetails />,
      },
      {
        path: "support",
        element: <SupportLayout />, // Dùng layout cha
        children: [
          {
            path: "", // Đường dẫn mặc định: /support
            element: <SupportHome />, // Trang menu chính
          },
          {
            path: "contact", // Đường dẫn: /support/contact
            element: <Contact />,
          },
          {
            path: "faq", // Đường dẫn: /support/faq
            element: <FAQ />,
          },
          {
            path: "shipping-policy", // Đường dẫn: /support/shipping-policy
            element: <ShippingPolicy />,
          },
          {
            path: "return-policy", // Đường dẫn: /support/return-policy
            element: <ReturnPolicy />,
          },
          {
            path: "privacy-policy", // Đường dẫn: /support/privacy-policy
            element: <PrivacyPolicy />,
          },
        ],
      },
    ],
  },
]);

export default router;
