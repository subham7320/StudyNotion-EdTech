import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/Operation/settingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-x-4 w-full">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-20 h-20 sm:w-[78px] sm:h-[78px] rounded-full object-cover mb-4 sm:mb-0"
          />
          <div className="text-center sm:text-left w-full">
            <p className="text-richblack-5 mb-2">Change Profile Picture</p>
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleClick}
                  disabled={loading}
                  className="w-full sm:w-auto cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                >
                  Select
                </button>
                <IconBtn
                  text={loading ? "Uploading..." : "Upload"}
                  onclick={handleFileUpload}
                  className="w-full sm:w-auto"
                >
                  {!loading && (
                    <FiUpload className="text-lg text-richblack-900" />
                  )}
                </IconBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}