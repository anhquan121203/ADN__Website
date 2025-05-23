import React, { useState } from 'react';
import useUser from '../../../../Hooks/useUser';
import useAuth from '../../../../Hooks/useAuth';
import { toast } from 'react-toastify';
import '../ProfileAdmin.css';

const ChangePasswordModal = ({ onClose, userId }) => {
  const { changeUserPassword, loading } = useUser();
  const { user } = useAuth(); // Add this line to get user data

  // Add early return if user has google_id
  if (user?.google_id) {
    onClose();
    return null;
  }
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      const result = await changeUserPassword({
        user_id: userId,
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });

      if (result.success) {
        toast.success('Password changed successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred while changing password');
      console.error('Password change error:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="old_password"
              value={passwords.old_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              value={passwords.new_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
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
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;