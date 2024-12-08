import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { VscSignOut } from "react-icons/vsc"
import SidebarLink from './SidebarLink'
import { sidebarLinks } from "../../../data/Dashboard-Link"
import { logout } from "../../../services/Operation/authAPI"
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = ({ isMobile = false, onClose }) => {
    const { user, loading: profileLoading } = useSelector(
        (state) => state.profile
    )
    const { loading: authLoading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [confirmationModal, setConfirmationModal] = React.useState(null)

    if (profileLoading || authLoading) {
        return (
            <div className={`
                grid h-[calc(100vh-3.5rem)] 
                ${isMobile ? 'w-full' : 'min-w-[220px]'} 
                items-center border-r-[1px] border-r-richblack-700 bg-richblack-800
            `}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <>
            <div className={`
                flex flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10
                ${isMobile 
                    ? 'h-[70vh] w-full rounded-t-xl overflow-y-auto' 
                    : 'h-[calc(100vh-3.5rem)] min-w-[220px]'
                }
            `}>
                {isMobile && (
                    <button 
                        onClick={onClose} 
                        className="self-end mr-4 mb-4 text-richblack-300"
                    >
                        Close
                    </button>
                )}
                <div className='flex flex-col '>
                    {sidebarLinks.map((link)=>{
                        if (link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink 
                                key={link.id} 
                                link={link} 
                                iconName={link.icon} 
                                onClick={isMobile ? onClose : undefined}
                            />
                        )
                    })}
                </div>

                <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

                <div className='flex flex-col '>
                    <SidebarLink 
                        link={{name:"Settings", path:"/dashboard/settings"}} 
                        iconName="VscSettingsGear" 
                        onClick={isMobile ? onClose : undefined}
                    />
                    <button 
                        onClick={()=> {
                            setConfirmationModal({
                                text1: "Are you sure?",
                                text2: "You will be logged out of your account.",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                btn1Handler: ()=> {
                                    dispatch(logout(navigate));
                                    if(isMobile) onClose();
                                },
                                btn2Handler: ()=> setConfirmationModal(null),
                            })
                        }}
                        className="px-8 py-2 text-sm font-medium text-richblack-300"
                    >
                        <div className="flex items-center gap-x-2">
                            <VscSignOut className="text-lg" />
                            <span>Logout</span>
                        </div>
                    </button>
                </div>
            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
        </>
    )
}

export default Sidebar