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
      <h2 className="text-lg font-semibold mb-4">Search Appointments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select
            placeholder="Select status"
            className="w-full"
            value={searchParams.status || undefined}
            onChange={(value) => handleSelectChange(value, 'status')}
            allowClear
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
          <Select
            placeholder="Select type"
            className="w-full"
            value={searchParams.appointment_type || undefined}
            onChange={(value) => handleSelectChange(value, 'appointment_type')}
            allowClear
          >
            <Option value="self">Self</Option>
            <Option value="facility">Facility</Option>
            <Option value="home">Home</Option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <RangePicker 
            className="w-full" 
            value={searchParams.dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
          <Input
            placeholder="Enter customer ID"
            name="customer_id"
            value={searchParams.customer_id}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
          <Input
            placeholder="Enter staff ID"
            name="staff_id"
            value={searchParams.staff_id}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Collection Address</label>
          <Input
            placeholder="Enter collection address"
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
          Reset
        </Button>
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
          className="bg-blue-500"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
