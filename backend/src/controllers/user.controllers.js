import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {
  sendPasswordResetEmail,
  sendResetSuccessMail,
  sendVerificationMail,
  sendWelcomeMail,
} from "../mails/emails.js";
import { generateVerificationCode } from "../utils/generateCode.js"
const options = {
  httpOnly: true,
  secure: true,
};

// generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    return next(new ApiError(
      500,
      "Something went wrong while generating acess and refresh token"
    ))
  }
};

//register User
const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, isAdmin } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  //Check  is user already exists
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return next(new ApiError(409, "User with same email already exists"));
  }

  const verificationToken = generateVerificationCode()

  const user = await User.create({
    fullName,
    email,
    password,
    isAdmin,
    verificationToken,
    verificationTokenExpiry: Date.now() + 5 * 60 * 1000
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return next(new ApiError(504, "Something went wrong while registering user"));
  }

  await sendVerificationMail(createdUser.email, createdUser.fullName, verificationToken)

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registerd successfully."));
});

// verify Email
const verifyEmail = asyncHandler(async (req, res, next) => {

  const { code } = req.body
  if (!code) { return next(new ApiError(400, "OTP is missing")) }

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiry: { $gt: Date.now() }
  }).select("-password")

  if (!user) { return next(new ApiError(400, "OTP is expired.")) }

  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpiry = undefined

  await user.save({ validateBeforeSave: false })
  await sendWelcomeMail(user.email, user.fullName)

  return res
    .status(200)
    .json(new ApiResponse(200, "Account verified successfully."))
})

//login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) { return next(new ApiError(400, "email is required")) }

  const user = await User.findOne({ email });

  if (!user) { return next(new ApiError(404, "User does not exists")) }

  if (!user.isVerified) { return next(new ApiError(401, "Unauthorized")); }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) { return next(new ApiError(401, "Invalid user credentials")) }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

// logout
const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// get refresh token
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.body?.refreshToken;
  //console.log(incomingRefreshToken);

  if (!incomingRefreshToken) { return next(new ApiError(401, "Refresh token is required")) }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id)
    //console.log(decodedToken);

    if (!user || user.refreshToken !== incomingRefreshToken) { return next(new ApiError(401, "Invalid refresh token")) }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Token refreshed successfully."))
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired refresh token"))
  }
});

// change password
const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) { return next(new ApiError(401, "Invalid old password")) }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// user profile details
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"))
});

//forgot password ---- token generation
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) { return next(new ApiError(404, "User does not exits")) }

  try {
    const resetToken = user.generateResetToken();
    user.passwordResetToken = resetToken;
    await user.save({ validateBeforeSave: false });

    const passwordURL = `${req.protocol}://${req.get("host")}/api/v1/user/reset-password/${resetToken}`
    await sendPasswordResetEmail(user.email, user.fullName, passwordURL);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, `Email sent to ${user.email} successfully!`))

  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, err.message));
  }
});

// reset password --- set new password using token
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) { return next(new ApiError(404, "Token is invalid or has been expired")) }

  const { password, confirmPassword } = req.body
  if (password !== confirmPassword) { return next(new ApiError(400, "password does not match")) }

  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetTokenExpiry = undefined

  await user.save({ validateBeforeSave: false })
  await sendResetSuccessMail(user.email, user.fullName)

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
