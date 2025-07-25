import React, { useState } from "react";
import "./ProfileManger.css";
import useAuth from "../../../Hooks/useAuth";
import useUser from "../../../Hooks/useUser";
import { FaCheck, FaUser, FaEdit, FaKey } from "react-icons/fa"; // Add FaEdit and FaKey imports
import { format } from "date-fns";
import ChangePasswordModal from "./ModalChangePassword/ModalChangePassword";
import EditProfile from "./EditProfile/EditProfile";
const ProfileManager = () => {
  const { user, refreshUserData } = useAuth();
  const { loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "staff":
        return "Nhân viên";
      case "customer":
        return "Khách hàng";
      case "manager":
        return "Quản lý";
      case "laboratory_technician":
        return "Kỹ thuật viên phòng xét nghiệm";
      default:
        return "Người dùng";
    }
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveSuccess = async () => {
    setIsRefreshing(true);
    await refreshUserData(); // Call the refresh function from useAuth
    setIsEditing(false);
    setIsRefreshing(false);
  };

  if (!user) {
    return <div className="profile-loading">Đang tải dữ liệu hồ sơ...</div>;
  }

  if (isRefreshing) {
    return <div className="profile-loading">Đang làm mới dữ liệu hồ sơ...</div>;
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

  // Add this handler
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  // Add this handler
  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  // In your return statement, add the button near the Edit Profile button
  // Add this function to get avatar fallback
  const getAvatarFallback = () => {
    if (!user?.last_name) return <FaUser />;
    return user.last_name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" />
          ) : (
            <div className="avatar-fallback">{getAvatarFallback()}</div>
          )}
        </div>
        <div className="profile-title">
          <h2>
            {user?.first_name} {user?.last_name}
          </h2>
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h3>Thông tin cá nhân</h3>
          <div className="detail-row">
            <span className="detail-label">Họ tên:</span>
            <span className="detail-value">
              {user?.first_name} {user?.last_name}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user?.email}</span>
            {user?.is_verified && (
              <span className="verified-tag">
                <FaCheck /> Đã xác thực
              </span>
            )}
          </div>
          <div className="detail-row">
            <span className="detail-label">Số điện thoại:</span>
            <span className="detail-value">
              {user?.phone_number || "Chưa cung cấp"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ngày sinh:</span>
            <span className="detail-value">{formatDate(user?.dob)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vai trò:</span>
            <span className="detail-value">
              {getRoleDisplayName(user?.role)}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Thông tin tài khoản</h3>
          <div className="detail-row">
            <span className="detail-label">Mã người dùng:</span>
            <span className="detail-value">{user?._id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Trạng thái:</span>
            <span
              className={`status-badge ${user?.status ? "active" : "inactive"}`}
            >
              {user?.status ? "Đang hoạt động" : "Ngừng hoạt động"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ngày tạo:</span>
            <span className="detail-value">{formatDate(user?.created_at)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Cập nhật lần cuối:</span>
            <span className="detail-value">{formatDate(user?.updated_at)}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-edit" onClick={handleEdit} disabled={loading}>
            <FaEdit size={16} />
            {loading ? "Đang tải..." : "Chỉnh sửa hồ sơ"}
          </button>

          {!user?.google_id && (
            <button
              className="btn-change-password"
              onClick={handleChangePassword}
              disabled={loading}
            >
              <FaKey size={16} />
              Đổi mật khẩu
            </button>
          )}
        </div>
      </div>

      {/* Only render modal if user doesn't have google_id */}
      {isPasswordModalOpen && !user?.google_id && (
        <ChangePasswordModal
          onClose={handleClosePasswordModal}
          userId={user?._id}
        />
      )}
    </div>
  );
};

export default ProfileManager;
