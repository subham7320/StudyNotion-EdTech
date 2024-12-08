import React, { useEffect, useState } from 'react'
import logo from "../../Asset/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/Navbar-Link"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose} from "react-icons/ai"
import ProfileDropdown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { BsChevronDown } from "react-icons/bs"
import { ACCOUNT_TYPE } from "../../util/constants"

function Navbar() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation()
  
    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openCatalog, setOpenCatalog] = useState(false)
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API)
          setSubLinks(res.data.data)
        } catch (error) {
          console.log("Could not fetch Categories.", error)
        }
        setLoading(false)
      })()
    }, [])
  
    const matchRoute = (route) => {
      return matchPath({ path: route }, location.pathname)
    }
  
    // Toggle mobile menu
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
      // Reset catalog dropdown when closing menu
      setOpenCatalog(false)
    }

    // Close mobile menu when route changes
    useEffect(() => {
      setIsMobileMenuOpen(false)
      setOpenCatalog(false)
    }, [location.pathname])
  
    return (
      <div
        className={`flex h-14 justify-center border-b-[1px] border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
      >
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length >= 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Desktop Auth & Cart */}
          <div className="hidden items-center gap-x-4 md:flex">
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {token === null && (
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
            )}
            {token === null && (
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            )}
            {token !== null && <ProfileDropdown />}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu} 
            className="mr-4 md:hidden"
          >
            {isMobileMenuOpen ? (
              <AiOutlineClose fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            )}
          </button>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 top-14 z-[1000] bg-opacity-25 backdrop-blur-sm md:hidden">
              <div className="bg-richblack-800 text-richblack-25 w-full h-full">
                {/* Mobile Navigation Links */}
                <ul className="flex flex-col">
                  {NavbarLinks.map((link, index) => (
                    <li key={index} className="border-b border-richblack-700">
                      {link.title === "Catalog" ? (
                        <div 
                          className="flex justify-between items-center p-4 cursor-pointer"
                          onClick={() => setOpenCatalog(!openCatalog)}
                        >
                          <span>{link.title}</span>
                          <BsChevronDown 
                            className={`transition-transform ${
                              openCatalog ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                      ) : (
                        <Link 
                          to={link?.path} 
                          className="block p-4"
                          onClick={toggleMobileMenu}
                        >
                          {link.title}
                        </Link>
                      )}
                      
                      {/* Mobile Catalog Dropdown */}
                      {link.title === "Catalog" && openCatalog && (
                        <div className="bg-richblack-700">
                          {loading ? (
                            <p className="text-center p-4">Loading...</p>
                          ) : subLinks.length ? (
                            subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length >= 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  key={i}
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="block p-4 hover:bg-richblack-600"
                                  onClick={toggleMobileMenu}
                                >
                                  {subLink.name}
                                </Link>
                              ))
                          ) : (
                            <p className="text-center p-4">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                  
                  {/* Mobile Auth & Cart */}
                  <div className="p-4">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                      <Link 
                        to="/dashboard/cart" 
                        className="flex items-center gap-2 mb-4"
                        onClick={toggleMobileMenu}
                      >
                        <AiOutlineShoppingCart className="text-2xl" />
                        <span>Cart</span>
                        {totalItems > 0 && (
                          <span className="ml-2 bg-richblack-600 text-yellow-100 rounded-full px-2 py-1 text-xs">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    )}
                    {token === null && (
                      <>
                        <Link 
                          to="/login" 
                          className="block mb-4"
                          onClick={toggleMobileMenu}
                        >
                          <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-600 px-[12px] py-[8px] text-richblack-100">
                            Log in
                          </button>
                        </Link>
                        <Link 
                          to="/signup"
                          onClick={toggleMobileMenu}
                        >
                          <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-600 px-[12px] py-[8px] text-richblack-100">
                            Sign up
                          </button>
                        </Link>
                      </>
                    )}
                    {token !== null && (
                      <div className="mt-4">
                        <ProfileDropdown />
                      </div>
                    )}
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
export default Navbar