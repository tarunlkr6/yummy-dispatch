import React, { useEffect, useState } from "react";
import logImage from "/logimage.jpg";
import { assets } from "../../assets/assets";
import {
  useLoginMutation,
  useRegisterUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { Spinner } from "@material-tailwind/react";

const LoginPage = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterUserMutation();

  const { userinfo } = useSelector((state) => state.auth);

  const [currState, setCurrState] = useState("Login");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userinfo) {
      navigate("/");
    }
  }, [userinfo, navigate]);

  let [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  let handleInputChange = (event) => {
    let fieldName = event.target.name;
    let newValue = event.target.value;

    setData((currentData) => {
      return {
        ...currentData,
        [fieldName]: newValue,
      };
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try{
      if (currState === "Login") {
        const res = await login(data).unwrap();
        dispatch(setCredentials({ ...res }));
        if (res.success) {
          toast.success(`Welcome back ${res.data.user.fullName}`);
        }
        setShowLogin(false);
        navigate("/");
    }else {
      if (data.password !== confirmPassword) {
        toast.error("Password do not match");
        return;
      } else {
          const res = await register(data).unwrap();
          if (res.error) {
            toast.error(error);
          } else if (res.success) {
            toast.success(
              `Successfully registered, Please login to your account`
            );
            setConfirmPassword('')
          }
          dispatch(setCredentials({ ...res }));
          navigate("/");
          setShowLogin(true)
      }
    }
    } catch(error){
      console.error("Error during login: ", error);
      toast.error(error?.data?.message || "Login failed")
    }
    setData({
      fullName: "",
      email: "",
      password: "",
    });
  };
  const forgotHandler =() =>{
    //window.location.reload(false);
    navigate('/forgetpassword');    
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="relative bg-white w-[90%] md:w-[800px] h-auto rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-4 right-4 cursor-pointer z-10"
        />

        {/* Left side with image */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto flex flex-col">
          {currState === "Sign Up" ? (
            <div className="absolute top-[20%] left-[10%] flex flex-col image_container z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold my-8">
                Sign Up for a Seamless Dining Experience
              </h1>
              <p className="text-lg md:text-xl text-white">
                Join Scan & Dine &rarr;
              </p>
            </div>
          ) : (
            <div className="absolute top-[20%] left-[10%] flex flex-col image_container z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold my-8">
                Welcome Back to Scan & Dine!
              </h1>
              <p className="text-lg md:text-xl text-white">Ready to Savor?</p>
            </div>
          )}

          <img
            className="w-full h-full object-cover"
            src={logImage}
            alt="Login Background"
          />
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 bg-[#f5f5f5] flex flex-col p-4 md:p-8 justify-between items-center login_container">
          <h1 className="text-2xl text-[#ea580c] font-semibold mb-4">
            Scan & Dine
          </h1>

          <div className="w-full flex flex-col max-w-[550px]">
            <div className="w-full flex flex-col mb-2">
              {currState === "Sign Up" ? (
                <h4 className="text-3xl font-semibold mb-2">Sign Up</h4>
              ) : (
                <>
                  {" "}
                  <h3 className="text-3xl font-semibold mb-2">Login</h3>
                  <p className="text-base mb-2">
                    Welcome Back! Please enter your details.
                  </p>
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
                name="password"
              />
              {currState !== "Login" && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  value={data.confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  name="password"
                />
              )}

              <div className="w-full flex items-center justify-between">
                {/* <div className="w-full flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-2" />
                  <p className="text-sm">Remember Me</p>
                </div> */}

                {currState === "Login" ? (
                  <Link to='/reset-password'>
                    <p onClick={forgotHandler} className="text-sm underline whitespace-nowrap underline-offset-2 cursor-pointer">
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
                    {registerLoading && (
                      <Spinner className="h-16 w-16 text-gray-900/50" />
                    )}
                    {/* <button className="w-full font-semibold text-white my-2 bg-[#0a0a0a] hover:bg-[#f97316] rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
                      Register
                    </button> */}
                    <button className="group relative m-1 cursor-pointer overflow-hidden rounded-md border-2 border-[#ff6347] px-5 py-3 font-mono font-semibold">
                      <span className="ease absolute top-1/2 h-0 w-64 origin-center -translate-x-20 rotate-45 bg-[#ff6347] transition-all duration-300 group-hover:h-64 group-hover:-translate-y-32"></span>
                      <span className="ease relative text-[#ff6347] transition duration-300 group-hover:text-white">
                        Register
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {isLoading && (
                      <Spinner className="h-16 w-16 text-gray-900/50" />
                    )}
                    {/* <button
                      type="submit"
                      className="w-full font-semibold text-white my-2 bg-[#0a0a0a] border hover:bg-[#ea580c] border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                    >
                      Login
                    </button> */}
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
              <box-icon name='google' type='logo' color='#ffffff' ></box-icon>
                Sign Up With Google
              </div>
            </form>
          </div>
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
      </div>
    </div>
  );
};

export default LoginPage;
