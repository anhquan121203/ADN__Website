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
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Bộ lọc mẫu</h3>
      </div>
      
<form id="filterForm" onSubmit={handleSubmit} className="max-w-[1200px] mx-auto">
  {/* --- Grid chứa tất cả các field --- */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Trạng thái */}
    <div className="flex flex-col">
      <label htmlFor="status" className="font-medium text-base mb-1">Trạng thái</label>
      <select
        id="status"
        name="status"
        value={localFilters.status}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Tất cả</option>
        {sampleStatuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>

    {/* Loại mẫu */}
    <div className="flex flex-col">
      <label htmlFor="type" className="font-medium text-base mb-1">Loại mẫu</label>
      <select
        id="type"
        name="type"
        value={localFilters.type}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Tất cả</option>
        {sampleTypes.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>

    {/* Mã cuộc hẹn */}
    <div className="flex flex-col">
      <label htmlFor="appointmentId" className="font-medium text-base mb-1">Mã cuộc hẹn</label>
      <input
        id="appointmentId"
        name="appointmentId"
        value={localFilters.appointmentId}
        onChange={handleInputChange}
        placeholder="Nhập mã cuộc hẹn"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Mã kit */}
    <div className="flex flex-col">
      <label htmlFor="kitCode" className="font-medium text-base mb-1">Mã bộ kit</label>
      <input
        id="kitCode"
        name="kitCode"
        value={localFilters.kitCode}
        onChange={handleInputChange}
        placeholder="Nhập mã bộ kit"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Tên người lấy mẫu */}
    <div className="flex flex-col">
      <label htmlFor="personName" className="font-medium text-base mb-1">Tên người lấy mẫu</label>
      <input
        id="personName"
        name="personName"
        value={localFilters.personName}
        onChange={handleInputChange}
        placeholder="Nhập tên người lấy mẫu"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Từ ngày */}
    <div className="flex flex-col">
      <label htmlFor="startDate" className="font-medium text-base mb-1">Từ ngày</label>
      <input
        id="startDate"
        type="date"
        name="startDate"
        value={localFilters.startDate}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Đến ngày */}
    <div className="flex flex-col">
      <label htmlFor="endDate" className="font-medium text-base mb-1">Đến ngày</label>
      <input
        id="endDate"
        type="date"
        name="endDate"
        value={localFilters.endDate}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>

  {/* --- Nút Tìm kiếm & Đặt lại nằm riêng bên dưới --- */}
  <div className="mt-6 flex justify-end gap-3">
    <button
      type="submit"
      className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FaSearch className="mr-2 h-4 w-4" /> Tìm kiếm
    </button>
    <button
      type="button"
      onClick={handleReset}
      className="inline-flex items-center px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FaUndo className="mr-2 h-4 w-4" /> Đặt lại
    </button>
  </div>
</form>

    </div>
  );
};

export default FilterSample;
