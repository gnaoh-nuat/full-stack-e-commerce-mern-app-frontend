import React, { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import SummaryApi from "../common";
import { FaUser, FaPen } from "react-icons/fa"; // Sửa lỗi: react-icons/fa
// (Bạn có thể thêm thư viện thông báo như react-toastify)
// import { toast } from 'react-toastify';

const PersonalInfo = () => {
  const [userData, setUserData] = useState({
    _id: "", // Cần lưu _id để biết update cho user nào
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    profilePic: "",
  });

  // State để lưu dữ liệu gốc
  const [originalUserData, setOriginalUserData] = useState(null);
  // State để theo dõi thay đổi
  const [isDirty, setIsDirty] = useState(false);
  // State để lưu file avatar mới
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  // State cho loading
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

  // === SỬA LỖI: Bọc hàm bằng useCallback ===
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
        const formattedData = {
          ...dataApi.data,
          dateOfBirth: formatDateForInput(dataApi.data.dateOfBirth),
        };
        setUserData(formattedData);
        setOriginalUserData(formattedData); // Lưu trạng thái gốc
        setIsDirty(false); // Reset trạng thái
        setNewAvatarFile(null); // Reset file
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }, []); // Thêm mảng dependency rỗng cho useCallback

  // Effect để lấy dữ liệu người dùng ban đầu
  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]); // === SỬA LỖI: Thêm dependency ===

  // Effect để kiểm tra thay đổi
  useEffect(() => {
    // Chỉ so sánh khi originalUserData đã được tải
    if (originalUserData) {
      // 1. Kiểm tra file avatar mới
      const avatarChanged = newAvatarFile !== null;

      // 2. Kiểm tra thông tin text
      const textChanged =
        originalUserData.name !== userData.name ||
        originalUserData.email !== userData.email ||
        originalUserData.gender !== userData.gender ||
        originalUserData.dateOfBirth !== userData.dateOfBirth;

      // Hiển thị nút "Lưu" nếu 1 trong 2 thay đổi
      setIsDirty(avatarChanged || textChanged);
    }
  }, [userData, originalUserData, newAvatarFile]); // Chạy lại mỗi khi 1 trong 3 state này thay đổi

  // Hàm xử lý submit
  const handleSubmit = async () => {
    setLoading(true);
    // toast.info("Đang cập nhật...");

    try {
      // Kiểm tra lại xem cái gì đã thay đổi
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

        // === SỬA LỖI CHÍNH ===
        // Tên key "files" phải khớp với file middleware Multer (upload.array('files', 10))
        // và khớp với Postman bạn đã test thành công.
        formData.append("files", newAvatarFile); // <-- ĐÃ SỬA TỪ "avatar" THÀNH "files"

        const response = await fetch(SummaryApi.uploadAvatar.url, {
          method: "POST",
          credentials: "include",
          body: formData, // Gửi FormData, không cần 'Content-Type'
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
            userId: userData._id, // Gửi ID của user cần update
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            // Không gửi profilePic ở đây
          }),
        });
        const dataApi = await response.json();
        textSuccess = dataApi.success;
        if (!textSuccess) {
          throw new Error(dataApi.message || "Lỗi khi cập nhật thông tin");
        }
      }

      // alert("Cập nhật thành công!");
      // toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      // toast.error(error.message || "Cập nhật thất bại!");
    } finally {
      // Dù thành công hay thất bại, tải lại dữ liệu mới nhất từ server
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

        {/* info (Giữ nguyên không đổi) */}
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
            <div className="col-span-1">Email: T</div>
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
        {isDirty && ( // Chỉ hiển thị nút khi isDirty là true
          <button
            onClick={handleSubmit} // Thêm onClick
            disabled={loading} // Vô hiệu hóa khi đang tải
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
