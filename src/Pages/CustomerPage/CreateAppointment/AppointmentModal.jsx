import React, { useState, useEffect, useCallback } from 'react';
import  useSlot  from '../../../Hooks/useSlot';
import { useAppointment } from '../../../Hooks/useAppoinment';
import useAuth from '../../../Hooks/useAuth';
import useService from '../../../Hooks/useService';
import { format, addDays, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-date-range';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHome, FaHospital, FaFlask, FaTimes, FaGoogle, FaExclamationTriangle } from 'react-icons/fa';
import { Alert } from 'antd';
import GoogleMapPicker from '../../../utils/GoogleMapsUtil.jsx';
import { useNavigate } from 'react-router-dom';
import './Appoinment.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { toast } from 'react-toastify';

const AppointmentModal = ({ isOpen, onClose, serviceId, serviceName, serviceType }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [collection_address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [isOutsideBusinessHours, setIsOutsideBusinessHours] = useState(false);
  const [addressValidation, setAddressValidation] = useState({ isValid: true, message: '' });
  
  // Search and pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  
  const { fetchAvailableSlots } = useSlot();
  const { createAppointment } = useAppointment();
  const { user } = useAuth();
  const { searchListService } = useService();
  const navigate = useNavigate();
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);
  // Validation functions
  const validateHCMCAddress = (address) => {
    const hcmcKeywords = ['hồ chí minh', 'tp hcm', 'thành phố hồ chí minh', 'ho chi minh', 'hcmc', 'sài gòn', 'saigon'];
    const normalizedAddress = address.toLowerCase().trim();
    return hcmcKeywords.some(keyword => normalizedAddress.includes(keyword));
  };

  const checkBusinessHoursAndDay = (slot) => {
    if (!slot?.time_slots?.[0]) return false;
    const timeSlot = slot.time_slots[0];
    const startHour = timeSlot.start_time?.hour;
    const endHour = timeSlot.end_time?.hour;
    // Create date object and get day of week (0=Sunday, 6=Saturday)
    const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
    const dayOfWeek = slotDate.getDay();
    // Check if the slot is on a weekend (Saturday or Sunday)
    if (dayOfWeek === 6 || dayOfWeek === 0) return true; // Saturday or Sunday
    // Check business hours: 8:00 - 17:00 (8 AM - 5 PM)
    return startHour < 8 || startHour >= 17 || endHour < 8 || endHour > 17;
  };

  const isSlotSelectableForHome = (slot) => {
    if (!slot?.time_slots?.[0]) return false;
    
    const timeSlot = slot.time_slots[0];
    const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
    const dayOfWeek = slotDate.getDay(); // 0=Sunday, 6=Saturday
    const startHour = timeSlot.start_time?.hour;
    const endHour = timeSlot.end_time?.hour;
    
    // Debug logging for this specific function
    console.log(`🔍 isSlotSelectableForHome check:`, {
      date: `${timeSlot.day}/${timeSlot.month}/${timeSlot.year}`,
      dayOfWeek,
      dayName: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek],
      startHour,
      endHour,
      isWeekend: dayOfWeek === 6 || dayOfWeek === 0,
      isCompletelyOutsideBusinessHours: (endHour <= 8) || (startHour >= 17)
    });
    
    // For home service: 
    // - Weekends (Saturday=6, Sunday=0): Allow all time slots
    // - Weekdays (Monday-Friday): Only allow slots that are COMPLETELY outside business hours
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
    
    if (isWeekend) {
      console.log(`✅ Weekend (${dayOfWeek === 6 ? 'Thứ 7' : 'Chủ nhật'}) - slot allowed for home service`);
      return true; // Allow any time slot on weekends
    }
    
    // For weekdays, the ENTIRE slot must be outside business hours (8:00-17:00)
    // Either: slot ends before 8:00 AM, OR slot starts at/after 17:00 (5:00 PM)
    const isCompletelyOutsideBusinessHours = (endHour <= 8) || (startHour >= 17);
    const result = isCompletelyOutsideBusinessHours;
    
    console.log(`${result ? '✅' : '❌'} Weekday (${['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek]}) - slot ${result ? 'ALLOWED' : 'NOT ALLOWED'} for home service`);
    console.log(`   - Time: ${startHour}:00 - ${endHour}:00, Completely outside business hours: ${isCompletelyOutsideBusinessHours}`);
    console.log(`   - Logic: (endHour <= 8: ${endHour <= 8}) OR (startHour >= 17: ${startHour >= 17})`);
    
    return result;
  };

  const isSlotPastDate = (slot) => {
    if (!slot?.time_slots?.[0]) return true;
    const timeSlot = slot.time_slots[0];
    const now = new Date();
    
    // Use actual date components, not day of week
    const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day, timeSlot.start_time.hour, timeSlot.start_time.minute);
    
    // For debugging - log the comparison
    console.log('Current time:', now);
    console.log('Slot date:', slotDate);
    console.log('Is past?', slotDate < now);
    
    // Only consider it past if the slot time has already ended (not just started)
    // Add a 30-minute buffer to allow booking slots that are about to start
    const bufferTime = 30 * 60 * 1000; // 30 minutes in milliseconds
    return slotDate.getTime() + bufferTime < now.getTime();
  };

  // Helper function to check if slot is today
  const isSlotToday = (slot) => {
    if (!slot?.time_slots?.[0]) return false;
    const timeSlot = slot.time_slots[0];
    const now = new Date();
    const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
    
    return (
      now.getFullYear() === slotDate.getFullYear() &&
      now.getMonth() === slotDate.getMonth() &&
      now.getDate() === slotDate.getDate()
    );
  };

  
  useEffect(() => {
    const getSlots = async () => {
      if ((type === 'facility' || type === 'self' || type === 'home') && range[0].startDate && range[0].endDate) {
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

  // Validate address for home collection
  useEffect(() => {
    if (type === 'home' && (collection_address || mapAddress)) {
      const addressToCheck = mapAddress || collection_address;
      if (addressToCheck.trim()) {
        const isValid = validateHCMCAddress(addressToCheck);
        setAddressValidation({
          isValid,
          message: isValid ? '' : 'Thu mẫu tại nhà chỉ được phép trong khu vực TP. Hồ Chí Minh'
        });
      }
    } else {
      setAddressValidation({ isValid: true, message: '' });
    }
  }, [type, collection_address, mapAddress]);

  // Check business hours for selected slot
  useEffect(() => {
    if (selectedSlot) {
      const slot = availableSlots.find(s => s._id === selectedSlot);
      // If slot is found, check business hours and day
      if (slot) {
        setIsOutsideBusinessHours(checkBusinessHoursAndDay(slot));
      }
    } else {
      setIsOutsideBusinessHours(false);
    }
  }, [selectedSlot, availableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.warning('Bạn phải đăng nhập mới đặt lịch được. Vui lòng đăng nhập để tiếp tục sử dụng chức năng này.');
      return;
    }

    // Validate home collection address
    if (type === 'home' && !addressValidation.isValid) {
      toast.error(addressValidation.message);
      return;
    }

    // Validate required fields
    if ((type === 'facility' || type === 'self' || type === 'home') && !selectedSlot) {
      toast.error('Vui lòng chọn khung giờ khám');
      return;
    }

    // Check if selected slot is in the past for all appointment types
    if (selectedSlot) {
      const selectedSlotData = availableSlots.find(s => s._id === selectedSlot);
      if (selectedSlotData) {
        if (isSlotPastDate(selectedSlotData)) {
          toast.error('Không thể đặt lịch cho khung giờ đã qua');
          return;
        }
        
        // Additional validation for home service
        if (type === 'home' && !isSlotSelectableForHome(selectedSlotData)) {
          toast.error('Dịch vụ tại nhà: Cuối tuần có thể chọn bất kỳ giờ nào, ngày thường chỉ ngoài giờ hành chính');
          return;
        }
      }
    }

    if (type === 'home' && !(collection_address || mapAddress)) {
      toast.error('Vui lòng nhập địa chỉ chi tiết cho việc thu mẫu tại nhà');
      return;
    }
    
    try {
      const response = await createAppointment({
        service_id: serviceId,
        ...((type === 'facility' || type === 'self' || type === 'home') && selectedSlot && { slot_id: selectedSlot }),
        type: type,
        collection_address: type === 'home' ? (mapAddress || collection_address) : null
      });

      // Check for success response structure: {"success": true, "data": []}
      if (response && response.success === true) {
        toast.success('Đặt lịch khám thành công!');
        
        // Get appointment ID from response
        const appointmentId = response.data?._id || response.data?.data?._id;
        
        if (appointmentId) {
          // Navigate to payment page with appointment ID
          navigate('/payment', { 
            state: { 
              appointmentId: appointmentId,
              isFirstPayment: true // Flag to indicate this is the first payment (deposit)
            } 
          });
        }
        
        onClose();
      } else {
        // Handle error response structure: {"success": false, "message"} or {"message"}
        let errorMessage = '';
        if (response && response.message) {
          errorMessage = response.message;
        } else if (response && response.success === false && response.message) {
          errorMessage = response.message;
        } else {
          errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error?.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
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

  return (
    <div className=" appointment-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1caf9a] px-6 py-4 text-white relative rounded-t-lg">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Đặt lịch khám</h2>
          <p className="text-sm opacity-90">{serviceName}</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto font-arial border border-gray-300 px-5 py-5 rounded-b-lg bg-white text-gray-800 text-sm leading-snug">
          
          {/* Section 1: Nội dung chi tiết đặt hẹn */}
          <div className="font-bold text-lg border-b-2 border-[#1caf9a] pb-1 mb-5 text-[#1caf9a]">
            Nội dung chi tiết đặt hẹn
          </div>
          
          <div className="flex gap-5 mb-4 flex-wrap">

            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">
                Dịch vụ <span className="text-red-500">*</span>
              </label>
              <select 
                required 
                defaultValue="facility"
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] h-9"
              >
                <option value="facility">
                  {serviceType === 'civil' ? 'Dân Sự' : 'Không có dịch vụ'}
                </option>
              </select>
            </div>

            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">Tên dịch vụ</label>
              <select 
                defaultValue="serviceName"
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] h-9"
              >
                <option value="serviceName">{serviceName}</option>
              </select>
            </div>
          </div>

          {/* Section 2: Phương thức lấy mẫu */}
          <div className="font-bold text-lg border-b-2 border-[#1caf9a] pb-1 mb-5 text-[#1caf9a]">
            Phương thức lấy mẫu
          </div>

          <div className="flex gap-5 mb-4 flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">
                Địa chỉ lấy mẫu <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="collection_method"
                    value="facility"
                    checked={type === 'facility'}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cơ sở xét nghiệm</span>
                </label>
                {serviceType === 'civil' && (
                  <>
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="collection_method"
                        value="home"
                        checked={type === 'home'}
                        onChange={(e) => setType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Tại nhà</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="collection_method"
                        value="self"
                        checked={type === 'self'}
                        onChange={(e) => setType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Tự lấy mẫu</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Address Input for Home Collection */}
          {type === 'home' && (
            <div className="flex gap-5 mb-4 flex-wrap">
              <div className="flex-1 min-w-[300px] flex flex-col">
                <label className="font-semibold mb-1.5 text-[#1caf9a]">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={collection_address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a]"
                    placeholder="Nhập địa chỉ chi tiết..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowGoogleMap(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <FaGoogle className="w-3 h-3" />
                    Maps
                  </button>
                </div>
                {!addressValidation.isValid && (
                  <Alert
                    message={addressValidation.message}
                    type="error"
                    showIcon
                    className="mt-2"
                    icon={<FaExclamationTriangle />}
                  />
                )}
                {mapAddress && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600">Địa chỉ từ Google Maps:</p>
                    <p className="text-sm font-medium">{mapAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date Selection for Facility and Self */}
          {(type === 'facility' || type === 'self' || type === 'home') && (
            <>
              <div className="flex gap-5 mb-4 flex-wrap">
                <div className="flex-1 min-w-[300px] flex flex-col">
                  <label className="font-semibold mb-1.5 text-[#1caf9a]">Chọn khoảng ngày</label>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <DateRange
                      editableDateInputs={false}
                      onChange={handleRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={range}
                      minDate={new Date()}
                      showDateDisplay={false}
                      rangeColors={['#1caf9a']}
                      showMonthAndYearPickers={true}
                      showPreview={false}
                      months={1}
                      direction="horizontal"
                    />
                  </div>
                  {range[0].startDate && range[0].endDate && (
                    <div className="mt-2 p-2 bg-[#1caf9a]/10 rounded border border-[#1caf9a]/20">
                      <p className="text-sm font-medium text-[#1caf9a]">
                        Tuần đã chọn: {format(range[0].startDate, 'dd/MM/yyyy')} - {format(range[0].endDate, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slot Selection */}
              {range[0].startDate && range[0].endDate && (
                <div className="flex flex-col mb-4">
                  <label className="font-semibold mb-1.5 text-[#1caf9a]">Chọn thời gian khám</label>
                  
                  {/* Home service notice */}
                  {type === 'home' && (
                    <Alert
                      message="Lưu ý về lịch hẹn tại nhà"
                      description="Dịch vụ thu mẫu tại nhà: Cuối tuần (Thứ 7, Chủ nhật) có thể chọn bất kỳ khung giờ nào. Các ngày trong tuần chỉ áp dụng ngoài giờ hành chính (trước 8:00 hoặc sau 17:00). Và Chú ý: Phí dịch vụ sẽ tăng thêm 20% cho các khung giờ ngoài giờ hành chính."
                      type="info"
                      showIcon
                      className="mb-3"
                    />
                  )}
                  
                  <div className="flex gap-2 flex-wrap">
                    {availableSlots?.length > 0 ? (
                      availableSlots.map((slot) => {
                        const timeSlot = slot.time_slots?.[0];
                        let displayTime = 'Invalid time';
                        let displayDate = '';
                        let staffNames = [];
                        let isDisabled = false;
                        let disabledReason = '';
                        
                        // Declare these variables outside the conditional block so they're accessible in JSX
                        const isPastDate = isSlotPastDate(slot);
                        const isToday = isSlotToday(slot);

                        if (timeSlot?.start_time && timeSlot?.end_time) {
                          const { hour: startHour, minute: startMinute } = timeSlot.start_time;
                          const { hour: endHour, minute: endMinute } = timeSlot.end_time;

                          const paddedStartMinute = startMinute.toString().padStart(2, '0');
                          const paddedEndMinute = endMinute.toString().padStart(2, '0');

                          displayTime = `${startHour}:${paddedStartMinute} - ${endHour}:${paddedEndMinute}`;

                          const date = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
                          displayDate = format(date, 'dd/MM');

                          staffNames = slot.staff_profile_ids.map(staff => 
                            `${staff.user_id.first_name} ${staff.user_id.last_name}`
                          );
                          // Calculate day of week correctly from date components
                          const slotDate = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
                          const dayOfWeek = slotDate.getDay(); // 0=Sunday, 6=Saturday
                          const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
                          
                          // Debug logging for render logic
                          console.log(`🎨 Render logic for slot ${displayDate} ${displayTime}:`, {
                            slotId: slot._id,
                            isPastDate,
                            type,
                            serviceType,
                            dayOfWeek,
                            isWeekend,
                            startHour: timeSlot.start_time?.hour
                          });
                          
                          if (isPastDate) {
                            isDisabled = true;
                            disabledReason = 'Đã quá thời gian';
                            console.log(`❌ Slot disabled: Past date`);
                          } else if (type === 'home') {
                            // Use the consistent logic from isSlotSelectableForHome
                            const canSelectForHome = isSlotSelectableForHome(slot);
                            console.log(`🏠 Home service check result: ${canSelectForHome}`);
                            
                            if (!canSelectForHome) {
                              isDisabled = true;
                              if (isWeekend) {
                                disabledReason = 'Slot không khả dụng cho dịch vụ tại nhà';
                              } else {
                                disabledReason = 'Ngày thường chỉ ngoài giờ hành chính (trước 8:00 hoặc sau 17:00)';
                              }
                              console.log(`❌ Slot disabled for home: ${disabledReason}`);
                            } else {
                              isDisabled = false;
                              disabledReason = '';
                              console.log(`✅ Slot enabled for home service`);
                            }
                          } else {
                            console.log(`ℹ️ Not home service or past date check passed`);
                          }
                        }

                        return (
                          <div key={slot._id} className="relative">
                            <button
                              type="button"
                              disabled={isDisabled}
                              className={`p-3 border border-gray-300 rounded text-sm cursor-pointer text-gray-800 select-none transition-all ${
                                isDisabled
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                  : selectedSlot === slot._id
                                  ? 'bg-[#1caf9a] text-white border-[#1caf9a] font-bold'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              onClick={() => !isDisabled && setSelectedSlot(slot._id)}
                              title={isDisabled ? disabledReason : ''}
                            >
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span>{displayDate}</span>
                                  {isToday && (
                                    <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded">
                                      Hôm nay
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs">{displayTime}</div>
                                {staffNames.length > 0 && (
                                  <div className="text-xs mt-1">
                                    {staffNames.join(', ')}
                                  </div>
                                )}
                                {isDisabled && (
                                  <div className="text-xs mt-1 text-red-500">
                                    {disabledReason}
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Không có khung giờ trống cho khoảng thời gian đã chọn
                      </div>
                    )}
                  </div>
                  
                  {/* Business Hours Warning */}
                  {isOutsideBusinessHours && selectedSlot && (
                    <Alert
                      message="Cảnh báo phụ phí ngoài giờ"
                      description="Khung giờ bạn chọn nằm ngoài giờ hành chính (8:00 - 17:00). Phí dịch vụ sẽ được tăng thêm 20%."
                      type="warning"
                      showIcon
                      className="mt-3"
                      icon={<FaExclamationTriangle />}
                    />
                  )}
                </div>
              )}
            </>
          )}

          {/* Section 3: Thông tin khách hàng */}
          <div className="font-bold text-lg border-b-2 border-[#1caf9a] pb-1 mb-5 text-[#1caf9a]">
            Thông tin khách hàng
          </div>
          
          <div className="flex gap-5 mb-4 flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Họ và tên"
                required
                value={`${user?.first_name || ''} ${user?.last_name || ''}`}
                disabled
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] bg-gray-100"
              />
            </div>

            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">
                Ngày tháng năm sinh <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Ngày tháng năm sinh"
                required
                value={user?.dob || ''}
                disabled
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-5 mb-4 flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                required
                value={user?.phone_number || ''}
                disabled
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] bg-gray-100"
              />
              <div className="text-xs text-gray-600 mt-1">
                *Lưu ý: Hệ thống chỉ gửi SMS được cho Thuê bao nội địa, nếu quý
                khách sử dụng thuê bao quốc tế, vui lòng bổ sung email chính xác để
                nhận mã xác nhận và thông tin xác nhận đặt lịch.
              </div>
            </div>

            <div className="flex-1 min-w-[300px] flex flex-col">
              <label className="font-semibold mb-1.5 text-[#1caf9a]">Email</label>
              <input 
                type="email" 
                placeholder="Nhập email" 
                value={user?.email || ''} 
                disabled
                className="border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 outline-[#1caf9a] bg-gray-100"
              />
            </div>
          </div>

          {/* Checkbox Agreement */}
          <div className="flex items-start gap-2.5 mt-4 text-xs leading-tight">
            <input type="checkbox" id="agree" required className="mt-0.5" />
            <label htmlFor="agree" className="text-xs leading-tight">
              Tôi đã đọc và đồng ý với{" "}
              <a href="#" className="text-[#1caf9a] no-underline hover:underline" target="_blank" rel="noreferrer">
                Chính sách bảo vệ dữ liệu cá nhân của Blood
              </a>{" "}
              và chấp thuận để Blood xử lý dữ liệu cá nhân của tôi theo quy định của
              pháp luật về bảo vệ dữ liệu cá nhân.{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            className="bg-[#1caf9a] text-white font-semibold border-none px-7 py-2.5 text-sm rounded-full cursor-pointer mx-auto mt-7 block transition-colors hover:bg-[#179e8a] disabled:bg-gray-400 disabled:cursor-not-allowed" 
            type="submit"
          >
            Gửi thông tin
          </button>
        </form>

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
