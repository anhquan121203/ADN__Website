import React, { useEffect, useState } from 'react'
import './DashboardAdmin.css'
import CardDashboard from './CardDashboard/CardDashboard'
import DepartmentDashboard from './DepartmentDashboard/DepartmentDashboard'
import RevenueDashboardAdmin from './RevenueDashboardAdmin/RevenueDashboardAdmin'
import { Divider } from 'antd';
import LoadingComponent from '../../../Components/Customer/LoadingComponent/LoadingComponent'

function DashboardAdmin() {

  return (
    <div className='dashboard-admin'>
      <h1>Dashboard admin</h1>

      <div className="card-dashboard">
        <CardDashboard />
      </div>

      <div className="statics-dashoard">
        <div className="department-statics">
          <DepartmentDashboard />
        </div>

        <div className="user-statics"></div>
      </div>

      {/* <Divider size="middle" /> */}

      <div className="revenue-dashboard">
        <RevenueDashboardAdmin />
      </div>
    </div>
  )
}

export default DashboardAdmin
