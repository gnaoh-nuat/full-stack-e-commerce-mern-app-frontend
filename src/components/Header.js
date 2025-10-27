//import thư viện
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

//import components
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

// ==============================
// 🧩 COMPONENT HEADER CHÍNH
// ==============================
const Header = () => {
  // ======= STATE & HOOKS =======
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Ref cho menu dropdown

  const searchLocation = useLocation();
  const queryParam = new URLSearchParams(searchLocation?.search).get("q") || "";
  const [search, setSearch] = useState(queryParam);

  // ==============================
  // 💡 HOOK ĐÓNG MENU KHI CLICK BÊN NGOÀI
  // ==============================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
    };

    if (menuDisplay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuDisplay]);

  // ==============================
  // 🔍 HÀM XỬ LÝ TÌM KIẾM
  // ==============================
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  // ==============================
  // 🚪 HÀM ĐĂNG XUẤT NGƯỜI DÙNG
  // ==============================
  const handleLogout = async () => {
    try {
      const res = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      } else if (data.error) {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Có lỗi xảy ra khi đăng xuất.");
    }
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* ==== LOGO TRANG CHỦ ==== */}
        <Link to="/">
          <Logo w={90} h={50} />
        </Link>

        {/* ==== [CẬP NHẬT] THANH TÌM KIẾM ==== */}
        <div className="hidden lg:flex items-center w-full max-w-sm border border-slate-300 rounded-full focus-within:shadow-md transition-shadow">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full outline-none pl-4 py-2 bg-transparent rounded-l-full"
            value={search}
            onChange={handleSearch}
          />
          <div className="text-lg min-w-[50px] h-10 bg-red-600 text-white flex items-center justify-center rounded-r-full cursor-pointer hover:bg-red-700 transition-colors">
            <GrSearch />
          </div>
        </div>

        {/* ==== [CẬP NHẬT] NHÓM CHỨC NĂNG BÊN PHẢI ==== */}
        <div className="flex items-center gap-4">
          {" "}
          {/* Giảm gap từ 7 xuống 4 */}
          {/* --- [CẬP NHẬT] ICON USER / MENU --- */}
          {user?._id && (
            <div className="relative flex justify-center" ref={menuRef}>
              {/* [CẬP NHẬT] Thêm wrapper cho icon/avatar để có hover effect */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover" // Thêm object-cover
                  />
                ) : (
                  <FaRegCircleUser className="text-slate-600" />
                )}
              </div>

              {/* [CẬP NHẬT] Menu thả xuống */}
              {menuDisplay && (
                <div className="absolute bg-white top-14 right-0 shadow-lg rounded-lg min-w-[220px] border border-slate-100">
                  {/* Thêm thông tin user */}
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="font-semibold text-slate-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Các link điều hướng */}
                  <nav className="p-2">
                    <Link
                      to="/profile"
                      className="whitespace-nowrap hover:bg-slate-100 p-2 block rounded-md"
                      onClick={() => setMenuDisplay(false)}
                    >
                      Thông tin tài khoản
                    </Link>

                    <Link
                      to="my-orders"
                      className="whitespace-nowrap hover:bg-slate-100 p-2 block rounded-md"
                      onClick={() => setMenuDisplay(false)}
                    >
                      Đơn hàng của tôi
                    </Link>

                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to="/admin-panel/all-users"
                        className="whitespace-nowrap hover:bg-slate-100 p-2 block rounded-md"
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </div>
          )}
          {/* --- [CẬP NHẬT] ICON GIỎ HÀNG --- */}
          {user?._id && (
            <Link
              to="/cart"
              className="relative text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <span className="text-slate-600">
                <FaShoppingCart />
              </span>
              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount || 0}</p>
              </div>
            </Link>
          )}
          {/* --- [CẬP NHẬT] NÚT LOGIN / LOGOUT --- */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
