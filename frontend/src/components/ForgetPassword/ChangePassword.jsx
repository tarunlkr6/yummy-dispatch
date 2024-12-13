import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdatePasswordMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const ChangePassword = () => {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (!userInfo) {
      // Redirect to login if user is not authenticated
      // You might want to use react-router's navigate here
      window.location.href = '/login';
    }
  }, [userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (!isAccepted) {
      toast.error('You must accept the terms and conditions.');
      return;
    }

    try {
      const res = await updatePassword({
        oldPassword,
        newPassword
      }).unwrap();
      //console.log(res);
      toast.success('Password changed successfully');
      navigate('/')
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsAccepted(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
    <Link to="/">
            <Button
            size="medium"
              variant="gradient"
              color="black"
              className="mx-auto"
            >
              Go back
            </Button>
      </Link>
      <section className="bg-gray-100 dark:bg-gray-800">
      
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-700 sm:max-w-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Change Password
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input (Disabled) */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userInfo?.email}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
                disabled
              />
            </div>

            {/* Current Password Input */}
            <div>
              <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* New Password Input */}
            <div>
              <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Confirm New Password Input */}
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  checked={isAccepted}
                  onChange={() => setIsAccepted(!isAccepted)}
                  className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-orange-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-600 dark:text-gray-300">
                  I accept the{" "}
                  <a className="font-medium text-orange-600 hover:underline dark:text-orange-500" href="#">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
    </>
    
  );
};

export default ChangePassword;