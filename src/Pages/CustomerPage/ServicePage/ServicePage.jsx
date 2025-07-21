import React, { useEffect, useState } from "react";
import useService from "../../../Hooks/useService";
import ServiceFilter from "./components/ServiceFilter";
import ServiceList from "./components/ServiceList";

const ServicePage = () => {
  const { 
    services, 
    loading, 
    total, 
    currentPage, 
    searchListService,
  } = useService();
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  useEffect(() => {
    // Initial load of all active services with parent_service_id only
    searchListService({ 
      is_active: true,
      pageNum: 1,
      pageSize: 10,
      has_parent: true
    });
  }, [searchListService]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const query = {
      is_active: true,
      pageNum: 1,
      pageSize: 10,
      has_parent: true
    };

    if (category !== "all") {
      query.type = category;
    }

    searchListService(query);
  };

  const handleServiceSearch = (keyword) => {
    const query = {
      is_active: true,
      keyword,
      pageNum: 1,
      pageSize: 10,
      has_parent: true
    };

    if (activeCategory !== "all") {
      query.type = activeCategory;
    }

    searchListService(query);
  };

  const handleServicePageChange = (page) => {
    const query = {
      is_active: true,
      pageNum: page,
      pageSize: 10,
      has_parent: true
    };

    if (activeCategory !== "all") {
      query.type = activeCategory;
    }

    searchListService(query);
  };

  // Calculate pagination info
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex min-h-screen bg-gray-50 mt-[160px]">
      <ServiceFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryClick} 
      />
      <ServiceList 
        services={services} 
        loading={loading}
        onSearch={handleServiceSearch}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleServicePageChange}
      />
    </div>
  );
};

export default ServicePage;
