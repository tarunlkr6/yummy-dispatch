import React, { useState } from "react";
import { useForgetPasswordMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@material-tailwind/react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const naviagte = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgetPassword({ email }).unwrap();
      //console.log(response);
      if(response.message)
      toast.success("Reset link sent, check your email.");
      setEmail('');
      // Redirect to the reset password page
    //window.location.href= `http://localhost:8080/api/v1/user/reset-password/${response.token}`;
    } catch (error) {
      toast.error(error.data?.message || "Failed to send reset link. Please try again.");
    }
  };


  return (
    <>
    <Link to="/">
            <Button
            size="medium"
              variant="outlined"
              color="black"
              className="mx-auto mt-4"
            >
              Go back
            </Button>
          </Link>
          <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Reset Password
        </h2>

        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@example.com"
          required
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We’ll never share your details. Read our{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Privacy Policy
          </a>
          .
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mb-4 group relative overflow-hidden rounded bg-indigo-600 px-8 py-4 text-white transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-indigo-600 hover:to-gray-400 hover:ring-2 hover:ring-gray-600 hover:ring-offset-2"
        >
          <span className="ease absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-700 group-hover:-translate-x-40"></span>
          <span className="relative">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </span>
        </button>
      </form>
    </div>
    </>

  );
};

export default ForgetPassword;
