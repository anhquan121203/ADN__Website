import React, { useState, useEffect } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useStaff from '../../../Hooks/useUser';
import './ViewProfileStaff.css';
import { FaCheck, FaUser } from 'react-icons/fa'; // Add FaUser import
import { format } from 'date-fns';
import EditProfile from './EditProfile';
import ChangePasswordModal from './ChangePasswordModal';

const ViewProfile = () => {
  const { user, refreshUserData } = useAuth();
  const { loading } = useStaff();
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
      addressObj.country
    ].filter(Boolean).join(', ');
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'd MMM, yyyy');
    } catch (error) {
      return 'Invalid date';
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
    return <EditProfile user={user} onCancel={handleCancelEdit} onSaveSuccess={handleSaveSuccess} />;
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
            <div className="avatar-fallback">
              {getAvatarFallback()}
            </div>
          )}
        </div>
        <div className="profile-title">
          <h2>{user?.first_name} {user?.last_name}</h2>
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h3>Thông tin cá nhân</h3>
          <div className="detail-row">
            <span className="detail-label">Họ tên:</span>
            <span className="detail-value">{user?.first_name} {user?.last_name}</span>
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
            <span className="detail-value">{user?.phone_number || 'Chưa cung cấp'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Địa chỉ:</span>
            <span className="detail-value">{formatAddress(user?.address)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ngày sinh:</span>
            <span className="detail-value">{formatDate(user?.dob)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vai trò:</span>
            <span className="detail-value">{user?.role || 'Người dùng'}</span>
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
            <span className={`status-badge ${user?.status ? 'active' : 'inactive'}`}>
              {user?.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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
          <button className="btn-edit" onClick={handleEdit}>Chỉnh sửa hồ sơ</button>
          {/* Only show Change Password button if user doesn't have google_id */}
          {!user?.google_id && (
            <button className="btn-change-password" onClick={handleChangePassword}>
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

export default ViewProfile;
