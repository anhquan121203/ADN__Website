import React, { useState, useEffect, useCallback } from 'react';
import  useSlot  from '../../../Hooks/useSlot';
import { useAppointment } from '../../../Hooks/useAppoinment';
import useAuth from '../../../Hooks/useAuth';
import useService from '../../../Hooks/useService';
import { format, addDays, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-date-range';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHome, FaHospital, FaFlask, FaTimes, FaGoogle } from 'react-icons/fa';
import GoogleMapPicker from '../../../utils/GoogleMapsUtil.jsx';
import './Appoinment.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { notification } from 'antd';

const AppointmentModal = ({ isOpen, onClose, serviceId, serviceName, serviceType }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [collection_address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  
  // Search and pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  
  const { fetchAvailableSlots } = useSlot();
  const { createAppointment } = useAppointment();
  const { user } = useAuth();
  const { searchListService } = useService();
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  
  useEffect(() => {
    const getSlots = async () => {
      if ((type === 'facility' || type === 'self') && range[0].startDate && range[0].endDate) {
        const startDate = format(range[0].startDate, 'yyyy-MM-dd');
        const endDate = format(range[0].endDate, 'yyyy-MM-dd');
        const result = await fetchAvailableSlots({
          start_date: startDate,
          end_date: endDate
        });
        if (result.success && result.data?.data?.pageData) {
          const slots = result.data.data.pageData;
          setAvailableSlots(slots);
        }
      }
    };
    getSlots();
  }, [range, type]);

  useEffect(() => {
    if (serviceType === 'administrative' || serviceType === 'civil') {
      setType('facility');
    } else {
      setType('');
    }
  }, [serviceType, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      notification.warning({
        message: 'Bạn phải đăng nhập mới đặt lịch được',
        description: 'Vui lòng đăng nhập để tiếp tục sử dụng chức năng này.',
        duration: 3
      });
      return;
    }
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await createAppointment({
        service_id: serviceId,
        ...((type === 'facility' || type === 'self') && selectedSlot && { slot_id: selectedSlot }),
        appointment_date: currentDate,
        type: type,
        collection_address: type === 'home' ? (mapAddress || collection_address) : null
      });

      if (response && !response.error) {
        notification.success({
          message: 'Thành công',
          description: 'Đặt lịch khám thành công!',
        });
        onClose();
      } else {
        let errorMessages = '';
        if (Array.isArray(response?.data?.message)) {
          errorMessages = response.data.message.map((error) => `${error.field}: ${error.message}`).join('\n');
        } else if (typeof response?.data?.message === 'string') {
          errorMessages = response.data.message;
        } else if (typeof response?.message === 'string') {
          errorMessages = response.message;
        } else {
          errorMessages = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
        notification.error({
          message: 'Lỗi',
          description: errorMessages,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
      });
    }
  };

  // Search functions with default values and logic
  const handleSearchService = useCallback(
    (searchPayload = {}) => {
      // Default values for pageNum and pageSize
      const payload = {
        pageNum: 1,
        pageSize: 10,
        // Add filter for services with parent_service_id only
        has_parent: true,
        ...searchPayload
      };
      
      // Update local state
      setCurrentPage(payload.pageNum);
      if (payload.keyword !== undefined) {
        setKeyword(payload.keyword);
      }
      
      searchListService(payload);
    },
    [searchListService]
  );

  // Helper function for search with pagination
  const handleSearch = useCallback(
    (searchKeyword = '') => {
      setKeyword(searchKeyword);
      setCurrentPage(1);
      handleSearchService({
        pageNum: 1,
        pageSize: 10,
        keyword: searchKeyword,
        has_parent: true
      });
    },
    [handleSearchService]
  );

  // Helper function for page change
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1) {
        setCurrentPage(page);
        handleSearchService({
          pageNum: page,
          pageSize: 10,
          keyword,
          has_parent: true
        });
      }
    },
    [handleSearchService, keyword]
  );

  if (!isOpen) return null;

  const handleRangeChange = (item) => {
    const picked = item.selection.startDate;
    const weekStart = startOfWeek(picked, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(picked, { weekStartsOn: 1 });
    setRange([{ startDate: weekStart, endDate: weekEnd, key: 'selection' }]);
  };

  const handleGoogleMapSelect = (selectedAddress) => {
    setMapAddress(selectedAddress);
    setAddress(selectedAddress);
    setShowGoogleMap(false);
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'facility': return <FaHospital className="w-5 h-5" />;
      case 'home': return <FaHome className="w-5 h-5" />;
      case 'self': return <FaFlask className="w-5 h-5" />;
      default: return <FaHospital className="w-5 h-5" />;
    }
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'facility': return 'from-blue-500 to-blue-600';
      case 'home': return 'from-green-500 to-green-600';
      case 'self': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className=" appointment-modal fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Đặt lịch khám</h2>
          <p className="text-teal-100">{serviceName}</p>
        </div>

        <div className="flex max-h-full">
          {/* Left Panel - User Info */}
          <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="w-5 h-5 mr-3 text-teal-500" />
                Thông tin khách hàng
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                    <p className="text-sm text-gray-500">Khách hàng</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  
                  {user?.phone_number && (
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{user?.phone_number}</span>
                    </div>
                  )}

                  {user?.address && (
                    <div className="flex items-start text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                      <span className="text-sm">{user?.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết dịch vụ</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tên dịch vụ:</span>
                  <p className="text-gray-800">{serviceName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Loại dịch vụ:</span>
                  <p className="text-gray-800 capitalize">{serviceType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Form */}
          <div className="flex-1 p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-full">
              
              {/* Collection Method */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Phương thức lấy mẫu
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {/* Facility Option */}
                  <div 
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                      type === 'facility' 
                        ? 'border-teal-500 bg-teal-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setType('facility')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getMethodColor('facility')}`}>
                        {getMethodIcon('facility')}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">Tại phòng khám</h4>
                        <p className="text-sm text-gray-600">Đến trực tiếp cơ sở y tế để lấy mẫu</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        type === 'facility' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {type === 'facility' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  </div>

                  {/* Home Collection Option */}
                  {serviceType === 'civil' && (
                    <div 
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                        type === 'home' 
                          ? 'border-green-500 bg-green-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setType('home')}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getMethodColor('home')}`}>
                          {getMethodIcon('home')}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">Tại nhà</h4>
                          <p className="text-sm text-gray-600">Nhân viên y tế đến tận nơi lấy mẫu</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          type === 'home' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {type === 'home' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Self Collection Option */}
                  {serviceType === 'civil' && (
                    <div 
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                        type === 'self' 
                          ? 'border-purple-500 bg-purple-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setType('self')}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getMethodColor('self')}`}>
                          {getMethodIcon('self')}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">Tự lấy mẫu</h4>
                          <p className="text-sm text-gray-600">Tự thực hiện lấy mẫu tại nhà</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          type === 'self' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {type === 'self' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Input for Home Collection */}
              {type === 'home' && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    <FaMapMarkerAlt className="inline w-5 h-5 mr-2 text-green-600" />
                    Địa chỉ lấy mẫu
                  </label>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={collection_address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                        placeholder="Nhập địa chỉ chi tiết..."
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowGoogleMap(true)}
                        className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center space-x-2"
                      >
                        <FaGoogle className="w-4 h-4" />
                        <span>Maps</span>
                      </button>
                    </div>
                    
                    {mapAddress && (
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Địa chỉ từ Google Maps:</p>
                        <p className="font-medium text-gray-800">{mapAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date Selection for Home Collection Only */}
              {/* {type === 'home' && (
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    <FaCalendarAlt className="inline w-5 h-5 mr-2 text-green-600" />
                    Chọn ngày
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                    required
                  />
                </div>
              )} */}

              {/* Week Selection for Facility and Self */}
              {(type === 'facility' || type === 'self') && (
                <div className="w-full">
                  <label className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaCalendarAlt className="inline w-5 h-5 mr-2 text-teal-600" />
                    Chọn tuần
                  </label>
                  <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-md w-full">
                    <DateRange
                      editableDateInputs={false}
                      onChange={handleRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={range}
                      minDate={new Date()}
                      showDateDisplay={false}
                      rangeColors={['#14b8a6']}
                      showMonthAndYearPickers={true}
                      showPreview={false}
                      months={1}
                      direction="horizontal"
                    />
                  </div>
                  {range[0].startDate && range[0].endDate && (
                    <div className="mt-3 p-4 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
                      <p className="text-sm font-medium text-teal-800">
                        Tuần đã chọn: {format(range[0].startDate, 'dd/MM/yyyy')} - {format(range[0].endDate, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Time Slot Selection for Facility and Self */}
              {(type === 'facility' || type === 'self') && range[0].startDate && range[0].endDate && (
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    <FaClock className="inline w-5 h-5 mr-2 text-teal-600" />
                    Chọn khung giờ
                  </label>
                  
                  {availableSlots?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableSlots.map((slot) => {
                        const timeSlot = slot.time_slots?.[0];
                        
                        let displayTime = 'Invalid time';
                        let displayDate = '';
                        let staffNames = [];
                        
                        if (timeSlot?.start_time && timeSlot?.end_time) {
                          const { hour: startHour, minute: startMinute } = timeSlot.start_time;
                          const { hour: endHour, minute: endMinute } = timeSlot.end_time;
                          
                          const paddedStartMinute = startMinute.toString().padStart(2, '0');
                          const paddedEndMinute = endMinute.toString().padStart(2, '0');
                          
                          displayTime = `${startHour}:${paddedStartMinute} - ${endHour}:${paddedEndMinute}`;
                          
                          const date = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
                          displayDate = format(date, 'dd/MM/yyyy');

                          staffNames = slot.staff_profile_ids.map(staff => 
                            `${staff.user_id.first_name} ${staff.user_id.last_name}`
                          );
                        }

                        return (
                          <div
                            key={slot._id}
                            className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 transform hover:scale-105 ${
                              selectedSlot === slot._id
                                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-xl'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                            onClick={() => setSelectedSlot(slot._id)}
                          >
                            <div className="text-center space-y-3">
                              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                                selectedSlot === slot._id 
                                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <FaCalendarAlt className="w-5 h-5" />
                              </div>
                              
                              <div>
                                <div className={`font-bold text-lg ${
                                  selectedSlot === slot._id ? 'text-teal-700' : 'text-gray-800'
                                }`}>
                                  {displayDate}
                                </div>
                                <div className={`font-semibold ${
                                  selectedSlot === slot._id ? 'text-teal-600' : 'text-gray-600'
                                }`}>
                                  {displayTime}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Bác sĩ phụ trách
                                </p>
                                {staffNames.map((name, index) => (
                                  <div key={index} className={`text-sm font-medium ${
                                    selectedSlot === slot._id ? 'text-teal-700' : 'text-gray-700'
                                  }`}>
                                    {name}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {selectedSlot === slot._id && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <FaClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        Không có khung giờ trống cho khoảng thời gian đã chọn
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Google Map Modal */}
        {showGoogleMap && (
          <GoogleMapPicker
            onAddressSelect={handleGoogleMapSelect}
            onClose={() => setShowGoogleMap(false)}
            initialAddress={collection_address}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
