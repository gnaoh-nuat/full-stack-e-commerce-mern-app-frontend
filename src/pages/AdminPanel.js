import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// [SỬA LỖI] Thay đổi import từ 'fa' thành 'fa6'
import { FaRegCircleUser, FaUsers, FaBox } from "react-icons/fa6";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  /**
   * Hàm tạo class cho NavLink trên DESKTOP
   */
  const getDesktopNavLinkClass = ({ isActive }) => {
    return `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive
        ? "bg-red-100 text-red-600 font-medium" // Lớp CSS khi active
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // Lớp CSS khi bình thường
    }`;
  };

  /**
   * Hàm tạo class cho NavLink trên MOBILE
   */
  const getMobileNavLinkClass = ({ isActive }) => {
    return `flex-1 text-center px-4 py-3 font-medium transition-all ${
      isActive
        ? "text-red-600 border-b-2 border-red-600" // Active: Có gạch chân đỏ
        : "text-slate-500 hover:text-slate-800"
    }`;
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">
      {/* === 1. SIDEBAR (Chỉ cho Desktop) === */}
      <aside className="bg-white min-h-full w-60 flex-shrink-0 shadow-lg hidden md:block">
        {/* Thông tin Admin */}
        <div className="p-6 flex flex-col items-center gap-2 border-b border-slate-200">
          <div className="w-16 h-16 rounded-full flex items-center justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-full h-full rounded-full object-cover"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser className="text-5xl text-slate-400" />
            )}
          </div>
          <p className="capitalize text-lg font-semibold text-slate-800">
            {user?.name}
          </p>
          <p className="text-sm text-slate-500">{user?.role}</p>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="flex flex-col gap-1 p-4">
          <NavLink to={"all-users"} className={getDesktopNavLinkClass}>
            <FaUsers />
            All Users
          </NavLink>
          <NavLink to={"all-products"} className={getDesktopNavLinkClass}>
            <FaBox />
            All Products
          </NavLink>
        </nav>
      </aside>

      {/* === 2. NAVIGATION (Chỉ cho Mobile) === */}
      <nav className="md:hidden flex items-center border-b bg-white shadow-sm">
        <NavLink to={"all-users"} className={getMobileNavLinkClass}>
          All Users
        </NavLink>
        <NavLink to={"all-products"} className={getMobileNavLinkClass}>
          All Products
        </NavLink>
      </nav>

      {/* === 3. NỘI DUNG CHÍNH === */}
      <main className="flex-grow h-full p-4 md:p-6 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
