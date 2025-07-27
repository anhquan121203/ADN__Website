import React, { useState } from "react";
import useUser from "../../../../Hooks/useUser";
import useAuth from "../../../../Hooks/useAuth";
import { toast } from "react-toastify";
import "../CustomerProfile.css";

const ModalChangePasswordCustomer = ({ onClose, userId }) => {
  const { changeUserPassword, loading } = useUser();
  const { user } = useAuth();

  // Nếu người dùng đăng nhập bằng Google, đóng modal
  if (user?.google_id) {
    onClose();
    return null;
  }
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (passwords.new_password.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const result = await changeUserPassword({
        user_id: userId,
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });

      if (result.success) {
        toast.success("Đổi mật khẩu thành công");
        onClose();
      } else {
        toast.error(result.error || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
      console.error("Lỗi đổi mật khẩu:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              name="old_password"
              value={passwords.old_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="new_password"
              value={passwords.new_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirm_password"
              value={passwords.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalChangePasswordCustomer;
