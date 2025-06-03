import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import { 
  FaVial,
  FaClipboardList,
  FaMicroscope,
  FaFileMedicalAlt,
  FaUser, 
  FaQuestionCircle, 
  FaSignOutAlt,
  FaChevronRight
} from 'react-icons/fa';

function SidebarLaboratoryTechnician() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col h-screen bg-[#1a1f2e] text-white font-sans relative transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[125px]' : 'w-[250px]'}`}>
      {/* Header */}
      <div className={`flex justify-center items-center py-6 ${isCollapsed ? 'px-0' : 'px-4'}`}>
        <div className="flex items-center justify-center">
          <Link to="/">
            <img 
              src={logo} 
              alt="Logo" 
              className={`transition-all duration-300 ${isCollapsed ? 'h-[35px]' : 'h-[45px]'} max-w-full`}
            />
          </Link>
        </div>
      </div>
      
      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <ul className="list-none p-0 m-0 space-y-2">
          <li className={`px-3`}>
            <Link to="/laboratory_technician/samples" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaVial className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Quản lý mẫu</span>
            </Link>
          </li>
          <li className={`px-3`}>
            <Link to="/laboratory_technician/results" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaClipboardList className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Kết quả xét nghiệm</span>
            </Link>
          </li>
          <li className={`px-3`}>
            <Link to="/laboratory_technician/equipment" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaMicroscope className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Thiết bị</span>
            </Link>
          </li>
          <li className={`px-3`}>
            <Link to="/laboratory_technician/reports" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaFileMedicalAlt className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Báo cáo</span>
            </Link>
          </li>
          <li className={`px-3`}>
            <Link to="/laboratory_technician" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaUser className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Hồ sơ</span>
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Footer */}
      <div className="mt-auto border-t border-[#252b3b]">
        <ul className="list-none p-3 space-y-2">
          <li>
            <Link to="/help" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaQuestionCircle className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Trợ giúp</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" className="flex items-center px-4 py-3 text-[#6b7280] hover:bg-[#252b3b] hover:text-white transition-all duration-200 rounded-lg">
              <FaSignOutAlt className="text-xl mr-3" />
              <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>Đăng xuất</span>
            </Link>
          </li>
        </ul>
        <div className="flex justify-center py-3">
          <button 
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:text-white transition-all duration-200"
          >
            <FaChevronRight className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarLaboratoryTechnician;