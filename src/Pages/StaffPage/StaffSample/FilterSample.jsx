import React, { useState, useEffect } from 'react';
import { FaSearch, FaUndo } from 'react-icons/fa';

const sampleTypes = [
  { value: 'blood', label: 'Máu' },
  { value: 'saliva', label: 'Nước bọt' },
  { value: 'tissue', label: 'Mô' },
  { value: 'hair', label: 'Tóc' },
];

const sampleStatuses = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'collected', label: 'Đã thu thập' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'rejected', label: 'Từ chối' },
];

const FilterSample = ({ filters, onFilterChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState({
    status: '',
    type: '',
    appointmentId: '',
    kitCode: '',
    personName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      type: '',
      appointmentId: '',
      kitCode: '',
      personName: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Bộ lọc mẫu</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaUndo className="mr-2 h-4 w-4" />
            Đặt lại
          </button>
          <button
            type="submit"
            form="filterForm"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSearch className="mr-2 h-4 w-4" />
            Tìm kiếm
          </button>
        </div>
      </div>
      
      <form id="filterForm" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={localFilters.status}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tất cả</option>
                {sampleStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample Type */}
          <div className="space-y-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại mẫu</label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={localFilters.type}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tất cả</option>
                {sampleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Appointment ID */}
          <div className="space-y-1">
            <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700">Mã cuộc hẹn</label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="appointmentId"
                type="text"
                name="appointmentId"
                value={localFilters.appointmentId}
                onChange={handleInputChange}
                placeholder="Nhập mã cuộc hẹn"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Kit Code */}
          <div className="space-y-1">
            <label htmlFor="kitCode" className="block text-sm font-medium text-gray-700">Mã kit</label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="kitCode"
                type="text"
                name="kitCode"
                value={localFilters.kitCode}
                onChange={handleInputChange}
                placeholder="Nhập mã kit"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Person Name */}
          <div className="space-y-1">
            <label htmlFor="personName" className="block text-sm font-medium text-gray-700">Tên người lấy mẫu</label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="personName"
                type="text"
                name="personName"
                value={localFilters.personName}
                onChange={handleInputChange}
                placeholder="Nhập tên người lấy mẫu"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Từ ngày</label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={localFilters.startDate}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Đến ngày</label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={localFilters.endDate}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterSample;
