import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ChipInput = ({name, label, register, errors, setValue}) => {
    const [tags, setTags] = useState([])
    const {editCourse, course} = useSelector((state) => state.course);

    useEffect(() => {
        register(name, {
            required: true,
        });

        if (editCourse) {
            // Safely handled tag parsing
            let courseTags = [];
            try {
                // First try parsing as JSON
                if (course?.tag && typeof course.tag === 'string') {
                    courseTags = JSON.parse(course.tag);
                }
                // If parsing fails, or tag is already an array, use it directly
                if (!Array.isArray(courseTags)) {
                    // If it's a string but not valid JSON, split it
                    courseTags = course.tag ? course.tag.split(',').map(tag => tag.trim()) : [];
                }
            } catch (error) {
                // If JSON parsing fails, try splitting the string
                courseTags = course.tag ? course.tag.split(',').map(tag => tag.trim()) : [];
            }

            setTags(courseTags);
            setValue(name, courseTags);
        }
    }, [editCourse, course, name, register, setValue])

    return (
        <div>
            <label className='text-sm text-richblack-5' htmlFor={name}>
                {label}<sup className='text-pink-200'>*</sup>
            </label>
            <div className='flex flex-wrap gap-2 m-2'>
                {tags.map((tag, index) => (
                    <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                        <span className='text-richblack-5'>{tag}</span>
                        <button
                            type='button'
                            onClick={() => {
                                const updatedTags = [...tags];
                                updatedTags.splice(index, 1);
                                setTags(updatedTags);
                                setValue(name, updatedTags);
                            }}
                            className='ml-2 text-richblack-5'>
                            <FaTimes/>
                        </button>
                    </div>
                ))}
            </div>
            <input
                type='text'
                id={name}
                placeholder='Press Enter or , to add a tag'
                className='form-style w-full'
                onKeyDown={(e) => {
                    if(e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if(e.target.value.trim()) {
                            const newTags = [...tags, e.target.value.trim()];
                            setTags(newTags);
                            setValue(name, newTags);
                            e.target.value = "";
                        }
                    }
                }}
            />
            {errors[name] && <span className='text-xs text-pink-200'>Tags are required</span>}
        </div>
    )
}

export default ChipInput;