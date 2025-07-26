import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Star, MessageSquare, User } from "lucide-react"
import { useCreateReviewMutation } from "../../../slices/restaurantApitSlice"
import ChefProfile from "./ChefProfile"

const FeedbackSection = ({ feedback, restaurantId, onFeedbackUpdate }) => {
  const { userInfo } = useSelector((state) => state.auth)
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  // Auto-scroll carousel
  useEffect(() => {
    if (feedback.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % feedback.length)
      }, 4000) // Change review every 4 seconds

      return () => clearInterval(interval)
    }
  }, [feedback.length])

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment")
      return
    }

    try {
      await createReview({
        restaurantId,
        data: { rating, review: comment },
      }).unwrap()

      toast.success("Review submitted successfully!")
      setRating(0)
      setComment("")
      onFeedbackUpdate()
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review")
    }
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center space-x-2 mb-8">
        <MessageSquare className="w-8 h-8 text-orange-500" />
        <h2 className="text-4xl font-bold text-gray-800">What Our Customers Say</h2>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Reviews Carousel */}
        <div className="mb-12">
          {feedback.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentReviewIndex * 100}%)`,
                  }}
                >
                  {feedback.map((review, index) => (
                    <div key={review.id} className="w-full flex-shrink-0">
                      <div className="p-8 md:p-12 text-center">
                        {/* User Avatar */}
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="max-w-3xl mx-auto">
                          <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                            "{review.comment}"
                          </p>

                          {/* Rating Stars */}
                          <div className="flex justify-center items-center space-x-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Reviewer Info */}
                          <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-800">{review.name}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {feedback.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex ? "bg-orange-500 w-8" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              {/* <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300 ease-out"
                  style={{ width: `${((currentReviewIndex + 1) / feedback.length) * 100}%` }}
                />
              </div> */}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 text-lg">Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/** Chef section */}
        <ChefProfile/>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Share Your Experience</h3>
            <p className="text-gray-600">Help others discover this amazing place</p>
          </div>

          {userInfo ? (
            <form onSubmit={handleSubmitReview} className="max-w-2xl mx-auto space-y-6">
              {/* Rating Section */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-gray-800 mb-4">How was your experience?</label>
                <div className="flex justify-center items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Comment Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Tell us more about your visit</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your experience, food quality, service, ambiance..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-700 placeholder-gray-400"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">Minimum 10 characters</span>
                  <span className="text-sm text-gray-500">{comment.length}/500</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={reviewLoading || !rating || comment.trim().length < 10}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {reviewLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Join the Conversation</h3>
              <p className="text-gray-600 mb-6 text-lg">Sign in to share your dining experience</p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackSection
