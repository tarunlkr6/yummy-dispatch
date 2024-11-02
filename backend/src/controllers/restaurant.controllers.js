import { Restaurant } from "../models/restaurant.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiFeatures } from "../utils/ApiFeatures.js"

const getRestaurant = asyncHandler(async (req, res) => {
    const resultPerPage = 5

    const apiFeatures = new ApiFeatures(Restaurant.find(), req.query)
        .search()
        .filter()
        .filterByOpenStatus()
        .pagination(resultPerPage)

    const restaurants = await apiFeatures.query

    const restaurantCount = restaurants.length

    if (!restaurants || restaurantCount === 0) {
        throw new ApiError(404, "No restaurants found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { restaurants, restaurantCount, resultPerPage }, "Restaurant fetched successfully."))
})

// Fetch the restaurant by Id
const getRestaurantById = asyncHandler(async (req, res) => {

    const restaurant = await Restaurant.findById(req.params.id)

    if (!restaurant) {
        throw new ApiError(500, "Error:Unable to find the restaurant.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, restaurant, "Restaurant fetched successfully."))
})

const registerRestaurant = asyncHandler(async (req, res) => {

    const existedRestaurant = await Restaurant.findOne({ user: req.user._id })
    //console.log(existedRestaurant)

    if (existedRestaurant) {
        throw new ApiError(409, "User restaurant already exists")
    }

    const { name, description, ownerName, email, phoneNumber, openingTime, closingTime, address, city, state, zipCode } = req.body

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
        description,
        ownerName,
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
    getRestaurant,
    getRestaurantById,
}