import React, { useState } from "react";


const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return conditions;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "newPassword") {
      const validationResult = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        newPassword: Object.values(validationResult).some(condition => !condition)
          ? "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
          : ""
      }));
    }
    
    if (name === "confirmPassword") {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.newPassword ? "Passwords do not match" : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!errors.newPassword && !errors.confirmPassword && formData.newPassword === formData.confirmPassword) {
      // Simulating API call
      setTimeout(() => {
        alert("Password reset successfully!");
        setIsSubmitting(false);
        setFormData({ newPassword: "", confirmPassword: "" });
      }, 1500);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{
           backgroundImage: "url('images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3')",
           backgroundSize: "cover",
           backgroundPosition: "center"
         }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl backdrop-blur-lg bg-opacity-90">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto rounded-full shadow-lg"
            src="images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-4.0.3"
            alt="Company Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="newPassword" className="sr-only">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out`}
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                aria-invalid={errors.newPassword ? "true" : "false"}
                aria-describedby="newPassword-error"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPassword.new ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1" id="newPassword-error" role="alert">
                {errors.newPassword}
              </p>
            )}

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby="confirmPassword-error"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPassword.confirm ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1" id="confirmPassword-error" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting || Object.keys(errors).length > 0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition-all duration-150 ease-in-out transform hover:scale-[1.02]`}
            >
              {isSubmitting ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>

          <div className="password-requirements mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
            <ul className="space-y-1">
              {[
                { condition: validatePassword(formData.newPassword).length, text: "At least 8 characters" },
                { condition: validatePassword(formData.newPassword).uppercase, text: "One uppercase letter" },
                { condition: validatePassword(formData.newPassword).lowercase, text: "One lowercase letter" },
                { condition: validatePassword(formData.newPassword).number, text: "One number" },
                { condition: validatePassword(formData.newPassword).special, text: "One special character" }
              ].map((requirement, index) => (
                <li key={index} className="flex items-center text-sm">
                  {requirement.condition ? (
                    <i className="fa-solid fa-check fa-2xs mr-2" style="color: #0fc724;"></i>
                  ) : (
                    <i className="fa-solid fa-xmark fa-2xs mr-2" style="color: #08af2a;"></i>
                  )}
                  <span className={requirement.condition ? "text-green-500" : "text-red-500"}>
                    {requirement.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;