import { useEffect, useState, useRef } from "react"
import logImage from "/logimage.jpg"
import { assets } from "../../assets/assets"
import { useLoginMutation, useRegisterUserMutation, useVerifyUserByOtpMutation } from "../../slices/usersApiSlice"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setCredentials } from "../../slices/authSlice"
import { Spinner } from "@material-tailwind/react"

const LoginPage = ({ setShowLogin }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const [register, { isLoading: registerLoading }] = useRegisterUserMutation()
  const [verifyUserByOtp, { isLoading: otpLoading }] = useVerifyUserByOtpMutation()
  const { userinfo } = useSelector((state) => state.auth)

  const [currState, setCurrState] = useState("Login")
  const [showOtp, setShowOtp] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [userEmail, setUserEmail] = useState("")
  const [registrationData, setRegistrationData] = useState(null)

  // Refs for OTP inputs
  const otpRefs = useRef([])

  useEffect(() => {
    if (userinfo && !showOtp) {
      navigate("/")
    }
  }, [userinfo, navigate, showOtp])

  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleInputChange = (event) => {
    const fieldName = event.target.name
    const newValue = event.target.value
    setData((currentData) => {
      return {
        ...currentData,
        [fieldName]: newValue,
      }
    })
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

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      if (currState === "Login") {
        // Direct login without OTP
        const res = await login(data).unwrap()
        if (res.success) {
          dispatch(setCredentials({ ...res }))
          toast.success(`Welcome back ${res.data.user.fullName}`)
          setShowLogin(false)
          navigate("/")
        }
      } else {
        // Registration with OTP verification
        if (data.password !== confirmPassword) {
          toast.error("Passwords do not match")
          return
        }

        const res = await register(data).unwrap()
        if (res.success) {
          setUserEmail(data.email)
          setRegistrationData(res)
          setShowOtp(true)
          toast.success("Registration successful! Please verify your email with the OTP sent to you.")
        }
      }
    } catch (error) {
      console.error("Error during authentication: ", error)
      toast.error(error?.data?.message || "Authentication failed")
    }

    if (!showOtp && currState === "Login") {
      setData({
        fullName: "",
        email: "",
        password: "",
      })
    }
  }

const handleOtpSubmit = async (e) => {
  e.preventDefault()
  const otpString = otp.join("")

  if (otp.includes("") || otpString.length !== 6) {
    toast.error("Please enter complete 6-digit OTP")
    return
  }

  if (!userEmail) {
    toast.error("Missing user email for verification")
    return
  }

  try {
    const res = await verifyUserByOtp({
      email: userEmail,
      code: otpString,
    }).unwrap()

    if (res.success) {
      dispatch(setCredentials({ ...res }))
      toast.success("Email verified successfully! Welcome to Scan & Dine!")
      setShowLogin(false)
      navigate("/")

      // Reset state
      setShowOtp(false)
      setOtp(["", "", "", "", "", ""])
      setData({ fullName: "", email: "", password: "" })
      setConfirmPassword("")
    }
  } catch (error) {
    console.error("OTP Verification Error:", error)
    toast.error(error?.data?.message || "OTP verification failed")
  }
}


  const resendOtp = async () => {
    try {
      const res = await register(data).unwrap()
      if (res.success) {
        toast.success("OTP resent to your email")
        setOtp(["", "", "", "", "", ""])
      }
    } catch (error) {
      toast.error("Failed to resend OTP")
    }
  }

  const forgotHandler = () => {
    navigate("/forgetpassword")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="relative bg-white w-[90%] md:w-[800px] h-auto rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon || "/placeholder.svg"}
          alt="Close"
          className="absolute top-4 right-4 cursor-pointer z-10"
        />

        {/* Left side with image */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto flex flex-col">
          {showOtp ? (
            <div className="absolute top-[20%] left-[10%] flex flex-col image_container z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold my-8">Verify Your Email</h1>
              <p className="text-lg md:text-xl text-white">Enter the 6-digit code sent to your email</p>
            </div>
          ) : currState === "Sign Up" ? (
            <div className="absolute top-[20%] left-[10%] flex flex-col image_container z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold my-8">
                Sign Up for a Seamless Dining Experience
              </h1>
              <p className="text-lg md:text-xl text-white">Join Scan & Dine &rarr;</p>
            </div>
          ) : (
            <div className="absolute top-[20%] left-[10%] flex flex-col image_container z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold my-8">Welcome Back to Scan & Dine!</h1>
              <p className="text-lg md:text-xl text-white">Ready to Savor?</p>
            </div>
          )}
          <img className="w-full h-full object-cover" src={logImage || "/placeholder.svg"} alt="Login Background" />
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 bg-[#f5f5f5] flex flex-col p-4 md:p-8 justify-between items-center login_container">
          <h1 className="text-2xl text-[#ea580c] font-semibold mb-4">Scan & Dine</h1>

          {showOtp ? (
            /* OTP Verification Form */
            <div className="w-full flex flex-col max-w-[550px]">
              <div className="w-full flex flex-col mb-2">
                <h3 className="text-3xl font-semibold mb-2">Verify Email</h3>
                <p className="text-base mb-2">Enter the 6-digit code sent to {userEmail}</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col">
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-2 my-6">
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
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#ea580c] focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <div className="w-full flex flex-col my-4">
                  {otpLoading && <Spinner className="h-16 w-16 text-gray-900/50 mx-auto mb-4" />}

                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-center overflow-hidden border-2 border-red-400 p-4 px-6 py-3 font-medium text-indigo-600 shadow-md transition duration-300 ease-out hover:border-4 hover:border-double"
                  >
                    <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-[#ff6347] text-white duration-300 group-hover:translate-x-0">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                    <span className="ease absolute flex h-full w-full transform items-center justify-center text-red-400 transition-all duration-300 group-hover:translate-x-full">
                      Verify Email
                    </span>
                    <span className="invisible relative">Verify Email</span>
                  </button>
                </div>

                <div className="w-full flex items-center justify-center">
                  <p className="text-sm font-normal text-[#060606]">
                    Didn't receive the code?{" "}
                    <span
                      onClick={resendOtp}
                      className="font-semibold underline underline-offset-2 cursor-pointer hover:text-[#ff6347]"
                    >
                      Resend OTP
                    </span>
                  </p>
                </div>

                <div className="w-full flex items-center justify-center mt-4">
                  <span
                    onClick={() => {
                      setShowOtp(false)
                      setOtp(["", "", "", "", "", ""])
                    }}
                    className="text-sm font-semibold underline underline-offset-2 cursor-pointer hover:text-[#ff6347]"
                  >
                    Back to Registration
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* Login/Register Form */
            <div className="w-full flex flex-col max-w-[550px]">
              <div className="w-full flex flex-col mb-2">
                {currState === "Sign Up" ? (
                  <h4 className="text-3xl font-semibold mb-2">Sign Up</h4>
                ) : (
                  <>
                    <h3 className="text-3xl font-semibold mb-2">Login</h3>
                    <p className="text-base mb-2">Welcome Back! Please enter your details.</p>
                  </>
                )}
              </div>

              <form onSubmit={submitHandler} className="w-full flex flex-col">
                {currState === "Login" ? (
                  <></>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    value={data.fullName}
                    onChange={handleInputChange}
                    required
                    name="fullName"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none "
                  value={data.email}
                  onChange={handleInputChange}
                  required
                  name="email"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  value={data.password}
                  onChange={handleInputChange}
                  required
                  name="password"
                />
                {currState !== "Login" && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    name="confirmPassword"
                  />
                )}

                <div className="w-full flex items-center justify-between">
                  {currState === "Login" ? (
                    <Link to="/reset-password">
                      <p
                        onClick={forgotHandler}
                        className="text-sm underline whitespace-nowrap underline-offset-2 cursor-pointer"
                      >
                        Forgot Password?
                      </p>
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="w-full flex flex-col my-4">
                  {currState === "Sign Up" ? (
                    <>
                      {registerLoading && <Spinner className="h-16 w-16 text-gray-900/50" />}
                      <button
                        type="submit"
                        className="group relative m-1 cursor-pointer overflow-hidden rounded-md border-2 border-[#ff6347] px-5 py-3 font-mono font-semibold"
                      >
                        <span className="ease absolute top-1/2 h-0 w-64 origin-center -translate-x-20 rotate-45 bg-[#ff6347] transition-all duration-300 group-hover:h-64 group-hover:-translate-y-32"></span>
                        <span className="ease relative text-[#ff6347] transition duration-300 group-hover:text-white">
                          Register
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {isLoading && <Spinner className="h-16 w-16 text-gray-900/50" />}
                      <button
                        type="submit"
                        className="group relative inline-flex items-center justify-center overflow-hidden border-2 border-red-400 p-4 px-6 py-3 font-medium text-indigo-600 shadow-md transition duration-300 ease-out hover:border-4 hover:border-double"
                      >
                        <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-[#ff6347] text-white duration-300 group-hover:translate-x-0">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </span>
                        <span className="ease absolute flex h-full w-full transform items-center justify-center text-red-400 transition-all duration-300 group-hover:translate-x-full">
                          Login
                        </span>
                        <span className="invisible relative">Login</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="w-full flex flex-col items-center relative py-4">
                  <div className="w-full h-[1px] bg-black/40 relative lineOfor"></div>
                  <p className="text-lg absolute top-1/2 transform -translate-y-1/2 text-black/80 bg-[#f5f5f5] px-2">
                    Or
                  </p>
                </div>

                <div className="w-full font-semibold text-[#060606] my-2 bg-white border border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-black/85 hover:text-white transition-colors duration-300">
                  <box-icon name="google" type="logo" color="#ffffff"></box-icon>
                  Sign Up With Google
                </div>
              </form>

              {currState === "Login" ? (
                <div className="w-full flex items-center justify-center">
                  <p className="text-sm font-normal text-[#060606]">
                    Don't have an account?{" "}
                    <span
                      onClick={() => setCurrState("Sign Up")}
                      className="font-semibold underline underline-offset-2 cursor-pointer hover:text-[#ff6347]"
                    >
                      Sign Up for free
                    </span>
                  </p>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-sm font-normal text-[#060606]">
                    Already have an account?{" "}
                    <span
                      onClick={() => setCurrState("Login")}
                      className="font-semibold underline underline-offset-2 cursor-pointer hover:text-[#ff6347]"
                    >
                      Login here
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
