import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Search = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    status: '',
    appointment_type: '',
    dateRange: null,
    customer_id: '',
    staff_id: '',
    collection_address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value, name) => {
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateRangeChange = (dates) => {
    setSearchParams(prev => ({
      ...prev,
      dateRange: dates
    }));
  };

  const handleSearch = () => {
    const params = {
      ...searchParams,
      start_appointment_date: searchParams.dateRange?.[0]?.format('YYYY-MM-DD'),
      end_appointment_date: searchParams.dateRange?.[1]?.format('YYYY-MM-DD'),
    };
    
    // Remove dateRange as it's not needed in the API call
    delete params.dateRange;
    
    onSearch(params);
  };

  const handleReset = () => {
    setSearchParams({
      status: '',
      appointment_type: '',
      dateRange: null,
      customer_id: '',
      staff_id: '',
      collection_address: ''
    });
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Tìm kiếm lịch hẹn</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <Select
            placeholder="Chọn trạng thái"
            className="w-full"
            value={searchParams.status || undefined}
            onChange={(value) => handleSelectChange(value, 'status')}
            allowClear
          >
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại lịch hẹn</label>
          <Select
            placeholder="Chọn loại"
            className="w-full"
            value={searchParams.appointment_type || undefined}
            onChange={(value) => handleSelectChange(value, 'appointment_type')}
            allowClear
          >
            <Option value="self">Tự đến</Option>
            <Option value="facility">Tại cơ sở</Option>
            <Option value="home">Tại nhà</Option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng ngày</label>
          <RangePicker 
            className="w-full" 
            value={searchParams.dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã khách hàng</label>
          <Input
            placeholder="Nhập mã khách hàng"
            name="customer_id"
            value={searchParams.customer_id}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
          <Input
            placeholder="Nhập mã nhân viên"
            name="staff_id"
            value={searchParams.staff_id}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ lấy mẫu</label>
          <Input
            placeholder="Nhập địa chỉ lấy mẫu"
            name="collection_address"
            value={searchParams.collection_address}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleReset}
        >
          Đặt lại
        </Button>
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
          className="bg-blue-500"
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Search;
