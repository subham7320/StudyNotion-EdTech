import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  RefreshCw, 
  Star, 
  BookOpen, 
  ThumbsUp 
} from "lucide-react"
import { Player, BigPlayButton } from "video-react"
import { motion, AnimatePresence } from "framer-motion"

import { markLectureAsComplete } from "../../../services/Operation/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import CourseReviewModal from "./CourseReviewModal"
import CourseNotesModal from "./CourseNotesModal" 

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const videoContainerRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { 
    courseSectionData, 
    courseEntireData, 
    completedLectures 
  } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isHelpful, setIsHelpful] = useState(() => {
    return localStorage.getItem(`helpful-${subSectionId}`) === 'true'
  })

  // Hover and Control Visibility Logic
  useEffect(() => {
    let timer;
    if (isHovering) {
      setShowControls(true)
      timer = setTimeout(() => {
        setShowControls(false)
      }, 4000)
    }
    return () => clearTimeout(timer)
  }, [isHovering])

  // Fetch and set video data
  useEffect(() => {
    if (!courseSectionData.length) return

    const filteredData = courseSectionData.find(
      (course) => course._id === sectionId
    )
    const filteredVideoData = filteredData?.subSection.find(
      (data) => data._id === subSectionId
    )

    setVideoData(filteredVideoData)
  }, [courseSectionData, sectionId, subSectionId])

  // Navigation and video progression helpers
  const getNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndex < currentSection.subSection.length - 1) {
      const nextSubSection = currentSection.subSection[currentSubSectionIndex + 1]
      return `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection._id}`
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      const nextSection = courseSectionData[currentSectionIndex + 1]
      return `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
    }
    return null
  }

  const getPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndex > 0) {
      const prevSubSection = currentSection.subSection[currentSubSectionIndex - 1]
      return `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSection._id}`
    } else if (currentSectionIndex > 0) {
      const prevSection = courseSectionData[currentSectionIndex - 1]
      return `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSection.subSection[prevSection.subSection.length - 1]._id}`
    }
    return null
  }

  // Lecture completion handler
  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  // Player controls
  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const navigateToNextVideo = () => {
    const nextVideoPath = getNextVideo()
    if (nextVideoPath) navigate(nextVideoPath)
  }

  const navigateToPreviousVideo = () => {
    const prevVideoPath = getPreviousVideo()
    if (prevVideoPath) navigate(prevVideoPath)
  }

  // Rewatch functionality
  const handleRewatch = () => {
    if (playerRef?.current) {
      playerRef.current.seek(0)
      playerRef.current.play()
      setVideoEnded(false)
      setIsPlaying(true)
    }
  }

  // Helpful Button Handler
  const handleHelpfulClick = () => {
    const newHelpfulState = !isHelpful
    setIsHelpful(newHelpfulState)
    localStorage.setItem(`helpful-${subSectionId}`, newHelpfulState.toString())
  }

  return (
    <div className="flex flex-col md:flex-row bg-richblack-900 text-white min-h-screen">
      <div className="flex-1 p-4 md:p-6 w-full">
        <div 
          ref={videoContainerRef}
          className="relative mb-4 md:mb-6 rounded-xl overflow-hidden shadow-2xl w-full aspect-w-16 aspect-h-9"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {videoData ? (
            <Player
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setVideoEnded(true)}
              src={videoData?.videoUrl}
              className="w-full h-full"
            >
              <BigPlayButton position="center" />

              {/* Video Ended Overlay - Responsive Adjustments */}
              {videoEnded && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-50 p-4">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 items-center">
                    {/* Rewatch Button */}
                    <button 
                      onClick={handleRewatch}
                      className="flex items-center space-x-2 bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors w-full sm:w-auto justify-center"
                    >
                      <RefreshCw className="mr-2" />
                      <span>Rewatch</span>
                    </button>

                    {/* Lecture Completion */}
                    {!completedLectures.includes(subSectionId) && (
                      <button 
                        onClick={handleLectureCompletion}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-caribbeangreen-400 text-white px-4 py-2 rounded-lg hover:bg-caribbeangreen-500 transition-colors w-full sm:w-auto justify-center"
                      >
                        <CheckCircle2 className="mr-2" />
                        <span>{loading ? "Marking..." : "Mark Completed"}</span>
                      </button>
                    )}
                  </div>

                  {/* Navigation Buttons - Responsive Layout */}
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
                    {getPreviousVideo() && (
                      <button 
                        onClick={navigateToPreviousVideo}
                        className="flex items-center space-x-2 bg-richblack-700 text-white px-4 py-2 rounded-lg hover:bg-richblack-600 transition-colors w-full sm:w-auto justify-center"
                      >
                        <SkipBack className="mr-2" />
                        <span>Previous Lecture</span>
                      </button>
                    )}
                    {getNextVideo() && (
                      <button 
                        onClick={navigateToNextVideo}
                        className="flex items-center space-x-2 bg-richblack-700 text-white px-4 py-2 rounded-lg hover:bg-richblack-600 transition-colors w-full sm:w-auto justify-center"
                      >
                        <SkipForward className="mr-2" />
                        <span>Next Lecture</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Player>
          ) : (
            <div className="bg-richblack-700 h-full flex items-center justify-center">
              Loading Video...
            </div>
          )}

          {/* Conditional Controls - Mobile Friendly */}
          <AnimatePresence>
            {isHovering && showControls && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 md:px-6 py-2 flex items-center space-x-2 md:space-x-4 z-40"
              >
                <button 
                  onClick={navigateToPreviousVideo}
                  className="hover:text-yellow-50 transition-colors"
                  title="Previous Lecture"
                >
                  <SkipBack size={20}  />
                </button>
                <button 
                  onClick={togglePlay}
                  className="bg-yellow-50 text-richblack-900 rounded-full p-1 md:p-2 hover:bg-yellow-200 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button 
                  onClick={navigateToNextVideo}
                  className="hover:text-yellow-50 transition-colors"
                  title="Next Lecture"
                >
                  <SkipForward size={20}  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Details - Responsive Layout */}
        <div className="bg-richblack-800 p-4 md:p-6 rounded-xl">
          <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">{videoData?.title}</h1>
          <p className="text-richblack-200 mb-4 md:mb-6 text-sm md:text-base">{videoData?.description}</p>

          {/* Action Buttons - Responsive Flex */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => setNotesModalOpen(true)}
              className="flex items-center space-x-2 bg-richblack-700 text-richblack-25 px-4 py-2 rounded-lg hover:bg-richblack-600 transition-colors w-full sm:w-auto justify-center"
            >
              <BookOpen className="mr-2" />
              <span>Course Notes</span>
            </button>
            <button 
              onClick={handleHelpfulClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
                isHelpful 
                  ? 'bg-pink-300 text-white' 
                  : 'bg-richblack-700 text-richblack-25 hover:bg-richblack-600'
              }`}
            >
              <ThumbsUp className="mr-2" color={isHelpful ? 'white' : 'currentColor'} />
              <span>Helpful</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals Remain Unchanged */}
      {reviewModalOpen && (
        <CourseReviewModal setReviewModal={setReviewModalOpen} />
      )}

      {notesModalOpen && (
        <CourseNotesModal 
          onClose={() => setNotesModalOpen(false)} 
          videoTitle={videoData?.title || 'Lecture'}
        />
      )}
    </div>
  )
}

export default VideoDetails