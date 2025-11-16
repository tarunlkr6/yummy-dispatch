import { Star } from 'lucide-react'
import React from 'react'

const ChefProfile = () => {
  return (
    <div>
        {/* Chef Profiles Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Meet Our Master Chefs</h3>
            <p className="text-gray-600 text-lg">The culinary artists behind your amazing dining experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chef 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Chef+Marco"
                  alt="Chef Marco Rodriguez"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-bold">Chef Marco Rodriguez</h4>
                  <p className="text-sm opacity-90">Head Chef</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">15+ years experience</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Specializes in Mediterranean cuisine with a modern twist. Winner of multiple culinary awards and
                  featured in top food magazines.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Italian
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Seafood
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Pasta
                  </span>
                </div>
              </div>
            </div>

            {/* Chef 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Chef+Sarah"
                  alt="Chef Sarah Chen"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-bold">Chef Sarah Chen</h4>
                  <p className="text-sm opacity-90">Pastry Chef</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">12+ years experience</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Master of French pastry techniques and innovative dessert creations. Trained at Le Cordon Bleu and
                  worked in Michelin-starred restaurants.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Desserts
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    French
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Bakery
                  </span>
                </div>
              </div>
            </div>

            {/* Chef 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Chef+David"
                  alt="Chef David Thompson"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-bold">Chef David Thompson</h4>
                  <p className="text-sm opacity-90">Grill Master</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">18+ years experience</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Expert in BBQ and grilled specialties with a focus on premium cuts and authentic smoking techniques.
                  Known for signature marinades and rubs.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">BBQ</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Steaks
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Grilling
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ChefProfile