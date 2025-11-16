import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ArrowLeft, User, Mail, Lock, Shield, Building2, CheckCircle } from "lucide-react"
import { useVerifyUserByOtpMutation } from "../../slices/usersApiSlice"

function Partner() {
  const navigate = useNavigate()
  //const url = 'https://scan-dine-backend-5qms.onrender.com/api/v1/user';
  const url = "http://localhost:8080/api/v1/user"

  const [currentStep, setCurrentStep] = useState("register") // 'register' or 'otp'
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verifyUserByOtp, { isLoading: otpLoading }] = useVerifyUserByOtpMutation()

  // Refs for OTP inputs
  const otpRefs = useRef([])

  // State for user data input
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    isAdmin: true,
  })

  // Handle input change for form fields
  const handleInputChange = (event) => {
    const fieldName = event.target.name
    const newValue = event.target.value
    setData((currentData) => ({
      ...currentData,
      [fieldName]: newValue,
    }))
  }

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6)
      setOtp(newOtp)

      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5)
      otpRefs.current[nextIndex]?.focus()
    }
  }

  // Submit handler for registration
  const submitHandler = async (event) => {
    event.preventDefault()

    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(`${url}/register`, data)
      if (res.data.success) {
        toast.success("Registration successful! Please verify your email with the OTP sent to you.")
        setUserEmail(data.email)
        setCurrentStep("otp")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }


  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {

      const res = await verifyUserByOtp({
        email: userEmail,
        code: otpString,
      }).unwrap()

      if (res.success) {
        toast.success("Email verified successfully! Redirecting to admin panel...")
        setTimeout(() => {
          window.location.href = "https://scan-dine-admin.onrender.com"
        }, 2000)

        // Reset all states
        setCurrentStep("register")
        setOtp(["", "", "", "", "", ""])
        setData({
          fullName: "",
          email: "",
          password: "",
          isAdmin: true,
        })
        setConfirmPassword("")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const resendOtp = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${url}/resend-otp`, { email: userEmail })
      if (res.data.success) {
        toast.success("OTP resent to your email")
        setOtp(["", "", "", "", "", ""])
      }
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        {/* Header */}
        <div className="pt-8 pb-4 px-4">
          <Link to="/">
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-[#ff6347] text-[#ff6347] rounded-full hover:bg-[#ff6347] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Go Back</span>
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-8">
          {currentStep === "register" ? (
            /* Registration Form */
            <div className="w-full max-w-md">
              {/* Header Card */}
              <div className="bg-white rounded-t-3xl shadow-2xl p-8 border-t-4 border-[#ff6347]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#ff6347] to-[#ff4500] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Partner Registration</h1>
                  <p className="text-gray-600">Join our restaurant network today</p>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-b-3xl shadow-2xl p-8 border-b-4 border-[#ff6347]">
                <form className="space-y-6" onSubmit={submitHandler}>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Restaurant/Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                      <input
                        type="text"
                        name="fullName"
                        value={data.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your business name"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                      <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        placeholder="business@example.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                      <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff6347]" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
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
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <User className="w-6 h-6" />
                          <span>Create Partner Account</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-[#ff6347]/20">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold text-[#ff6347]">Note:</span> After registration, you'll receive an
                    OTP for email verification before accessing the admin panel.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* OTP Verification Form */
            <div className="w-full max-w-md">
              {/* Header Card */}
              <div className="bg-white rounded-t-3xl shadow-2xl p-8 border-t-4 border-[#ff6347]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#ff6347] to-[#ff4500] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
                  <p className="text-gray-600">Enter the 6-digit code sent to</p>
                  <p className="text-[#ff6347] font-semibold">{userEmail}</p>
                </div>
              </div>

              {/* OTP Form Card */}
              <div className="bg-white rounded-b-3xl shadow-2xl p-8 border-b-4 border-[#ff6347]">
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {/* OTP Input Boxes */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#ff6347] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
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
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span>Verify & Continue</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                  <button
                    onClick={resendOtp}
                    disabled={isLoading}
                    className="text-[#ff6347] font-semibold hover:text-[#ff4500] transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                {/* Back to Registration */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setCurrentStep("register")
                      setOtp(["", "", "", "", "", ""])
                    }}
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    Back to Registration
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-[#ff6347]/20">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold text-[#ff6347]">Security:</span> This OTP will expire in 10 minutes
                    for your security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  )
}

export default Partner
