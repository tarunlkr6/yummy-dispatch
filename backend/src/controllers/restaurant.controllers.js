import { Restaurant } from "../models/restaurant.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerRestaurant = asyncHandler(async (req, res) => {

    const existedRestaurant = await Restaurant.findOne({ user: req.user._id })
    //console.log(existedRestaurant)

    if (existedRestaurant) {
        throw new ApiError(409, "User restaurant already exists")
    }

    const { name, email, phoneNumber, openingTime, closingTime, address, city, state, zipCode } = req.body

    if (
        [name, email, phoneNumber, openingTime, closingTime, address, city, state, zipCode].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(401, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const restaurant = await Restaurant.create({
        user: req.user._id,
        name,
        email: email.toLowerCase(),
        phoneNumber,
        openingTime,
        closingTime,
        address,
        city,
        state,
        zipCode,
        avatar: avatar.url,
    })

    const createdRestaurant = await Restaurant.findById(restaurant._id)

    if (!createdRestaurant) {
        throw new ApiError(500, "Something went wrong while registering user restaurant")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdRestaurant, "Restaurant created Successfully"))
})

export {
    registerRestaurant,
}