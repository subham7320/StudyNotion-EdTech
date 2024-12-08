import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack, IoIosMenu } from "react-icons/io"
import {MdOutlineMenuOpen} from "react-icons/md"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Star, X } from "lucide-react"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Close mobile sidebar when a subsection is selected
  const handleSubSectionSelect = (course, topic) => {
    navigate(
      `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
    )
    setVideoBarActive(topic._id)
    setIsMobileSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile Header - Fixed at Top */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-richblack-800 z-50 flex items-center justify-between p-4 shadow-md">
        <button 
          onClick={() => navigate(`/dashboard/enrolled-courses`)}
          className="flex items-center justify-center rounded-full bg-richblack-100 p-2 text-richblack-700 hover:scale-90"
          title="Back"
        >
          <IoIosArrowBack size={24} />
        </button>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setReviewModal(true)}
            className="flex items-center space-x-2 bg-richblack-700 text-richblack-25 px-3 py-2 rounded-lg hover:bg-richblack-600 transition-colors"
          >
            <Star size={18} />
            <span className="text-sm">Review</span>
          </button>
          
          <button 
            onClick={toggleMobileSidebar}
            className="text-richblack-200"
            title="Course Sections"
          >
            <MdOutlineMenuOpen size={28} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <button 
              onClick={() => setReviewModal(true)}
              className="flex items-center space-x-2 bg-richblack-700 text-richblack-25 px-4 py-2 rounded-lg hover:bg-richblack-600 transition-colors"
            >
              <Star />
              <span>Add Review</span>
            </button>
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(course?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      activeStatus === course?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar - Sliding Drawer */}
      <div 
        className={`md:hidden fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-richblack-800`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-richblack-600 ">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-richblack-25">
              {courseEntireData?.courseName}
            </p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
          <button 
            onClick={toggleMobileSidebar} 
            className="text-white p-2 bg-richblack-700 rounded-full absolute bottom-4 right-5"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Sidebar Content - Scrollable */}
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              key={index}
            >
              {/* Section Header */}
              <div 
                className="flex flex-row justify-between bg-richblack-600 px-5 py-4"
                onClick={() => setActiveStatus(course?._id === activeStatus ? '' : course?._id)}
              >
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      activeStatus === course?._id
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3 px-5 py-3 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                      key={i}
                      onClick={() => handleSubSectionSelect(course, topic)}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile padding for content under header */}
      <div className="md:hidden h-[64px]"></div>
    </>
  )
}