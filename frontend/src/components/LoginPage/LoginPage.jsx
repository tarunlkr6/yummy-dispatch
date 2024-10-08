import React, { useState } from 'react';
import logImage from '/login.jpg';
import { FcGoogle } from "react-icons/fc";
import { assets } from '../../assets/assets';

const LoginPage = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign U");

  let [formData,setFormData] = useState({
    name: "",
    userName: "",
    password: ""
  });


  let handleInputChange = (event)=>{
    let fieldName = event.target.name;
    let newValue = event.target.value;

    setFormData((currentData)=>{
      return{
        ...currentData,
        [fieldName] : newValue
      };
    })
    
  };

  let handleSubmit = (event) => {
    console.log(formData);
    event.preventDefault();

    setFormData({
      name: "",
      userName: "",
      password: ""
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="relative bg-white w-[90%] md:w-[800px] h-auto rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <img 
          onClick={() => setShowLogin(false)} 
          src={assets.cross_icon} 
          alt='Close' 
          className='absolute top-4 right-4 cursor-pointer z-10' 
        />

        {/* Left side with image */}
        <div className='relative w-full md:w-1/2 h-[300px] md:h-auto flex flex-col'>
          <div className='absolute top-[20%] left-[10%] flex flex-col image_container z-10'>
            <h1 className='text-3xl md:text-4xl text-white font-bold my-8'>Discover food here</h1>
            <p className='text-lg md:text-xl text-white'>Start for free</p>
          </div>
          <img className='w-full h-full object-cover' src={logImage} alt="Login Background" />
        </div>

        {/* Right side with form */}
        <div className='w-full md:w-1/2 bg-[#f5f5f5] flex flex-col p-4 md:p-8 justify-between items-center login_container'>
          <h1 className='text-xl text-[#060606] font-semibold mb-4'>Scan & Dine</h1>

          <div className='w-full flex flex-col max-w-[550px]'>
            <div className='w-full flex flex-col mb-2'>
              {currState === "Sign Up"
              ? <h3 className='text-3xl font-semibold mb-2'>Sign Up</h3> 
              : <> <h3 className='text-3xl font-semibold mb-2'>Login</h3>
              <p className='text-base mb-2'>Welcome Back! Please enter your details.</p>
              </>
              }
            </div>

            <form 
            onSubmit={handleSubmit}
            className='w-full flex flex-col'>
              {currState === "Login" ? <></> : 
              <input
              htmlFor='name'
              type="text"
              placeholder='Enter your full name'
              className='w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none'
              value={formData.name}
              onChange={handleInputChange}
              required
              name='name'
            />
              }
              <input
                htmlFor='userName' 
                type="email"
                placeholder='Email'
                className='w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none'
                value={formData.userName}
                onChange={handleInputChange}
                required
                name='userName'
              />

              <input
                htmlFor='password' 
                type="password"
                placeholder='Password'
                className='w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none'
                value={formData.password}
                onChange={handleInputChange}
                required
                name='password'
              />

              <div className='w-full flex items-center justify-between'>
                <div className='w-full flex items-center'>
                  <input type='checkbox' className='w-4 h-4 mr-2'/>
                  <p className='text-sm'>Remember Me</p>
                </div>

                {currState === "Login" ? <p className='text-sm underline whitespace-nowrap underline-offset-2 cursor-pointer'>Forgot Password?</p> : <></>}
              </div>

              <div className='w-full flex flex-col my-4'>
                {currState === "Sign Up" ?
                <button className='w-full font-semibold text-white my-2 bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                  Register
                </button>
                :
                <button className='w-full font-semibold text-[#060606] my-2 bg-white border border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                  Login
                </button>
                }
              </div>

              <div className='w-full flex flex-col items-center relative py-4'> 
                <div className='w-full h-[1px] bg-black/40 relative lineOfor'></div>
                <p className='text-lg absolute top-1/2 transform -translate-y-1/2 text-black/80 bg-[#f5f5f5] px-2'>Or</p>
              </div>

              <div className='w-full font-semibold text-[#060606] my-2 bg-white border border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                <FcGoogle className='h-6 mr-2' size={24}/>
                Sign In With Google
              </div>
            </form>
          </div>
          {currState === "Login" ? 
            <div className='w-full flex items-center justify-center'>
              <p className='text-sm font-normal text-[#060606]'>Don't have an account? <span onClick={()=>setCurrState("Sign Up")} className='font-semibold underline underline-offset-2 cursor-pointer'>Sign Up for free</span></p>
            </div>
            :
            <div className='w-full flex items-center justify-center'>
              <p className='text-sm font-normal text-[#060606]'>Already have an account? <span onClick={()=>setCurrState("Login")} className='font-semibold underline underline-offset-2 cursor-pointer'>Login here</span></p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
