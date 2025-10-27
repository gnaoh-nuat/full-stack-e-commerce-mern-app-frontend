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
import VnpayReturn from "../pages/VnpayReturn";
import OrderDetails from "../pages/OrderDetails";
import AllOrders from "../pages/AllOrders";

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
        path: "order/vnpay_return", // Trang VNPAY callback
        element: <VnpayReturn />,
      },
      {
        path: "order/:id", // Trang chi tiết đơn hàng
        element: <OrderDetails />,
      },
    ],
  },
]);

export default router;
