import { useState } from "react"
import { useDispatch } from "react-redux"
import { addToCart } from "../../../slices/cartSlice"
import { ShoppingCart, Leaf, IndianRupee } from "lucide-react"

const MenuSection = ({ menu, restaurantId }) => {
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get unique categories
  const categories = ["all", ...new Set(menu.map((item) => item.category))]

  // Filter menu items
  const filteredMenu = selectedCategory === "all" ? menu : menu.filter((item) => item.category === selectedCategory)

  const handleAddToCart = (item) => {
    dispatch(addToCart({ item, qty: 1 }))
  }

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category ? "bg-[#ff6347] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0].url || "/placeholder.svg?height=200&width=300&text=Food+Item"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No Image</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <div className="flex items-center space-x-2">
                  {item.isVeg && <Leaf className="w-4 h-4 text-green-500" />}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#ff6347]">₹{item.price.toFixed(2)}</span>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.isAvailable
                      ? "bg-[#ff6347] text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {/* <ShoppingCart className="w-4 h-4" /> */}
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default MenuSection
