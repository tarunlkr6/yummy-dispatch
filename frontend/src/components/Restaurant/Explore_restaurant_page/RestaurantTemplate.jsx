"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetRestaurantDetailsQuery } from "../../../slices/restaurantApitSlice"
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice"
import { useGetOfferByRestaurantIdQuery } from "../../../slices/offerApiSlice"
import { useGetFeedbackByRestaurantIdQuery } from "../../../slices/feedbackApiSlice"

// Import separate components
import RestaurantHeader from "./RestaurantHeader"
import RestaurantInfo from "./RestaurantInfo"
import MenuSection from "./MenuSection"
import OffersSection from "./OffersSection"
import FeedbackSection from "./FeedbackSection"
import LoadingSpinner from "./LoadingSpinner"

const RestaurantTemplate = () => {
  const { id } = useParams()
  const [restaurantData, setRestaurantData] = useState(null)

  // API queries
  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } = useGetRestaurantDetailsQuery(id)
  const { data: menu, isLoading: menuLoading } = useGetMenuByRestaurantIdQuery(id)
  const { data: offers, isLoading: offersLoading } = useGetOfferByRestaurantIdQuery(id)
  const { data: feedback, isLoading: feedbackLoading, refetch: refetchFeedback } = useGetFeedbackByRestaurantIdQuery(id)

  // Process data when all APIs return
  useEffect(() => {
    if (restaurant && menu && offers && feedback) {
      setRestaurantData({
        info: {
          id: restaurant.data._id,
          name: restaurant.data.name,
          address: restaurant.data.address,
          phone: restaurant.data.phoneNumber,
          email: restaurant.data.email,
          hours: `${restaurant.data.openingTime} - ${restaurant.data.closingTime}`,
          isOpen: restaurant.data.isOpen,
          description: restaurant.data.description,
          avatar: restaurant.data.avatar,
          rating: restaurant.data.rating || 4.5,
        },
        menu: menu.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          images: item.image,
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        })),
        offers: offers.data.map((offer) => ({
          id: offer._id,
          name: offer.offerName,
          description: offer.offerDescription,
          image: offer.offerImage,
        })),
        feedback: feedback.data.map((fb) => ({
          id: fb._id,
          name: fb.name,
          comment: fb.review,
          rating: fb.rating,
          createdAt: fb.createdAt,
        })),
      })
    }
  }, [restaurant, menu, offers, feedback])

  // Loading state
  if (restaurantLoading || menuLoading || offersLoading || feedbackLoading || !restaurantData) {
    return <LoadingSpinner />
  }

  // Error state
  if (restaurantError) {
    toast.error("Failed to load restaurant details")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header with Hero Image - Full Width */}
      <RestaurantHeader restaurant={restaurantData.info} />

      {/* Main Content Container - Consistent Width */}
      <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8 mx-auto">
        {/* Restaurant Info Section */}
        <RestaurantInfo restaurant={restaurantData.info} />

        {/* Menu Section */}
        <MenuSection menu={restaurantData.menu} restaurantId={id} />

        {/* Offers Section */}
        {restaurantData.offers.length > 0 && <OffersSection offers={restaurantData.offers} />}

        {/* Feedback Section */}
        <FeedbackSection feedback={restaurantData.feedback} restaurantId={id} onFeedbackUpdate={refetchFeedback} />
      </div>
    </div>
  )
}

export default RestaurantTemplate