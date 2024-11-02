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
    // Attempt to refresh token if unauthorized
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);

    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // Update with new access token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // Retry original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout if refreshing token fails
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use baseQueryWithReauth to handle re-authentication
  tagTypes: ['User', 'Restaurant', 'Cart'],
  endpoints: (builder) => ({}),
});