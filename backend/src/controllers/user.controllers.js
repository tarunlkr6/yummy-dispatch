import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    if (
        [fullName, email, password].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with same email already exists")
    }

    const user = await User.create({
        fullName,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registerd successfully."))
})

export { registerUser, }