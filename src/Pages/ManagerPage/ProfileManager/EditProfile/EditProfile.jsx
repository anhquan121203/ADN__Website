import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import useUser from '../../../../Hooks/useUser';
import useAuth from '../../../../Hooks/useAuth';
import { FaEnvelope, FaCheck, FaUpload, FaUser} from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const EditProfile = ({ user, onCancel, onSaveSuccess }) => {
  const { updateUsers, loading } = useUser();
  const { refreshUserData } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  

  const emptyAddress = { street: '', ward: '', district: '', city: '', country: 'Việt Nam' };
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    avatar_image: null, // file object
    avatar_url: '',     // real URL from backend only
    dob: '',
    address: { ...emptyAddress },
    gender: ''
  });

  // Separate preview URL for UI only, never sent to backend
  const [previewUrl, setPreviewUrl] = useState('');

  // Auto-load current user data on component mount
  useEffect(() => {
    if (user) {
      const genderValue = typeof user.gender === 'string' ? user.gender.toLowerCase() : '';
      console.log('Loaded gender value:', genderValue, 'from user:', user.gender);
      let addressObj = { ...emptyAddress };
      if (user.address) {
        try {
          if (typeof user.address === 'string') {
            const parsed = JSON.parse(user.address);
            addressObj = { ...emptyAddress, ...parsed };
          } else if (typeof user.address === 'object') {
            addressObj = { ...emptyAddress, ...user.address };
          }
        } catch (e) {
          // fallback: leave as default
        }
      }
      setFormData({
        id: user._id || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        avatar_image: null,
        avatar_url: user.avatar_url || '',
        dob: user.dob || '',
        address: { ...emptyAddress, ...addressObj },
        gender: genderValue || ''
      });
      setPreviewUrl(user.avatar_url || '');
    }
  }, [user]);
  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format';
    }
    
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        newErrors.dob = 'Invalid date of birth';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!user?._id) {
      toast.error('User ID not found, please reload page!');
      return;
    }


    try {
      let result;
      if (!formData.avatar_image) {
        // Gửi object thuần nếu không upload ảnh
        const body = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          dob: formData.dob,
          address: formData.address, // object
          gender: formData.gender,
          avatar_url: formData.avatar_url
        };
        result = await updateUsers(user._id, body); // Bạn cần đảm bảo updateUsers gửi application/json
      } else {
        // Nếu có upload ảnh, vẫn phải dùng FormData và stringify address
        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('phone_number', formData.phone_number);
        formDataToSend.append('dob', formData.dob);
        formDataToSend.append('address', JSON.stringify(formData.address));
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('avatar_image', formData.avatar_image);
        formDataToSend.append('avatar_url', formData.avatar_image.name);
        result = await updateUsers(user._id, formDataToSend);
      }
      if (result?.success) {
        toast.success('Profile updated successfully');
        // Refresh user data to reflect changes
        await refreshUserData();
        setTimeout(() => {
          if (typeof onSaveSuccess === 'function') {
            onSaveSuccess(result.data);
          }
        }, 300);
      } else {
        // Always show backend error message if present
        let errorMessage = 'Failed to update profile';
        if (result?.error?.message) errorMessage = result.error.message;
        else if (result?.message) errorMessage = result.message;
        if (result?.error?.errors) {
          const backendErrors = {};
          result.error.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrors(backendErrors);
          if (result.error.errors.length > 0) {
            errorMessage = result.error.errors[0].message;
          }
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Update error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Address fields
    if (name.startsWith('address.')) {
      const addrField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...emptyAddress,
          ...(prev.address || {}),
          [addrField]: value
        }
      }));
      if (errors.address && errors.address[addrField]) {
        setErrors(prev => ({
          ...prev,
          address: { ...prev.address, [addrField]: '' }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
  
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
  
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }
  
    // Create preview URL for UI only
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    setFormData(prev => ({
      ...prev,
      avatar_image: file,
      // Do NOT set avatar_url to previewUrl, keep only real URL from backend
    }));
    toast.success('Image selected successfully');
  };

  const getAvatarFallback = () => {
    if (!formData.first_name && !formData.last_name) return <FaUser />;
    const initials = `${formData.first_name?.charAt(0) || ''}${formData.last_name?.charAt(0) || ''}`;
    return initials.toUpperCase();
  };
  
  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-100">
        <div className="relative flex flex-col items-center gap-3">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-blue-100">
              {getAvatarFallback()}
            </div>
          )}
          <div className="relative">
            <label 
              htmlFor="avatar-input" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer text-sm font-medium transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FaUpload />
              <span>{uploading ? 'Đang Tải Lên...' : 'Thay Đổi Ảnh'}</span>
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading || loading}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {formData.first_name} {formData.last_name}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-lg">
            <FaEnvelope className="text-blue-600" />
            {user?.email}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">First Name *</label>
            <input 
              type="text" 
              name="first_name" 
              value={formData.first_name} 
              onChange={handleChange} 
              placeholder="Enter first name"
              className={`p-3 border-2 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${
                errors.first_name ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.first_name && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                {errors.first_name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">Last Name *</label>
            <input 
              type="text" 
              name="last_name" 
              value={formData.last_name} 
              onChange={handleChange} 
              placeholder="Enter last name"
              className={`p-3 border-2 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${
                errors.last_name ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.last_name && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                {errors.last_name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 text-sm">Email address</label>
          <div className="relative flex items-center">
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled
              placeholder="Email address"
              className="w-full pl-10 p-3 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-2 text-green-600 text-xs font-medium mt-1">
            <FaCheck className="w-3 h-3" />
            <span>VERIFIED {formatDate(user?.updated_at)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 text-sm">Phone Number</label>
          <div className="relative flex items-center">
            <input 
              type="text" 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleChange} 
              placeholder="+84 123 456 789"
              className={`w-full pl-10 p-3 border-2 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${
                errors.phone_number ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.phone_number && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              {errors.phone_number}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">Date of Birth</label>
            <div className="relative flex items-center">
              <input 
                type="date" 
                name="dob" 
                value={formData.dob ? formData.dob.split('T')[0] : ''} 
                onChange={handleChange}
                className={`w-full pl-10 p-3 right-4 border-2 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${
                  errors.dob ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.dob && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                {errors.dob}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">Gender</label>
            <Select
              value={formData.gender || undefined}
              onChange={value => handleChange({ target: { name: 'gender', value } })}
              placeholder="Select Gender"
              className="w-full "
              size="large"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              allowClear
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 text-sm">Address</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              name="address.street"
              value={(formData.address && formData.address.street) || ''}
              onChange={handleChange}
              placeholder="Đường"
              className="p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              name="address.ward"
              value={(formData.address && formData.address.ward) || ''}
              onChange={handleChange}
              placeholder="Phường"
              className="p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              name="address.district"
              value={(formData.address && formData.address.district) || ''}
              onChange={handleChange}
              placeholder="Quận"
              className="p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              name="address.city"
              value={(formData.address && formData.address.city) || ''}
              onChange={handleChange}
              placeholder="Thành phố"
              className="p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              name="address.country"
              value={(formData.address && formData.address.country) || ''}
              onChange={handleChange}
              placeholder="Quốc gia"
              className="p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-gray-100">
          <button 
            className="px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 border-none min-w-32 bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" 
            onClick={onCancel} 
            disabled={loading}
            type="button"
          >
            Hủy
          </button>
          <button 
            className="px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 border-none min-w-32 bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" 
            onClick={handleSave} 
            disabled={loading || uploading}
            type="button"
          >
            {loading ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;