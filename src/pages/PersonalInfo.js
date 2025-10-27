import React, { useEffect, useState, useCallback } from "react";
import SummaryApi from "../common";
import { FaUser, FaPen } from "react-icons/fa";
import { toast } from "react-toastify"; // (Giả sử bạn đã cài)

// === BƯỚC 1: IMPORT ===
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice"; // (Kiểm tra lại đường dẫn)

const PersonalInfo = () => {
  // === BƯỚC 2: KHỞI TẠO DISPATCH ===
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    profilePic: "",
  });

  const [originalUserData, setOriginalUserData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  //Hàm xử lý khi người dùng thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // hàm định dạng ngày tháng
  const formatDateForInput = (dateString) => {
    if (!dateString) {
      return "";
    }
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return "";
    }
  };

  // Hàm này chỉ xử lý chọn file
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file); // Lưu file vào state

      // Tạo URL tạm thời để xem trước ảnh
      const previewUrl = URL.createObjectURL(file);
      setUserData((prevData) => ({
        ...prevData,
        profilePic: previewUrl,
      }));
    }
  };

  // === BƯỚC 3: SỬA HÀM FETCHUSERDETAIL ===
  const fetchUserDetail = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataApi = await response.json();
      if (dataApi.success) {
        // GỬI DỮ LIỆU LÊN REDUX
        dispatch(setUserDetails(dataApi.data));

        // Cập nhật state nội bộ
        const formattedData = {
          ...dataApi.data,
          dateOfBirth: formatDateForInput(dataApi.data.dateOfBirth),
        };
        setUserData(formattedData);
        setOriginalUserData(formattedData);
        setIsDirty(false);
        setNewAvatarFile(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }, [dispatch]); // <-- Thêm 'dispatch' vào dependency array

  // Effect để lấy dữ liệu người dùng ban đầu
  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  // Effect để kiểm tra thay đổi
  useEffect(() => {
    if (originalUserData) {
      const avatarChanged = newAvatarFile !== null;
      const textChanged =
        originalUserData.name !== userData.name ||
        originalUserData.email !== userData.email ||
        originalUserData.gender !== userData.gender ||
        originalUserData.dateOfBirth !== userData.dateOfBirth;
      setIsDirty(avatarChanged || textChanged);
    }
  }, [userData, originalUserData, newAvatarFile]);

  // Hàm xử lý submit
  const handleSubmit = async () => {
    setLoading(true);
    toast.info("Đang cập nhật...");

    try {
      const avatarChanged = newAvatarFile !== null;
      const textChanged =
        originalUserData.name !== userData.name ||
        originalUserData.email !== userData.email ||
        originalUserData.gender !== userData.gender ||
        originalUserData.dateOfBirth !== userData.dateOfBirth;

      let avatarSuccess = true;
      let textSuccess = true;

      // --- Tác vụ 1: Upload Avatar (nếu có) ---
      if (avatarChanged) {
        const formData = new FormData();
        // Tên 'files' phải khớp với backend Multer của bạn
        formData.append("files", newAvatarFile);

        const response = await fetch(SummaryApi.uploadAvatar.url, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const dataApi = await response.json();
        avatarSuccess = dataApi.success;
        if (!avatarSuccess) {
          throw new Error(dataApi.message || "Lỗi khi tải lên avatar");
        }
      }

      // --- Tác vụ 2: Cập nhật thông tin (nếu có) ---
      if (textChanged) {
        const response = await fetch(SummaryApi.updateUser.url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData._id,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
          }),
        });
        const dataApi = await response.json();
        textSuccess = dataApi.success;
        if (!textSuccess) {
          throw new Error(dataApi.message || "Lỗi khi cập nhật thông tin");
        }
      }

      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      toast.error(error.message || "Cập nhật thất bại!");
    } finally {
      // Dù thành công hay thất bại, tải lại dữ liệu mới nhất từ server
      // Hàm này BÂY GIỜ đã chứa 'dispatch' nên sẽ cập nhật Redux
      await fetchUserDetail();
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">Hồ sơ cá nhân</h1>
      {/* Khối card chính */}
      <div className="bg-white shadow-md rounded-xl p-10">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full mx-auto mb-6 relative group">
          {userData.profilePic ? (
            <img
              src={userData.profilePic}
              alt="Ảnh đại diện"
              className="w-full h-full rounded-full object-cover"
              // Thu hồi URL tạm thời khi component unmount
              onLoad={(e) => {
                if (newAvatarFile && e.target.src.startsWith("blob:")) {
                  URL.revokeObjectURL(e.target.src);
                }
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl">
              <FaUser />
            </div>
          )}

          {/* Lớp phủ mờ và icon chỉnh sửa khi hover */}
          <label
            htmlFor="uploadProfilePic"
            className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <FaPen />
          </label>

          {/* Input file ẩn */}
          <input
            type="file"
            id="uploadProfilePic"
            className="hidden"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>

        {/* info */}
        <div className="space-y-6">
          {/* Họ tên */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Họ tên: </div>
            <div className="col-span-2">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
              ></input>
            </div>
          </div>

          {/* Giới tính */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Giới tính: </div>
            <div className="col-span-2 flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={userData.gender === "Nam"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={userData.gender === "Nữ"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Nữ
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Khác"
                  checked={userData.gender === "Khác"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Khác
              </label>
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">Ngày sinh: </div>
            <div className="col-span-2 relative">
              <input
                type="date"
                name="dateOfBirth"
                value={userData.dateOfBirth}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
              ></input>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-3 items-center">
            {/* Sửa lại text "Email: T" thành "Email:" */}
            <div className="col-span-1">Email: </div>
            <div className="col-span-2">
              <input
                type="text"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
              ></input>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị nút có điều kiện */}
      <div className="mt-6 flex justify-center">
        {isDirty && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 rounded-full text-white py-2 px-6 transition-all duration-300 disabled:bg-gray-400"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        )}
      </div>
    </>
  );
};

export default PersonalInfo;
