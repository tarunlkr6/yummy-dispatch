import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout, setCredentials } from './authSlice';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // To include cookies with each request
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().auth.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token is expired (401 error), attempt refresh
  if (result?.error?.status === 401) {
    console.log("Access token expired. Attempting refresh...");
    const refreshToken = Cookies.get('refreshToken'); // Retrieve refresh token from cookies

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/api/v1/user/refresh-token',
          method: 'POST',
          body: { refreshToken },
          credentials: 'include',
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        console.log("Refresh successful, retrying original query...");
        // Update Redux state and cookies with new tokens
        api.dispatch(setCredentials({ 
          data: { 
            user: api.getState().auth.userInfo,
            accessToken: refreshResult.data.accessToken 
          } 
        }));

        Cookies.set('accessToken', refreshResult.data.accessToken, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refreshResult.data.refreshToken, { secure: true, sameSite: 'strict' });

        // Retry original query with updated token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("Refresh token failed. Logging out...");
        api.dispatch(logout());
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      }
    } else {
      console.error("No refresh token found. Logging out...");
      api.dispatch(logout());
    }
  }

  return result;
};


export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use baseQueryWithReauth to handle re-authentication
  tagTypes: ['User', 'Order', 'Cart'],
  endpoints: (builder) => ({}),
});