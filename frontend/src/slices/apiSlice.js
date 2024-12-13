import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout, setCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // To include cookies with each request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
    console.log('refreshResult', refreshResult);
    if (refreshResult?.data) {
      const userInfo = api.getState().auth.userInfo;

      // Update access token in Redux and cookies
      api.dispatch(setCredentials({ user: userInfo, accessToken: refreshResult.data.accessToken }));
      Cookies.set('accessToken', refreshResult.data.accessToken, { secure: true, sameSite: 'strict' });

      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout user if refresh token fails
      api.dispatch(logout());
      Cookies.remove('accessToken');
      Cookies.remove('userInfo');
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use baseQueryWithReauth to handle re-authentication
  tagTypes: ['User', 'Order', 'Cart'],
  endpoints: (builder) => ({}),
});