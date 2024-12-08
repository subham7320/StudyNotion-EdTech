import React from 'react'
import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/Operation/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CourseTable"
//import toast from 'react-hot-toast'
import { toast as sonnerToast } from 'sonner'

const MyCourses = () => {
    const navigate = useNavigate();
    const {token} = useSelector((state) => state.auth);
    const [courses, setCourses] = React.useState(null);    
    const fetchedCourses = async ()=>{ 
        const result = await fetchInstructorCourses(token);
        if(result){
            setCourses(result);
        }
        }

    useEffect(() => {
        fetchedCourses();
    },[])

    const handleNavigate = () => {
        const loadingToast = sonnerToast.loading('Loading...', {
            description: 'Please wait while we redirect you.',
        });
    
        try {
            setTimeout(() => {
                navigate("/dashboard/add-course");
                sonnerToast.dismiss(loadingToast);
            }, 1000); 
        } catch (error) {
            
            sonnerToast.dismiss(loadingToast);
            sonnerToast.error('Navigation failed', {
                description: 'Unable to redirect to course creation page.'
            });
        }
    }
  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <div>
            <div className='mb-14 flex items-center justify-between'>
                <h1 className='text-3xl font-medium text-richblack-5' >My Courses</h1>
                <IconBtn onclick={handleNavigate}
                text="Add Course"
                icon={VscAdd}
                >
                </IconBtn>
            </div>
            <div>
            {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
            </div>
        </div>
    </div>
  )
}

export default MyCourses