"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Gift } from "lucide-react"

const OffersSection = ({ offers }) => {
  const [currentOffer, setCurrentOffer] = useState(0)

  const nextOffer = () => {
    setCurrentOffer((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Gift className="w-6 h-6 text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-800">Special Offers</h2>
      </div>

      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        {/* Offer Display */}
        <div className="relative h-64 md:h-80">
          <img
            src={offers[currentOffer].image || "/placeholder.svg?height=300&width=600&text=Special+Offer"}
            alt={offers[currentOffer].name}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{offers[currentOffer].name}</h3>
              <p className="text-lg opacity-90">{offers[currentOffer].description}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          {offers.length > 1 && (
            <>
              <button
                onClick={prevOffer}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextOffer}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {offers.length > 1 && (
          <div className="flex justify-center space-x-2 py-4">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOffer(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentOffer ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OffersSection
