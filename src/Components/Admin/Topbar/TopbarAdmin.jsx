import React, { useState } from 'react'
import './TopbarAdmin.css'
import { FaBars } from 'react-icons/fa'
import { CiLogout, CiSearch, CiSettings } from 'react-icons/ci'
import { IoIosNotificationsOutline, IoMdArrowDropdown } from 'react-icons/io'
import useAuth from '../../../Hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '../../../Feartures/user/authSlice'
import { useNavigate } from 'react-router-dom'
import { FcManager } from 'react-icons/fc'

function Topbar() {
    const { firstName, lastName, email } = useAuth();
    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }

    return (
        <div className="topbar-container">
            <div className='topbar-left'>
                <button className="topbar-icon__menu"><FaBars /></button>
                <div className="topbar-searchbox">
                    <input type="text" placeholder="Tìm kiếm thông tin..." />
                    <CiSearch className="fas fa-search search-icon" />
                </div>
            </div>

            <div className="topbar-right">
                <button className="btn-icon notif-icon"><IoIosNotificationsOutline style={{ fontSize: "20px" }} /><span className="notif-dot" /></button>

                <div className="topbar-profile-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="topbar-profile">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5B_Pc5VMtw8ze74lJ0QYcdSif6a3qMQ-kg&s" alt="Profile" />
                        <span>{firstName} {lastName}</span>
                        <IoMdArrowDropdown />
                    </div>

                    {dropdownOpen && (
                        <div className="topbar-dropdown">
                            <div className="topbar-dropdown__header">
                                <strong>{firstName} {lastName}</strong>
                                <p>{email}</p>
                            </div>
                            <ul className="topbar-dropdown__menu">
                                <li><span><FcManager /></span> Hồ sơ</li>
                                <li><span><CiSettings /></span> Cài đặt</li>
                                <hr />
                                <li onClick={handleLogout}><span><CiLogout /></span> Sign out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Topbar
