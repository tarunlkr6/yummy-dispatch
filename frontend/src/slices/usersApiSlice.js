import { USER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
        credentials: "include", // Ensure cookies are cleared
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout()); // Clear Redux state on successful logout
        } catch {
          console.error("Logout failed");
        }
      },
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    verifyUserByOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/forgot-password`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation({
  query: ({ token, password, confirmPassword }) => ({
    url: `${USER_URL}/reset-password/${token}`,
    method: "POST",
    body: { password, confirmPassword },
    credentials: "include",
  }),
}),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-password`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/me`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    })
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterUserMutation,
  useForgetPasswordMutation,
  useUpdatePasswordMutation,
  useGetCurrentUserQuery,
  useVerifyUserByOtpMutation,
  useResetPasswordMutation
} = usersApiSlice;