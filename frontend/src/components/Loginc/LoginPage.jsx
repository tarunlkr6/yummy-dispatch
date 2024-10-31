import React, { useEffect, useState } from "react";
import logImage from "/logimage.jpg";
import { FcGoogle } from "react-icons/fc";
import { assets } from "../../assets/assets";
import {
  useLoginMutation,
  useRegisterUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
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
    if (currState === "Login") {
      try {
        const res = await login(data).unwrap();
        dispatch(setCredentials({ ...res }));
        console.log(res);
        setShowLogin(false);
        navigate("/");
      } catch (error) {
        toast.error(error?.data?.message || error);
      }
    } else {
      try {
        const res = await register(data).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (error) {
        toast.error(error?.data?.message || error);
      }
    }
    setData({
      fullName: "",
      email: "",
      password: "",
    });
  };

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
          <h1 className="text-xl text-[#060606] font-semibold mb-4">
            Scan & Dine
          </h1>

          <div className="w-full flex flex-col max-w-[550px]">
            <div className="w-full flex flex-col mb-2">
              {currState === "Sign Up" ? (
                <h3 className="text-3xl font-semibold mb-2">Sign Up</h3>
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
                required
                name="password"
              />

              <div className="w-full flex items-center justify-between">
                <div className="w-full flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-2" />
                  <p className="text-sm">Remember Me</p>
                </div>

                {currState === "Login" ? (
                  <p className="text-sm underline whitespace-nowrap underline-offset-2 cursor-pointer">
                    Forgot Password?
                  </p>
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
                    <button className="w-full font-semibold text-white my-2 bg-[#0a0a0a] hover:bg-[#f97316] rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    {isLoading && (
                      <Spinner className="h-16 w-16 text-gray-900/50" />
                    )}
                    <button
                      type="submit"
                      className="w-full font-semibold text-white my-2 bg-[#0a0a0a] border hover:bg-[#ea580c] border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                    >
                      Login
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
                <FcGoogle className="h-6 mr-2" size={24} />
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
                  className="font-semibold underline underline-offset-2 cursor-pointer"
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
                  className="font-semibold underline underline-offset-2 cursor-pointer"
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
