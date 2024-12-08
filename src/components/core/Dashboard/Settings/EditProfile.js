import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/Operation/settingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit(submitProfileForm)} className="space-y-6">
        {/* Profile Information */}
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 text-richblack-5 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">
            Profile Information
          </h2>
          
          {/* Name Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="lable-style mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="text-xs text-yellow-100 mt-1">
                  Please enter your first name.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName" className="lable-style mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
                className="form-style"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="text-xs text-yellow-100 mt-1">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="lable-style mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-style"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="text-xs text-yellow-100 mt-1">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="lable-style mb-2">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="form-style"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => (
                  <option key={i} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <span className="text-xs text-yellow-100 mt-1">
                  Please select your gender.
                </span>
              )}
            </div>
          </div>

          {/* Contact and About */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col">
              <label htmlFor="contactNumber" className="lable-style mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="text-xs text-yellow-100 mt-1">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="about" className="lable-style mb-2">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                className="form-style"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="text-xs text-yellow-100 mt-1">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="w-full sm:w-auto cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="w-full sm:w-auto cursor-pointer rounded-md bg-yellow-50 py-2 px-5 font-semibold text-richblack-900"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}