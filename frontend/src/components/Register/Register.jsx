import React, { useState } from 'react';

const Register = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
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
      name: "",
      userName: "",
      password: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col'>
      <input
        type="text"
        placeholder='Enter your full name'
        className='input-class'
        value={formData.name}
        onChange={handleInputChange}
        required
        name='name'
      />

      <input
        type="email"
        placeholder='Email'
        className='input-class'
        value={formData.userName}
        onChange={handleInputChange}
        required
        name='userName'
      />

      <input
        type="password"
        placeholder='Password'
        className='input-class'
        value={formData.password}
        onChange={handleInputChange}
        required
        name='password'
      />

      <button className='button-class'>
        Register
      </button>
    </form>
  );
};

export default Register;
