import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
// [THÊM MỚI] Icon cho trạng thái rỗng
import { FaUsersSlash } from "react-icons/fa6";

// ===================================================================
// === [MỚI] COMPONENT SKELETON (KHUNG XƯƠNG) ===
// ===================================================================

// Skeleton cho giao diện Bảng (Desktop)
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-4">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-4 bg-slate-200 rounded w-full"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
    </td>
  </tr>
);

// Skeleton cho giao diện Thẻ (Mobile)
const SkeletonCard = () => (
  <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm animate-pulse">
    <div className="flex justify-between items-start">
      <div>
        <div className="h-5 bg-slate-200 rounded-full w-32 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-full w-48"></div>
      </div>
      <div className="h-8 w-8 bg-slate-200 rounded-full flex-shrink-0"></div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      <div className="h-4 bg-slate-200 rounded-full w-24"></div>
    </div>
  </div>
);

// ===================================================================
// === COMPONENT CHÍNH: ALL USERS ===
// ===================================================================
const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });
  // [THÊM MỚI] State cho loading, mặc định là true
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    setLoading(true); // Bắt đầu loading
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();
    setLoading(false); // Dừng loading

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // [MỚI] Hàm helper để xử lý click
  const handleOpenModal = (user) => {
    setUpdateUserDetails(user);
    setOpenUpdateRole(true);
  };

  return (
    // [THAY ĐỔI] Thêm header và wrapper
    <div className="flex flex-col gap-6">
      {/* === 1. HEADER === */}
      <div className="bg-white py-4 px-6 rounded-lg shadow-sm">
        <h2 className="font-bold text-xl text-slate-800">Quản lý người dùng</h2>
      </div>

      {/* === 2. NỘI DUNG CHÍNH (Bảng hoặc Thẻ) === */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* --- TRẠNG THÁI LOADING --- */}
        {loading && (
          <div>
            {/* Skeleton Desktop: Ẩn trên mobile */}
            <table className="w-full min-w-[700px] hidden md:table border-collapse">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Sr.
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Role
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Created Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
              </tbody>
            </table>
            {/* Skeleton Mobile: Ẩn trên desktop */}
            <div className="md:hidden flex flex-col gap-4 p-4">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          </div>
        )}

        {/* --- TRẠNG THÁI KHÔNG CÓ USER --- */}
        {!loading && allUser.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-12">
            <FaUsersSlash className="w-16 h-16 text-slate-400" />
            <h3 className="text-2xl font-semibold text-slate-800 mt-4">
              Không tìm thấy người dùng
            </h3>
            <p className="text-slate-500 mt-2">
              Hệ thống chưa có người dùng nào đăng ký.
            </p>
          </div>
        )}

        {/* --- TRẠNG THÁI CÓ USER --- */}
        {!loading && allUser.length > 0 && (
          // [THAY ĐỔI] Thêm overflow-x-auto để bảng cuộn ngang nếu
          // màn hình quá hẹp, thay vì làm vỡ layout
          <div className="overflow-x-auto">
            {/* === BẢNG CHO DESKTOP === */}
            {/* `hidden md:table` -> Ẩn trên mobile, hiện trên desktop */}
            <table className="w-full min-w-[700px] hidden md:table border-collapse">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Sr.
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Role
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Created Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((el, index) => (
                  <tr
                    key={el._id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="py-4 px-4 text-sm text-slate-700">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                      {el?.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-700">
                      {el?.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-700">
                      {/* [THAY ĐỔI] Dùng tag (nhãn) cho Role */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          el?.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {el?.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-700">
                      {moment(el?.createdAt).format("LL")}
                    </td>
                    <td className="py-4 px-4">
                      {/* [THAY ĐỔI] Styling lại nút Edit */}
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
                        onClick={() => handleOpenModal(el)}
                      >
                        <MdModeEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* === DANH SÁCH THẺ CHO MOBILE === */}
            {/* `md:hidden` -> Hiện trên mobile, ẩn trên desktop */}
            <div className="md:hidden flex flex-col gap-4 p-4">
              {allUser.map((el, index) => (
                <div
                  key={el._id}
                  className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                >
                  {/* Hàng trên: Tên, Email, Nút Edit */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-base text-slate-800">
                        {el?.name}
                      </p>
                      <p className="text-sm text-slate-500">{el?.email}</p>
                    </div>
                    <button
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
                      onClick={() => handleOpenModal(el)}
                    >
                      <MdModeEdit />
                    </button>
                  </div>
                  {/* Hàng dưới: Role, Ngày tạo */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        el?.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {el?.role}
                    </span>
                    <p className="text-sm text-slate-500">
                      {moment(el?.createdAt).format("LL")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === 3. MODAL (Giữ nguyên) === */}
      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
