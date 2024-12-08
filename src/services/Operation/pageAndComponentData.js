import { toast } from "react-hot-toast"

import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )
    
    if (response?.data?.success) {
      result = response.data
    } else {
      throw new Error(response?.data?.message || "Could Not Fetch Category page data.")
    }
  } catch (error) {
    console.error("CATALOGPAGEDATA_API API ERROR:", error)
    toast.error(error.message || "An unexpected error occurred")
    result = error.response?.data || { success: false, message: "Unknown error" }
  } finally {
    toast.dismiss(toastId)
  }
  return result
}
