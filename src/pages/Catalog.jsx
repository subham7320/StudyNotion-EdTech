import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Footer from "../components/common/Footer"
import CourseCard from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/CourseSlider"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/Operation/pageAndComponentData"
import Error from "./Error"

function Catalog() {
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch All Categories
  useEffect(()=> {
    const getCategories = async() => {
        setLoading(true)
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const category_id = 
        res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
        setCategoryId(category_id);
    }
    getCategories();
  },[catalogName]);

  useEffect(() => {
    const getCategoryDetails = async() => {
        setLoading(true)
        try{
            const res = await getCatalogPageData(categoryId);
            console.log("Printing res: ", res);
            
            // Add additional checks
            if (res && res.success) {
                setCatalogPageData(res);
            } else {
                console.error("Failed to fetch catalog page data:", res);
            }
        }
        catch(error){
            console.error("Error fetching category details:", error);
        }
        finally {
            setLoading(false);
        }
    }
    
    if(categoryId){
        getCategoryDetails();
    }
  }, [categoryId]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4 sm:px-6 md:px-8">
        <div className="mx-auto flex min-h-[260px] max-w-full flex-col justify-center gap-4 px-4 sm:px-6 md:max-w-maxContentTab lg:max-w-maxContent lg:px-8">
          <p className="text-xs sm:text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-2xl sm:text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="text-sm sm:text-base max-w-full sm:max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mx-auto box-content w-full max-w-full px-4 py-8 sm:px-6 md:max-w-maxContentTab md:px-8 lg:max-w-maxContent lg:py-12">
        <div className="section_heading text-xl sm:text-2xl">Courses to get you started</div>
        <div className="my-2 sm:my-4 flex border-b border-b-richblack-600 text-xs sm:text-sm">
          <p
            className={`px-2 sm:px-4 py-1 sm:py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-2 sm:px-4 py-1 sm:py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div className="w-full overflow-x-auto">
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="mx-auto box-content w-full max-w-full px-4 py-8 sm:px-6 md:max-w-maxContentTab md:px-8 lg:max-w-maxContent lg:py-12">
        <div className="section_heading text-xl sm:text-2xl">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-4 sm:py-8 w-full overflow-x-auto">
          <CourseSlider
            Courses={catalogPageData?.data?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto box-content w-full max-w-full px-4 py-8 sm:px-6 md:max-w-maxContentTab md:px-8 lg:max-w-maxContent lg:py-12">
        <div className="section_heading text-xl sm:text-2xl">Frequently Bought</div>
        <div className="py-4 sm:py-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <CourseCard 
                  course={course} 
                  key={i} 
                  Height={"h-[300px] sm:h-[350px] md:h-[400px]"} 
                />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog