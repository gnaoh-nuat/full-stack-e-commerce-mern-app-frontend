import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="mx-auto container p-4">
      <div className="flex gap-4 w-full">
        {/* sidebar */}
        <div className="w-1/4 flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
          <div className="flex flex-col space-y-2">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `text-lg ${isActive ? "font-bold text-black" : "text-gray-500"}`
              }
            >
              Thông tin cá nhân
            </NavLink>
            <NavLink
              to="change-password"
              className={({ isActive }) =>
                `text-lg ${isActive ? "font-bold text-black" : "text-gray-500"}`
              }
            >
              Đổi mật khẩu
            </NavLink>
            <NavLink
              to="address"
              className={({ isActive }) =>
                `text-lg ${isActive ? "font-bold text-black" : "text-gray-500"}`
              }
            >
              Địa chỉ
            </NavLink>
          </div>
        </div>

        {/* hồ sơ cá nhân */}
        <div className="w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
