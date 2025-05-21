import React from 'react'
import SidebarStaff from '../Components/Staff/SidebarStaff'
import { Outlet } from 'react-router-dom'
import './StaffLayout.css'

function StaffLayout() {
  return (
    <div className="staff-layout">
      <div className="staff-sidebar">
        <SidebarStaff />
      </div>
      <div className="staff-content">
        <Outlet />
      </div>
    </div>
  )
}

export default StaffLayout
