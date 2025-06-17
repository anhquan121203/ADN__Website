import React, { useState, useEffect } from 'react';
import  useSlot  from '../../../Hooks/useSlot';
import { useAppointment } from '../../../Hooks/useAppoinment';
import { format, addDays, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Appoinment.css';
const AppointmentModal = ({ isOpen, onClose, serviceId, serviceName, serviceType }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [collection_address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const { fetchAvailableSlots } = useSlot();
  const { createAppointment } = useAppointment();
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  
  useEffect(() => {
    const getSlots = async () => {
      if (startDate && endDate) {
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
  }, [startDate, endDate]);

  useEffect(() => {
    if (serviceType === 'administrative' || serviceType === 'civil') {
      setType('facility');
    } else {
      setType('');
    }
  }, [serviceType, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      
      await createAppointment({
        service_id: serviceId,
        ...(selectedSlot && { slot_id: selectedSlot }),
        appointment_date: startDate,
        type: type,
        collection_address: type === 'home' ? collection_address : null
      });
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const maxDate = addDays(new Date(today), 7).toISOString().split('T')[0];

  const handleRangeChange = (item) => {
    const picked = item.selection.startDate;
    // Lấy thứ 2 đầu tuần và chủ nhật cuối tuần (ISO: week starts on Monday)
    const weekStart = startOfWeek(picked, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(picked, { weekStartsOn: 1 });
    setRange([{ startDate: weekStart, endDate: weekEnd, key: 'selection' }]);
    setStartDate(format(weekStart, 'yyyy-MM-dd'));
    setEndDate(format(weekEnd, 'yyyy-MM-dd'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center appointment-modal">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Đặt lịch dịch vụ: {serviceName}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức lấy mẫu
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={serviceType === 'administrative'}
            >
              <option value="facility">Tại phòng khám</option>
              {serviceType === 'civil' && <>
                <option value="home">Tại nhà</option>
                <option value="self">Tự lấy mẫu</option>
              </>}
            </select>
          </div>

          {type === 'home' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ lấy mẫu
              </label>
              <input
                type="text"
                value={collection_address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn tuần
            </label>
            <DateRange
              editableDateInputs={false}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={range}
              minDate={new Date()}
              // maxDate={addDays(new Date(), 30)} // hoặc tuỳ ý
              showDateDisplay={false}
              rangeColors={['#00a9a4']}
              showMonthAndYearPickers={true}
              showPreview={false}
              months={1}
              direction="horizontal"
              // Chỉ cho phép chọn startDate, endDate sẽ tự động là +6 ngày
              
            />
            <div className="mt-2 text-sm">
              Tuần đã chọn: {range[0].startDate ? format(range[0].startDate, 'dd/MM/yyyy') : ''} - {range[0].endDate ? format(range[0].endDate, 'dd/MM/yyyy') : ''}
            </div>
          </div>

          {startDate && endDate && availableSlots?.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn khung giờ
              </label>
              <div className="grid grid-cols-3 gap-2">
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
                    
                    // Format date
                    const date = new Date(timeSlot.year, timeSlot.month - 1, timeSlot.day);
                    displayDate = format(date, 'dd/MM/yyyy');

                    // Get staff names
                    staffNames = slot.staff_profile_ids.map(staff => 
                      `${staff.user_id.first_name} ${staff.user_id.last_name}`
                    );
                  }

                  return (
                    <button
                      key={slot._id}
                      type="button"
                      onClick={() => setSelectedSlot(slot._id)}
                      className={`p-2 rounded-md ${
                        selectedSlot === slot._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">{displayDate}</div>
                      <div className="text-sm">{displayTime}</div>
                      <div className="text-xs mt-1 text-gray-600">
                        {staffNames.map((name, index) => (
                          <div key={index} className="truncate">
                            {name}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : startDate && endDate ? (
            <div className="text-center text-gray-500 mt-4">
              Không có khung giờ trống cho khoảng thời gian đã chọn
            </div>
          ) : null}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"              className="px-4 py-2 bg-[#00a9a4] text-white rounded-md hover:bg-[#1c6b68]"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
