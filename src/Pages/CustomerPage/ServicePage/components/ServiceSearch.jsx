import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ServiceSearch = ({ onSearch, onClear, placeholder = "Tìm kiếm dịch vụ..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onClear) {
      onClear();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Real-time search (debounced)
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="relative max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all text-gray-700 bg-white shadow-sm"
          />
          
          {/* Search Icon */}
          {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="w-4 h-4 text-gray-400" />
          </div> */}

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-3 h-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search button for form submission */}
        <button type="submit" className="hidden">Search</button>
      </form>
    </div>
  );
};

export default ServiceSearch;
