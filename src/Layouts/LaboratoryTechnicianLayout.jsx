import React from 'react';
import SidebarLaboratoryTechnician from '../Components/LaboratoryTechnician/SidebarLaboratoryTechnician/SidebarLaboratoryTechnician';
import { Outlet } from 'react-router-dom';

function LaboratoryTechnicianLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="sticky top-0 h-screen">
        <SidebarLaboratoryTechnician />
      </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default LaboratoryTechnicianLayout;