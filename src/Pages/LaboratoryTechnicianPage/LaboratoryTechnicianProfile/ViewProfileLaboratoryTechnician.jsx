import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useLaboratoryTechnician from "../../../Hooks/useUser";
import { FaCheck, FaUser, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
import EditProfile from "./EditProfile";
import ModalChangePassword from "./ModalChangePassword/ModalChangePassword";

const ViewProfileLaboratoryTechnician = () => {
  const { user, refreshUserData } = useAuth();
  const { loading } = useLaboratoryTechnician();
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Format address for display
  const formatAddress = (addressObj) => {
    if (!addressObj) return "Không có địa chỉ";
    return [
      addressObj.street,
      addressObj.ward,
      addressObj.district,
      addressObj.city,
      addressObj.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "d MMM, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const handleChangePassword = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

  const handleSaveSuccess = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setIsEditing(false);
    setIsRefreshing(false);
  };

  const getAvatarFallback = () => {
    if (!user?.last_name) return <FaUser />;
    return user.last_name.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (isRefreshing) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Refreshing profile data...
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditProfile
        user={user}
        onCancel={handleCancelEdit}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                {getAvatarFallback()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h2>
            <div className="text-gray-600">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Thông Tin Cá Nhân
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Họ và Tên:</span>
              <span className="text-gray-800">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Email:</span>
              <div className="flex items-center">
                <span className="text-gray-800">{user?.email}</span>
                {user?.is_verified && (
                  <span className="ml-2 flex items-center text-green-500">
                    <FaCheck className="mr-1" /> Đã xác thực
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Số Điện Thoại:</span>
              <span className="text-gray-800">
                {user?.phone_number || "Chưa cung cấp"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Địa chỉ:</span>
              <span className="text-gray-800">{formatAddress(user?.address)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Ngày Sinh:</span>
              <span className="text-gray-800">{formatDate(user?.dob)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Chức Vụ:</span>
              <span className="text-gray-800">Kỹ Thuật Viên Xét Nghiệm</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Thông Tin Tài Khoản
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Mã Người Dùng:</span>
              <span className="text-gray-800">{user?._id}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Trạng Thái:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user?.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user?.status ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Ngày Tạo:</span>
              <span className="text-gray-800">
                {formatDate(user?.created_at)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Cập Nhật Lần Cuối:</span>
              <span className="text-gray-800">
                {formatDate(user?.updated_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaEdit className="mr-2" />
            Cập Nhật Thông Tin
          </button>
          {!user?.google_id && (
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Thay Đổi Mật Khẩu
            </button>
          )}
        </div>
      </div>

      {isPasswordModalOpen && !user?.google_id && (
        <ModalChangePassword
          onClose={handleClosePasswordModal}
          userId={user?._id}
        />
      )}
    </div>
  );
};

export default ViewProfileLaboratoryTechnician;
