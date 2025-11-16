
import { useState } from "react"
import { useBookTableMutation } from "../../../slices/bookTableApiSlice"
import { toast } from "react-toastify"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, ArrowLeft } from "lucide-react"

const TableBooking = ({ isDarkMode = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bookTable, { isLoading }] = useBookTableMutation()

  const [formData, setFormData] = useState({
    name: "",
    reservationDate: "",
    reservationTime: "",
    numGuests: "",
    specialRequests: "",
    contactPhone: "",
    contactEmail: "",
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target ? event.target : event
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const bookTableHandler = async (e) => {
    e.preventDefault()
    try {
      const bookResponse = await bookTable({ id, ...formData }).unwrap()
      toast.success("Table booked successfully!")
      // Reset form fields
      setFormData({
        name: "",
        reservationDate: "",
        reservationTime: "",
        numGuests: "",
        specialRequests: "",
        contactPhone: "",
        contactEmail: "",
      })
      navigate(`/table/details`)
    } catch (error) {
      console.error("Booking error:", error)
      if (error.status === "PARSING_ERROR" && error.originalStatus === 500) {
        if (error.data.includes("E11000 duplicate key error")) {
          toast.error("You already have a booking for this date. Please choose a different date.")
        } else if (error.data.includes("Cast to date failed")) {
          toast.error("Invalid date format. Please use DD/MM/YYYY format.")
        } else {
          toast.error("An unexpected error occurred. Please try again later.")
        }
      } else {
        toast.error(error.data?.message || "Failed to book the table. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link to="/">
            <button className="inline-flex items-center space-x-2 mb-6 px-6 py-3 bg-white border-2 border-[#ff6347] text-[#ff6347] rounded-full hover:bg-[#ff6347] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Go Back</span>
            </button>
          </Link>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-[#ff6347]">
            <div className="w-20 h-20 bg-gradient-to-r from-[#ff6347] to-[#ff4500] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Reserve Your Table</h1>
            <p className="text-gray-600 text-lg">Experience exceptional dining with us</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={bookTableHandler}>
            {/* Personal Information Section */}
            <div className="border-l-4 border-[#ff6347] pl-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 text-[#ff6347] mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                    <input
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                    <input
                      name="contactEmail"
                      onChange={handleInputChange}
                      value={formData.contactEmail}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                    <input
                      name="contactPhone"
                      onChange={handleInputChange}
                      value={formData.contactPhone}
                      type="tel"
                      placeholder="+91 012-3456789"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Details Section */}
            <div className="border-l-4 border-[#ff4500] pl-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-[#ff4500] mr-2" />
                Reservation Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Number of Guests field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347] z-10" />
                    <select
                      name="numGuests"
                      value={formData.numGuests}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select guests</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Reservation Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347] z-10" />
                    <input
                      name="reservationDate"
                      onChange={handleInputChange}
                      value={formData.reservationDate}
                      type="date"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Time Slot field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347] z-10" />
                    <select
                      name="reservationTime"
                      onChange={handleInputChange}
                      value={formData.reservationTime}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select time</option>
                      {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "20:00", "21:00"].map(
                        (time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests Section */}
            <div className="border-l-4 border-[#dc2626] pl-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-[#dc2626] mr-2" />
                Special Requests
              </h3>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Additional Information (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-[#ff6347]" />
                  <textarea
                    name="specialRequests"
                    onChange={handleInputChange}
                    value={formData.specialRequests}
                    placeholder="Any dietary requirements, special occasions, or other requests?"
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-14 overflow-hidden bg-gradient-to-r from-[#ff6347] to-[#ff4500] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4500] to-[#dc2626] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking Your Table...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-6 h-6" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-[#ff6347]/20">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-semibold text-[#ff6347]">Note:</span> Your reservation will be confirmed within 15
                minutes. You'll receive a confirmation email shortly.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TableBooking
