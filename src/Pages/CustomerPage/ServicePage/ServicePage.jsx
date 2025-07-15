import React, { useEffect, useState } from "react";
import useService from "../../../Hooks/useService";
import ServiceFilter from "./components/ServiceFilter";
import ServiceList from "./components/ServiceList";

const ServicePage = () => {
  const { services, loading, searchListService } = useService();
  const [activeCategory, setActiveCategory] = useState("all");    
  useEffect(() => {
    // Initial load of all active services
    searchListService({ 
      is_active: true 
    });
  }, [searchListService]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const query = {
      is_active: true
    };

    if (category !== "all") {
      query.type = category;
    }

    searchListService(query);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-[160px]">
      <ServiceFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryClick} 
      />
      <ServiceList 
        services={services} 
        loading={loading} 
      />
    </div>
  );
};

export default ServicePage;
