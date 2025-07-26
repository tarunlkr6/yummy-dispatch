"use client"

import { Phone, Mail, MapPin } from "lucide-react"

const RestaurantInfo = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">About {restaurant.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div>
          <p className="text-gray-600 leading-relaxed mb-4">
            {restaurant.description || "Welcome to our restaurant! We serve delicious food with love and care."}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>

          <div className="flex items-center space-x-3 text-gray-600">
            <Phone className="w-5 h-5 text-[#ff6347]" />
            <span>{restaurant.phone}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5 text-[#ff6347]" />
            <span>{restaurant.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="w-5 h-5 text-[#ff6347]" />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantInfo
