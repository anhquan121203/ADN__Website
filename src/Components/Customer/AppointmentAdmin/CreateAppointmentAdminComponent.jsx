import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateAppointmentAdmin from "../../../Pages/CustomerPage/CreateAppointment/CreateAppointmentAdmin/CreateApoinmentAdmin";

const CreateAppointmentAdminComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy state được truyền từ navigate
  const { serviceId, serviceName, serviceType, collectionAddress } = location.state || {};

  // Nếu thiếu dữ liệu, chuyển về trang trước
  if (!serviceId) {
    navigate(-1);
    return null;
  }

  return (
    <CreateAppointmentAdmin
      serviceId={serviceId}
      serviceName={serviceName}
      serviceType={serviceType}
      collectionAddress={collectionAddress}
      visible={true}
      onCancel={() => navigate(-1)}
    />
  );
};

export default CreateAppointmentAdminComponent;
