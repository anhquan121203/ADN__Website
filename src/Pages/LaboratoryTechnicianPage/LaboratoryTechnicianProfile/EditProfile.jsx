import React, { useState, useEffect } from 'react';
import useLaboratoryTechnician from '../../../Hooks/useUser';
import { FaEnvelope, FaCheck, FaUpload, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { handleUploadFile } from '../../../utils/config/upload';

const EditProfile = ({ user, onCancel, onSaveSuccess }) => {
  const { updateUsers, loading } = useLaboratoryTechnician();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'd MMM, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await handleUploadFile(file);
      setFormData(prev => ({
        ...prev,
        avatar_url: uploadedUrl
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          {formData.avatar_url ? (
            <img 
              src={formData.avatar_url} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
            <FaUpload className="text-white text-sm" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split('T')[0] : ''} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading || uploading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;