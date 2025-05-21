// import { message } from "antd";
import cloudinaryConfig from './cloudinaryConfig';
import { notificationMessage } from './helper';
// import { useCallback } from "react";

export const handleUploadFile = async (file, type) => {
  // Check file size for images
  if (type === 'image' && file.size > 5 * 1024 * 1024) {
    notificationMessage('Maximum image attachment size is 5MB.', 'error');
    return ''; // Return early if the file size exceeds the limit
  }

  // Create FormData object for multipart/form-data upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  const resourceType = type === 'video' ? 'video' : 'image';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;

  try {
    // Use fetch with multipart/form-data
    const response = await fetch(uploadUrl, {
      method: 'POST',
      // No need to set Content-Type header as browser will automatically set it with boundary
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      notificationMessage(
        `Failed to upload ${type}: ${errorData.error?.message || 'Unknown error'}`,
        'error'
      );
      return ''; // Return empty string instead of null
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    notificationMessage(`Failed to upload ${type}. Please try again.`, 'error');
    return ''; // Return empty string instead of null
  }
};

export const customUploadHandler = async (options, type, setUploading, onSuccessCallback) => {
  const { file, onSuccess, onError } = options;

  try {
    setUploading(true);

    // Handle file size validation
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for image
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    const url = await handleUploadFile(file, type);
    if (url) {
      onSuccessCallback(type, url);
      onSuccess(url);
      notificationMessage(`${type} uploaded successfully`, 'success');
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload handler error:', error);
    notificationMessage(
      error instanceof Error ? error.message : 'Upload failed',
      'error'
    );
    onError();
  } finally {
    setUploading(false);
  }
};

export const deleteFileFromCloudinary = async (publicId, type) => {
  const resourceType = type === 'video' ? 'video' : 'image';
  const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/resources/${resourceType}/upload/${publicId}`;

  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${btoa(`${cloudinaryConfig.apiKey}:${cloudinaryConfig.apiSecret}`)}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete failed:', errorData);
      notificationMessage(
        `Failed to delete ${type}: ${errorData.error?.message || 'Unknown error'}`,
        'error'
      );
      return false;
    }

    notificationMessage(`${type} deleted successfully`, 'success');
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    notificationMessage(`Failed to delete ${type}. Please try again.`, 'error');
    return false;
  }
};