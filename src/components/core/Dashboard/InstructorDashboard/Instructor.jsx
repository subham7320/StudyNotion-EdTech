import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../../services/Operation/courseDetailsAPI"
import { getInstructorData } from "../../../../services/Operation/profileAPI"
import InstructorChart from "./InstructorChart"

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        const instructorApiData = await getInstructorData(token)
        const result = await fetchInstructorCourses(token)
        if (instructorApiData.length) setInstructorData(instructorApiData)
        if (result) {
          setCourses(result)
        }
        setLoading(false)
      })()
    }, [])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + curr.totalAmountGenerated,
      0
    )
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + curr.totalStudentsEnrolled,
      0
    )
  
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-richblack-5">
            Hi {user?.firstName} 👋
          </h1>
          <p className="font-medium text-richblack-200 text-sm md:text-base">
            Let's start something new
          </p>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : courses.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="rounded-md bg-richblack-800 p-4 md:p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50 text-center">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
              
              {/* Total Statistics */}
              <div className="rounded-md bg-richblack-800 p-4 md:p-6">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>
                <div className="mt-4 grid grid-cols-3 gap-4 md:space-y-4">
                  <div className="text-center">
                    <p className="text-sm md:text-lg text-richblack-200">Courses</p>
                    <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                      {courses.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm md:text-lg text-richblack-200">Students</p>
                    <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                      {totalStudents}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm md:text-lg text-richblack-200">Income</p>
                    <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                      Rs. {totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Your Courses Section */}
            <div className="rounded-md bg-richblack-800 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50">View All</p>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="bg-richblack-700 rounded-md overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-[150px] md:h-[201px] object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-richblack-50 truncate">
                        {course.courseName}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-richblack-300">
                        <p>{course.studentsEnroled.length} students</p>
                        <p>Rs. {course.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20 text-center">
            <p className="text-xl md:text-2xl font-bold text-richblack-5">
              You have not created any courses yet
            </p>
            <Link to="/dashboard/add-course">
              <p className="mt-4 text-lg font-semibold text-yellow-50">
                Create a course
              </p>
            </Link>
          </div>
        )}
      </div>
    )
}
