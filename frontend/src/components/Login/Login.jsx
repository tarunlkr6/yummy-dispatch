// Login.jsx
import React from 'react';


const Login = ({ formData, handleInputChange, handleSubmit }) => {

    const [formData, setFormData] = useState({
        userName: "",
        password: ""
      });
    
      const handleInputChange = (event) => {
        let fieldName = event.target.name;
        let newValue = event.target.value;
    
        setFormData((currentData) => ({
          ...currentData,
          [fieldName]: newValue,
        }));
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        setFormData({
          userName: "",
          password: ""
        });
      };
    
  return (
    <>
      <div className='w-full flex flex-col mb-2'>
        <h3 className='text-3xl font-semibold mb-2'>Login</h3>
        <p className='text-base mb-2'>Welcome Back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className='w-full flex flex-col'>
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
            <input type='checkbox' className='w-4 h-4 mr-2' />
            <p className='text-sm'>Remember Me</p>
          </div>
          <p className='text-sm underline whitespace-nowrap underline-offset-2 cursor-pointer'>Forgot Password?</p>
        </div>
        <button className='w-full font-semibold text-[#060606] my-2 bg-white border hover:bg-[#ea580c] border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
          Login
        </button>
      </form>
      <div className='w-full flex flex-col items-center relative py-4'>
        <div className='w-full h-[1px] bg-black/40 relative lineOfor'></div>
        <p className='text-lg absolute top-1/2 transform -translate-y-1/2 text-black/80 bg-[#f5f5f5] px-2'>Or</p>
      </div>
      <div className='w-full font-semibold text-[#060606] my-2 bg-white border border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-black/85 hover:text-white transition-colors duration-300'>
      <box-icon name='google' type='logo' color='#ffffff' ></box-icon>
        Login With Google
      </div>
    </>
  );
};

export default Login;
