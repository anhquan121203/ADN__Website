import React from "react";

const ServiceFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="w-80 bg-white shadow-lg p-6 max-h-full w-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dịch vụ xét nghiệm</h2>
      <ul className="space-y-4">
        <li
          className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeCategory === "all"
              ? "bg-[#00a9a4] text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => onCategoryChange("all")}
        >
          Tất cả dịch vụ
        </li>
        <li
          className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeCategory === "civil"
              ? "bg-[#00a9a4] text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => onCategoryChange("civil")}
        >
          Xét nghiệm ADN Dân sự
        </li>
        <li
          className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeCategory === "administrative"
              ? "bg-[#00a9a4] text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => onCategoryChange("administrative")}
        >
          Xét nghiệm ADN Hành chính
        </li>
      </ul>
    </div>
  );
};

export default ServiceFilter;
