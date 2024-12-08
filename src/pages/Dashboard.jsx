import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";

const Dashboard = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const {loading:authLoading} = useSelector( (state) => state.auth);
    const {loading:profileLoading} = useSelector( (state) => state.profile);

    if (profileLoading || authLoading) {
      return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      )
    }
  
    return (
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-[30px] transform  z-50 bg-richblack-700 text-white p-2 rounded-full shadow-lg"
        >
          {isMobileSidebarOpen ? <RiMenuFoldLine /> : <RiMenuUnfoldLine />}
        </button>

        {/* Mobile Sidebar */}
        <div className={`
          lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <Sidebar isMobile={true} onClose={() => setIsMobileSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto ">
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <Outlet />
          </div>
        </div>

        {/* Overlay for Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </div>
    )
  }

export default Dashboard