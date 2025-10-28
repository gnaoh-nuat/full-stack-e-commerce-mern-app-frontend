import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const supportLinks = [
  { name: "Trung tâm hỗ trợ", path: "/support" },
  { name: "Liên hệ", path: "/support/contact" },
  { name: "Câu hỏi thường gặp (FAQs)", path: "/support/faq" },
  { name: "Chính sách vận chuyển", path: "/support/shipping-policy" },
  { name: "Chính sách đổi trả", path: "/support/return-policy" },
  { name: "Chính sách bảo mật", path: "/support/privacy-policy" },
];

const SupportLayout = () => {
  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 1. Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Hỗ trợ
            </h2>
            <nav className="flex flex-col space-y-2">
              {supportLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  // 'end' prop là cần thiết cho link cha '/support'
                  end={link.path === "/support"}
                  // Thêm class 'active' khi link được chọn
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-red-100 text-red-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* 2. Content Area */}
        <div className="md:col-span-3">
          {/* Các trang con (SupportHome, Contact, FAQ...) sẽ được render ở đây */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupportLayout;
