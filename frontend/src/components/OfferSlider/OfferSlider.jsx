import { useState, useEffect, useCallback } from "react"
import { offer_list } from "../../assets/assets"

// Simulating an API call to fetch offers
const fetchOffers = async () => {
  throw new Error("Failed to fetch offers")
}

const OfferSlider = () => {
  const [offers, setOffers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Load offers on component mount
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setIsLoading(true)
        const fetchedOffers = await fetchOffers()
        setOffers(fetchedOffers)
      } catch (error) {
        console.error("Failed to fetch from backend, using local data", error)
        setError(error)

        // Convert offer_list to array format
        const localOffers = Object.entries(offer_list)
          .filter(([key, value]) => value !== undefined)
          .map(([key, value]) => ({
            id: key,
            imageUrl: value,
            alt: `Special Offer ${key}`,
          }))

        setOffers(localOffers)
      } finally {
        setIsLoading(false)
      }
    }

    loadOffers()
  }, [])

  // Get slides per view based on screen size and total offers
  const getSlidesPerView = () => {
    if (typeof window !== "undefined") {
      const totalOffers = offers.length
      if (window.innerWidth >= 1024) {
        // Desktop: show 3 cards, but if we have fewer offers, show all
        return Math.min(3, totalOffers)
      }
      if (window.innerWidth >= 768) {
        // Tablet: show 2 cards, but if we have fewer offers, show all
        return Math.min(2, totalOffers)
      }
      // Mobile: show 1 card
      return 1
    }
    return Math.min(3, offers.length)
  }

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView())

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [offers.length])

  // Update slidesPerView when offers change
  useEffect(() => {
    setSlidesPerView(getSlidesPerView())
  }, [offers.length])

  // Navigation functions with improved logic
  const goToNext = useCallback(() => {
    if (isTransitioning || offers.length === 0) return

    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      // Calculate how many slides we can actually move
      const maxIndex = Math.max(0, offers.length - slidesPerView)
      if (prevIndex >= maxIndex) {
        return 0 // Loop back to start
      }
      return prevIndex + 1
    })

    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning, offers.length, slidesPerView])

  const goToPrev = useCallback(() => {
    if (isTransitioning || offers.length === 0) return

    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, offers.length - slidesPerView)
      if (prevIndex <= 0) {
        return maxIndex // Loop to end
      }
      return prevIndex - 1
    })

    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning, offers.length, slidesPerView])

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return

      setIsTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 300)
    },
    [isTransitioning, currentIndex],
  )

  // Auto-play functionality
  useEffect(() => {
    if (offers.length <= slidesPerView) return

    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [offers.length, slidesPerView, goToNext])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <span className="ml-2 text-gray-600">Loading offers...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error && offers.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-600 text-center">Error loading offers. Please try again later.</p>
      </div>
    )
  }

  // No offers state
  if (offers.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-gray-500 text-center">No offers available at the moment.</p>
      </div>
    )
  }

  const maxIndex = Math.max(0, offers.length - slidesPerView)
  const showNavigation = offers.length > slidesPerView

  // Calculate the width percentage for each slide to fill the container properly
  const slideWidth = 100 / slidesPerView

  return (
    <div className="relative w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Special Offers</h2>
        {showNavigation && (
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * slideWidth}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {offers.map((offer, index) => (
            <div key={offer.id} className="flex-shrink-0 px-2" style={{ width: `${slideWidth}%` }}>
              <div className="relative group cursor-pointer h-full">
                <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-200 shadow-lg">
                  <img
                    src={offer.imageUrl || "/placeholder.svg?height=200&width=400&text=Special+Offer"}
                    alt={offer.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                </div>

                {/* Offer Badge */}
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Special Offer
                </div>

                {/* Optional: Add offer title/description */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-semibold text-gray-800 truncate">Limited Time Offer</p>
                  <p className="text-xs text-gray-600">Save up to 50% on selected items</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {showNavigation && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-orange-500 w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {/* {showNavigation && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
          />
        </div>
      )} */}

      {/* Show all offers in a grid if there are few offers */}
      {offers.length <= 3 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div key={`grid-${offer.id}`} className="relative group cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-200 shadow-lg">
                  <img
                    src={offer.imageUrl || "/placeholder.svg?height=200&width=400&text=Special+Offer"}
                    alt={offer.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                </div>
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Special Offer
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OfferSlider
