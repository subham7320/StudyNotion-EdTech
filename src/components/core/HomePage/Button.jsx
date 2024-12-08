import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children, active, linkto}) => {
  return (
    <Link to={linkto} >
        <div className={`text-center text-[13px] sm:text-[16px]  px-8 py-3 rounded-md text-lg hover:scale-95 transition-all duration-200
            ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"} border-b-2 border-r-2 border-blue-300
             `}>
            {children}
        </div>
    </Link>
  )
}

export default Button