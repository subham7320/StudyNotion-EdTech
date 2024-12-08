import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/Operation/settingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data)
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 ">
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-6 md:my-10 flex flex-col gap-y-4 md:gap-y-6 rounded-md border-[1px] 
        border-richblack-700 bg-richblack-800 text-richblack-5 p-4 md:p-8 md:px-12">
          <h2 className="text-base md:text-lg font-semibold text-richblack-5">Password</h2>
          
          <div className="flex flex-col gap-4 md:gap-5 lg:flex-row">
            <div className="relative flex flex-col gap-2 w-full lg:w-[48%]">
              <label htmlFor="oldPassword" className="label-style text-sm md:text-base">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Enter Current Password"
                  className="form-style w-full pr-10"
                  {...register("oldPassword", { required: true })}
                />
                <span
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-[10] cursor-pointer"
                >
                  {showOldPassword ? (
                    <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={20} fill="#AFB2BF" />
                  )}
                </span>
              </div>
              {errors.oldPassword && (
                <span className="text-[10px] md:text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>
            
            <div className="relative flex flex-col gap-2 w-full lg:w-[48%]">
              <label htmlFor="newPassword" className="label-style text-sm md:text-base">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter New Password"
                  className="form-style w-full pr-10"
                  {...register("newPassword", { required: true })}
                />
                <span
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-[10] cursor-pointer"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={20} fill="#AFB2BF" />
                  )}
                </span>
              </div>
              {errors.newPassword && (
                <span className="text-[10px] md:text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="w-full sm:w-auto cursor-pointer rounded-md bg-richblack-700 py-2 px-5 
            font-semibold text-richblack-50 mb-2 sm:mb-0"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-yellow-50 text-richblack-900 
            rounded-md py-2 px-5 font-semibold"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}