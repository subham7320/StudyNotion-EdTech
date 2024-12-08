import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'
import { FiEdit } from 'react-icons/fi'

const MyProfile = () => {
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <h1 className='mb-8 text-2xl sm:text-3xl font-medium text-richblack-5'>
                My Profile
            </h1>
            
            {/* Profile Overview Section */}
            <div className='grid grid-cols-1 gap-6'>
                <div className='bg-richblack-800 border border-richblack-700 rounded-lg p-6'>
                    <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
                        <div className='flex flex-col sm:flex-row items-center gap-x-4 space-y-2 sm:space-y-0'>
                            <img 
                                src={user?.image}
                                alt={`profile-${user?.firstName}`}
                                className='w-20 h-20 sm:w-[78px] sm:h-[78px] rounded-full object-cover' 
                            />
                            <div className='text-center sm:text-left space-y-1'>
                                <p className='text-base sm:text-lg font-semibold text-richblack-5'>
                                    {user?.firstName + " " + user?.lastName}
                                </p>
                                <p className='text-xs sm:text-sm text-richblack-300 truncate max-w-[250px]'>
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <div className='w-full sm:w-auto flex justify-center sm:block'>
                            <IconBtn
                                text="Edit"
                                onclick={() => navigate("/dashboard/settings")} 
                                icon={FiEdit}
                                className='w-full sm:w-auto'
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className='bg-richblack-800 border border-richblack-700 rounded-lg p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <p className='text-base sm:text-lg font-semibold text-richblack-5'>About</p>
                        <IconBtn 
                            text="Edit"
                            onclick={() => navigate("/dashboard/settings")} 
                            icon={FiEdit}
                        />
                    </div>
                    <p className='text-sm text-richblack-400'> 
                        {user?.additionalDetails?.about ?? "Write Something about Yourself"}
                    </p>
                </div>

                {/* Personal Details Section */}
                <div className='bg-richblack-800 border border-richblack-700 rounded-lg p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <p className='text-base sm:text-lg font-semibold text-richblack-5'>Personal Details</p>
                        <IconBtn
                            text="Edit"
                            onclick={() => navigate("/dashboard/settings")} 
                            icon={FiEdit}
                        />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                            <DetailRow label="First Name" value={user?.firstName} />
                            <DetailRow label="Email" value={user?.email} />
                            <DetailRow 
                                label="Gender" 
                                value={user?.additionalDetails?.gender ?? "Add Gender"} 
                            />
                        </div>
                        <div className='space-y-4'>
                            <DetailRow label="Last Name" value={user?.lastName} />
                            <DetailRow 
                                label="Phone Number" 
                                value={user?.additionalDetails?.contactNumber ?? "Add Contact Number"} 
                            />
                            <DetailRow 
                                label="Date of Birth" 
                                value={user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Reusable detail row component
const DetailRow = ({ label, value }) => (
    <div>
        <p className='text-xs text-richblack-100 mb-1'>{label}</p>
        <p className='text-sm font-medium text-richblack-5 truncate'>{value}</p>
    </div>
)

export default MyProfile