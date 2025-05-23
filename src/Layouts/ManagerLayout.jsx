import React from 'react'
import SidebarManager from '../Components/Manager/SidebarManager/SidebarManager'
import { Outlet } from 'react-router-dom'
import './StaffLayout.css'

function ManagerLayout() {
  return (
    <div className="staff-layout">
      <div className="staff-sidebar">
        <SidebarManager />
      </div>
      <div className="staff-content">
        <Outlet />
      </div>
    </div>
  )
}

export default ManagerLayout
