import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { sendPasswordResetEmail, sendResetSuccessMail } from "../mails/emails.js"

const options = {
    httpOnly: true,
    secure: true,
}

// generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating acess and refresh token")
    }
}

//register User
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, isAdmin } = req.body

    if (
        [fullName, email, password].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    //Check  is user already exists
    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with same email already exists")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        isAdmin,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(504, "Something went wrong while registering user")
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registerd successfully."))
})

//login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect
        (password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"))
})

// logout
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: null,
        },
    }, { new: true, })

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

// get refresh token 
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully."))

    } catch (err) {
        // console.log(err)
        throw new ApiError(500, `Something went wrong while refreshing access token: ${err}`)
    }
})

// change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


// user profile details
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User details fetched successfully"))
})

//forgot password ---- token generation
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exits")
    }

    try {
        const resetToken = user.generateResetToken()

        user.passwordResetToken = resetToken

        await user.save({ validateBeforeSave: false })

        const passwordURL = `${req.protocol}://${req.get("host")}/api/v1/user/reset-password/${resetToken}`
        await sendPasswordResetEmail(user.email, user.fullName, passwordURL)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, `Email sent to ${user.email} successfully!`))

    } catch (err) {
        user.passwordResetToken = null
        user.passwordResetTokenExpiry = null

        await user.save({ validateBeforeSave: false })

        throw new ApiError(500, err.message)
    }

})

// reset password --- set new password using token
const resetPassword = asyncHandler(async (req, res) => {
    const { passwordResetToken } = req.params

    const user = await User.findOne({
        passwordResetToken,
        passwordResetTokenExpiry: {
            $gt: Date.now()
        }
    })

    if (!user) {
        throw new ApiError(404, "Token is invalid or has been expired")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "password does not match")
    }

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiry = undefined

    await user.save({ validateBeforeSave: false })

    await sendResetSuccessMail(user.email, user.fullName)

    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully"))

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    forgotPassword,
    resetPassword,
}