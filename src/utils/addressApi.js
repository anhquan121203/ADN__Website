/**
 * Vietnamese Address API Utils
 * API: https://provinces.open-api.vn/api/
 */

const BASE_URL = 'https://provinces.open-api.vn/api';

/**
 * Get all provinces/cities
 * @returns {Promise<Array>} List of provinces
 */
export const getProvinces = async () => {
  try {
    const response = await fetch(`${BASE_URL}/p/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

/**
 * Get districts by province code
 * @param {string} provinceCode - Province code
 * @returns {Promise<Array>} List of districts
 */
export const getDistrictsByProvince = async (provinceCode) => {
  try {
    if (!provinceCode) return [];
    const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data?.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

/**
 * Get wards by district code
 * @param {string} districtCode - District code
 * @returns {Promise<Array>} List of wards
 */
export const getWardsByDistrict = async (districtCode) => {
  try {
    if (!districtCode) return [];
    const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data?.wards || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    return [];
  }
};

/**
 * Search provinces by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Filtered provinces
 */
export const searchProvinces = async (query) => {
  try {
    const provinces = await getProvinces();
    if (!query) return provinces;
    
    const normalizedQuery = query.toLowerCase().trim();
    return provinces.filter(province => 
      province.name.toLowerCase().includes(normalizedQuery) ||
      province.code.toString().includes(normalizedQuery)
    );
  } catch (error) {
    console.error('Error searching provinces:', error);
    return [];
  }
};

/**
 * Find province by name (supports partial matching)
 * @param {string} provinceName - Province name to search for
 * @returns {Promise<Object|null>} Found province or null
 */
export const findProvinceByName = async (provinceName) => {
  try {
    const provinces = await getProvinces();
    if (!provinceName) return null;
    
    const normalizedQuery = provinceName.toLowerCase().trim();
    
    // First try exact match
    let found = provinces.find(province => 
      province.name.toLowerCase() === normalizedQuery
    );
    
    // If no exact match, try partial match (province name contains the query)
    if (!found) {
      found = provinces.find(province => 
        province.name.toLowerCase().includes(normalizedQuery)
      );
    }
    
    // If still no match, try reverse (query contains province name without prefix)
    if (!found) {
      found = provinces.find(province => {
        // Remove common prefixes like "Tỉnh ", "Thành phố "
        const cleanProvinceName = province.name
          .replace(/^(Tỉnh|Thành phố)\s+/i, '')
          .toLowerCase();
        return cleanProvinceName === normalizedQuery;
      });
    }
    
    return found || null;
  } catch (error) {
    console.error('Error finding province by name:', error);
    return null;
  }
};

/**
 * Find district by name within a province
 * @param {string} provinceCode - Province code
 * @param {string} districtName - District name to search for
 * @returns {Promise<Object|null>} Found district or null
 */
export const findDistrictByName = async (provinceCode, districtName) => {
  try {
    if (!provinceCode || !districtName) return null;
    
    const districts = await getDistrictsByProvince(provinceCode);
    const normalizedQuery = districtName.toLowerCase().trim();
    
    // First try exact match
    let found = districts.find(district => 
      district.name.toLowerCase() === normalizedQuery
    );
    
    // If no exact match, try partial match
    if (!found) {
      found = districts.find(district => 
        district.name.toLowerCase().includes(normalizedQuery)
      );
    }
    
    // Try without common prefixes
    if (!found) {
      found = districts.find(district => {
        const cleanDistrictName = district.name
          .replace(/^(Quận|Huyện|Thành phố|Thị xã|Phường)\s+/i, '')
          .toLowerCase();
        return cleanDistrictName === normalizedQuery;
      });
    }
    
    return found || null;
  } catch (error) {
    console.error('Error finding district by name:', error);
    return null;
  }
};

/**
 * Find ward by name within a district
 * @param {string} districtCode - District code
 * @param {string} wardName - Ward name to search for
 * @returns {Promise<Object|null>} Found ward or null
 */
export const findWardByName = async (districtCode, wardName) => {
  try {
    if (!districtCode || !wardName) return null;
    
    const wards = await getWardsByDistrict(districtCode);
    const normalizedQuery = wardName.toLowerCase().trim();
    
    // First try exact match
    let found = wards.find(ward => 
      ward.name.toLowerCase() === normalizedQuery
    );
    
    // If no exact match, try partial match
    if (!found) {
      found = wards.find(ward => 
        ward.name.toLowerCase().includes(normalizedQuery)
      );
    }
    
    // Try without common prefixes
    if (!found) {
      found = wards.find(ward => {
        const cleanWardName = ward.name
          .replace(/^(Phường|Xã|Thị trấn)\s+/i, '')
          .toLowerCase();
        return cleanWardName === normalizedQuery;
      });
    }
    
    return found || null;
  } catch (error) {
    console.error('Error finding ward by name:', error);
    return null;
  }
};

/**
 * Get address details by codes or names
 * @param {string|Object} provinceCodeOrName - Province code or name
 * @param {string} districtCodeOrName - District code or name
 * @param {string} wardCodeOrName - Ward code or name
 * @returns {Promise<Object>} Address details
 */
export const getAddressDetails = async (provinceCodeOrName, districtCodeOrName, wardCodeOrName) => {
  try {
    const result = {
      province: null,
      district: null,
      ward: null
    };

    // Handle province
    if (provinceCodeOrName) {
      if (typeof provinceCodeOrName === 'object') {
        result.province = provinceCodeOrName;
      } else if (!isNaN(provinceCodeOrName)) {
        // It's a code
        const provinces = await getProvinces();
        result.province = provinces.find(p => p.code.toString() === provinceCodeOrName.toString());
      } else {
        // It's a name
        result.province = await findProvinceByName(provinceCodeOrName);
      }
    }

    // Handle district
    if (districtCodeOrName && result.province) {
      if (!isNaN(districtCodeOrName)) {
        // It's a code
        const districts = await getDistrictsByProvince(result.province.code);
        result.district = districts.find(d => d.code.toString() === districtCodeOrName.toString());
      } else {
        // It's a name
        result.district = await findDistrictByName(result.province.code, districtCodeOrName);
      }
    }

    // Handle ward
    if (wardCodeOrName && result.district) {
      if (!isNaN(wardCodeOrName)) {
        // It's a code
        const wards = await getWardsByDistrict(result.district.code);
        result.ward = wards.find(w => w.code.toString() === wardCodeOrName.toString());
      } else {
        // It's a name
        result.ward = await findWardByName(result.district.code, wardCodeOrName);
      }
    }

    return result;
  } catch (error) {
    console.error('Error getting address details:', error);
    return { province: null, district: null, ward: null };
  }
};

/**
 * Get address details by names specifically
 * @param {string} provinceName 
 * @param {string} districtName 
 * @param {string} wardName 
 * @returns {Promise<Object>} Address details with codes
 */
export const getAddressDetailsByNames = async (provinceName, districtName, wardName) => {
  try {
    const result = {
      province: null,
      district: null,
      ward: null,
      codes: {
        provinceCode: null,
        districtCode: null,
        wardCode: null
      }
    };

    // Find province
    if (provinceName) {
      result.province = await findProvinceByName(provinceName);
      if (result.province) {
        result.codes.provinceCode = result.province.code;
      }
    }

    // Find district
    if (districtName && result.province) {
      result.district = await findDistrictByName(result.province.code, districtName);
      if (result.district) {
        result.codes.districtCode = result.district.code;
      }
    }

    // Find ward
    if (wardName && result.district) {
      result.ward = await findWardByName(result.district.code, wardName);
      if (result.ward) {
        result.codes.wardCode = result.ward.code;
      }
    }

    return result;
  } catch (error) {
    console.error('Error getting address details by names:', error);
    return { 
      province: null, 
      district: null, 
      ward: null,
      codes: { provinceCode: null, districtCode: null, wardCode: null }
    };
  }
};

/**
 * Format full address from components
 * @param {Object} addressComponents 
 * @returns {string} Formatted address
 */
export const formatFullAddress = (addressComponents) => {
  const { street, ward, district, province } = addressComponents;
  const parts = [street, ward, district, province].filter(Boolean);
  return parts.join(', ');
};

/**
 * Validate address completeness
 * @param {Object} address 
 * @returns {Object} Validation result
 */
export const validateAddress = (address) => {
  const errors = {};
  const { street, ward, district, city: province } = address;

  if (!province || province.trim() === '') {
    errors.city = 'Tỉnh/Thành phố là bắt buộc';
  }

  if (!district || district.trim() === '') {
    errors.district = 'Quận/Huyện là bắt buộc';
  }

  if (!ward || ward.trim() === '') {
    errors.ward = 'Phường/Xã là bắt buộc';
  }

  if (!street || street.trim() === '') {
    errors.street = 'Địa chỉ cụ thể là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
