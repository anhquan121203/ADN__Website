import React, { useState } from "react";
import AppointmentModal from "../../CreateAppointment/AppointmentModal";
import CreateAppointmentAdmin from "../../CreateAppointment/CreateAppointmentAdmin/CreateApoinmentAdmin";

const ServiceList = ({ services, loading }) => {
  const [selectedService, setSelectedService] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCivilModalOpen, setIsCivilModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Lọc chỉ những service có parent_service_id
  const filteredServices = services.filter(service => service.parent_service_id);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <div className="flex-1 p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Đang tải...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={service.image_url || "default-service-image.jpg"}
                  alt={service.name}
                  className="w-full h-auto object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>{service.sample_method === 'home_collected' ? 'Thu mẫu tại nhà' : 'Thu mẫu tại phòng khám'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Thời gian ước tính: {service.estimated_time || 'N/A'} ngày</span>
                    </div>
                  </div>
                  <div className="text-black font-bold mb-4 text-4xl">
                    {service.price.toLocaleString()} VNĐ/mẫu
                  </div>

                  {/* <button
                    onClick={() => {
                      setSelectedService(service);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-[#00a9a4] text-white py-2 px-4 rounded-lg hover:bg-[#1c6b68] transition-colors duration-300"
                  >
                    Đăng ký ngay
                  </button> */}

                  <button
                    onClick={() => {
                      setSelectedService(service);
                      if (service.type === 'civil') {
                        setIsCivilModalOpen(true);
                      } else if (service.type === 'administrative') {
                        setIsAdminModalOpen(true);
                      }
                    }}
                    className="w-full bg-[#00a9a4] text-white py-2 px-4 rounded-lg hover:bg-[#1c6b68] transition-colors duration-300"
                  >
                    Đăng ký ngay
                  </button>


                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#00a9a4] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Appointment Modal */}
      {/* {selectedService && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          serviceId={selectedService._id}
          serviceName={selectedService.name}
          serviceType={selectedService.type}
        />
      )} */}

      {/* Modal dành cho dân sự */}
      {selectedService && selectedService.type === 'civil' && (
        <AppointmentModal
          isOpen={isCivilModalOpen}
          onClose={() => {
            setIsCivilModalOpen(false);
            setSelectedService(null);
          }}
          serviceId={selectedService._id}
          serviceName={selectedService.name}
          serviceType={selectedService.type}
        />
      )}

      {/* Modal dành cho hành chính */}
      {selectedService && selectedService.type === 'administrative' && (
        <CreateAppointmentAdmin
          visible={isAdminModalOpen}
          onCancel={() => {
            setIsAdminModalOpen(false);
            setSelectedService(null);
          }}
          serviceId={selectedService._id}
          serviceName={selectedService.name}
          serviceType={selectedService.type}
        />
      )}


    </div>
  );
};

export default ServiceList;
