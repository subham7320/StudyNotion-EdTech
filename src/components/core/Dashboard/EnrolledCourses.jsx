import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/Operation/profileAPI';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';

export default function EnrolledCourses() {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
  
    const [enrolledCourses, setEnrolledCourses] = useState(null)
  
    useEffect(() => {
      ;(async () => {
        try {
          const res = await getUserEnrolledCourses(token)
          const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
          setEnrolledCourses(filterPublishCourse)
        } catch (error) {
          console.log("Could not fetch enrolled courses.")
        }
      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl text-richblack-50 mb-4">Enrolled Courses</h2>
        {!enrolledCourses ? (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : !enrolledCourses.length ? (
          <p className="grid h-[10vh] w-full place-content-center text-richblack-5 text-center">
            You have not enrolled in any course yet.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            {/* Desktop View */}
            <div className="hidden md:block my-8 text-richblack-5">
              {/* Headings */}
              <div className="flex rounded-t-lg bg-richblack-500">
                <p className="w-[45%] px-5 py-3">Course Name</p>
                <p className="w-1/4 px-2 py-3">Duration</p>
                <p className="flex-1 px-2 py-3">Progress</p>
              </div>
              {/* Course Names */}
              {enrolledCourses.map((course, i, arr) => (
                <div
                  className={`flex items-center border border-richblack-700 ${
                    i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                  }`}
                  key={i}
                >
                  <div
                    className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                    onClick={() => {
                      navigate(
                        `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                      )
                    }}
                  >
                    <img
                      src={course.thumbnail}
                      alt="course_img"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex max-w-xs flex-col gap-2">
                      <p className="font-semibold">{course.courseName}</p>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.length > 50
                          ? `${course.courseDescription.slice(0, 50)}...`
                          : course.courseDescription}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                  <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                    <p>Progress: {course.progressPercentage || 0}%</p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 my-8">
              {enrolledCourses.map((course, i) => (
                <div 
                  key={i} 
                  className="bg-richblack-700 rounded-lg p-4 shadow-md"
                  onClick={() => {
                    navigate(
                      `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                    )
                  }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={course.thumbnail}
                      alt="course_img"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="text-richblack-5 font-semibold">{course.courseName}</h3>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.length > 50
                          ? `${course.courseDescription.slice(0, 50)}...`
                          : course.courseDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-richblack-200">Duration: {course?.totalDuration}</div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-richblack-100 mb-1">
                        Progress: {course.progressPercentage || 0}%
                      </p>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        height="8px"
                        width="120px"
                        isLabelVisible={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
}