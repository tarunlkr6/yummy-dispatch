"use client"

import { Link } from "react-router-dom"
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react"

const RestaurantHeader = ({ restaurant }) => {
  return (
    <div className="relative h-96 bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${restaurant.avatar || "/placeholder.svg?height=400&width=800&text=Restaurant"})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Restaurant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{restaurant.name}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{restaurant.hours}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
