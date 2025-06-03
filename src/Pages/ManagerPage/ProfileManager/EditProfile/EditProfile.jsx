import React, { useState, useEffect } from 'react';
import useUser from '../../../../Hooks/useUser';
import '../ProfileManger.css';
import { FaEnvelope, FaCheck, FaUpload, FaUser } from 'react-icons/fa'; // Added FaUser import
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { handleUploadFile } from '../../../../utils/config/upload';

const EditProfile = ({ user, onCancel, onSaveSuccess }) => {
  const { updateUsers, loading } = useUser();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    dob: '',
    avatar_url: ''
  });

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        id: user._id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        dob: user.dob || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'd MMM, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // In the handleSave function
  const handleSave = async () => {
    try {
      const userData = {
        id: user?._id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        dob: formData.dob,
        avatar_url: formData.avatar_url
      };
  
      const result = await updateUsers(userData);
      
      if (result?.success) {
        toast.success('Profile updated successfully');
        // Add a small delay to ensure the update is processed
        setTimeout(() => {
          if (typeof onSaveSuccess === 'function') {
            onSaveSuccess();
          }
        }, 300);
      } else {
        toast.error(result?.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Update error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add this new function for handling image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await handleUploadFile(file, 'image');
      
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          avatar_url: imageUrl
        }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getAvatarFallback = () => {
    if (!user?.last_name) return <FaUser />;
    return user.last_name.charAt(0).toUpperCase();
  };
  
  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">
          {formData.avatar_url ? (
            <img src={formData.avatar_url} alt="Profile" />
          ) : (
            <div className="avatar-fallback">
              {getAvatarFallback()}
            </div>
          )}
          <div className="avatar-upload">
            <label htmlFor="avatar-input" className="upload-label">
              <FaUpload />
              <span>{uploading ? 'Đang tải lên...' : 'Đổi ảnh'}</span>
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="profile-title">
          <h2>{formData.first_name} {formData.last_name}</h2>
          <div className="profile-email">{formData.email}</div>
        </div>
      </div>

      <div className="profile-edit-form">
        <div className="form-row">
          <div className="form-group">
            <label>Họ</label>
            <input 
              type="text" 
              name="first_name" 
              value={formData.first_name} 
              onChange={handleChange} 
              placeholder="Họ"
            />
          </div>
          <div className="form-group">
            <label>Tên</label>
            <input 
              type="text" 
              name="last_name" 
              value={formData.last_name} 
              onChange={handleChange} 
              placeholder="Tên"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="email-input">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Địa chỉ email"
            />
          </div>
          <div className="verified-badge">
            <FaCheck className="verified-icon" />
            <span>ĐÃ XÁC THỰC {formatDate(user?.updated_at)}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input 
            type="text" 
            name="phone_number" 
            value={formData.phone_number} 
            onChange={handleChange} 
            placeholder="Số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Ngày sinh</label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob ? formData.dob.split('T')[0] : ''} 
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>Hủy</button>
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;