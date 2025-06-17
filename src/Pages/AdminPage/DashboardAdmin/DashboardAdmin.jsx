import React from 'react'
import './DashboardAdmin.css'
import CardDashboard from './CardDashboard/CardDashboard'
import DepartmentDashboard from './DepartmentDashboard/DepartmentDashboard'

function DashboardAdmin() {
  return (
    <div className='dashboard-admin'>
      <h1>Dashboard admin</h1>

      <div className="card-dashboard">
        <CardDashboard/>
      </div>

      <div className="statics-dashoard">
        <div className="department-statics">
          <DepartmentDashboard/>
        </div>

        <div className="user-statics"></div>
      </div>
    </div>
  )
}

export default DashboardAdmin
