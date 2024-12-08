import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/Operation/settingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-center gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-6 sm:p-8">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-pink-700 mb-4 sm:mb-0">
          <FiTrash2 className="text-2xl sm:text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2 w-full text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="text-sm text-pink-25 max-w-full sm:w-4/5">
            <p className="mb-2">Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-full sm:w-fit mt-4 cursor-pointer italic text-pink-300 hover:text-pink-200 transition-colors"
            onClick={handleDeleteAccount}
          >
            I want to delete my account.
          </button>
        </div>
      </div>
    </div>
  )
}