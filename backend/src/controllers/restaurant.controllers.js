import { Restaurant } from "../models/restaurant.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiFeatures } from "../utils/ApiFeatures.js"
import { User } from "../models/user.models.js"

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


    const restaurant = await Restaurant.findById(req.params.resid)


    if (!restaurant) {
        throw new ApiError(500, "Error:Unable to find the restaurant.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, restaurant, "Restaurant fetched successfully."))
})

// Register restaurant
const registerRestaurant = asyncHandler(async (req, res) => {

    console.log(req.body)

    const user = await User.findOne({ email: req.body.ownerEmail })
    if (!user) {
        throw new ApiError(404, "User not found, Kindly enter your existing email")
    }

    if (!user.isAdmin) {
        throw new ApiError(409, "Not authorized")
    }

    const { ownerName, name, ownerEmail, description, phoneNumber, openingTime, closingTime, address, city, state, zipCode } = req.body

    if (
        [ownerName, name, ownerEmail, phoneNumber, openingTime, closingTime, address, city, state, zipCode].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    const existedRestaurant = await Restaurant.findOne({ ownerEmail })

    if (existedRestaurant) {
        throw new ApiError(409, "User restaurant already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(401, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const restaurant = await Restaurant.create({
        ownerName,
        name,
        description,
        ownerEmail: ownerEmail.toLowerCase(),
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
        throw new ApiError(500, "Something went wrong while registering restaurant")
    }

    user.restaurantId = restaurant._id
    await user.save({ validateBeforeSave: false })

    return res
        .status(201)
        .json(new ApiResponse(201, createdRestaurant, "Restaurant created Successfully"))
})

const addRestaurantReview = asyncHandler(async (req, res) => {
    const { resid } = req.params
    const userId = req.user?._id
    const { name, rating, review } = req.body

    if (rating < 0 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.")
    }

    const restaurant = await Restaurant.findById(resid)

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found")
    }

    const alreadyReviewed = restaurant.restaurantReviews?.find(
        (review) => review.user && review.user._id.toString() === userId.toString()
    );

    if (alreadyReviewed) {
        throw new ApiError(400, "You have already reviewed this item.")
    }

    const newReview = {
        user: userId,
        name,
        rating: Number(rating),
        review,
    }

    restaurant.restaurantReviews.push(newReview)

    let avg = 0
    restaurant.restaurantReviews.forEach((rev) => {
        avg += rev.rating
    })

    restaurant.rating = avg / restaurant.restaurantReviews.length

    await restaurant.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review added successfully"))
})

const getRestaurantReview = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const restaurant = await Restaurant.findById(resid)

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, restaurant.restaurantReviews, "Review fetched successfully"))
})


const updateCloseOpen = asyncHandler(async (req, res) => {
    const { resid} = req.params;
    let { isOpen } = req.body;
    console.log(resid); // Extract isAvailable from request body

    // Convert isAvailable to boolean if it comes as a string
    if (typeof isOpen === 'string') {
        isOpen = isOpen === 'true'; // Convert to boolean
    }

    console.log("isAvailable after parsing:", isOpen); // Should be true or false

    // Find the item by restaurant ID and item ID
    const item = await Restaurant.findById( resid );
    console.log(item)
    if (!item) {
        throw new ApiError(404, "Not found");
    }

    // Update the menu item with the new availability status
    const menuItem = await Restaurant.findByIdAndUpdate(
        { _id: resid},
        { $set: { isOpen } },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, menuItem, "Item updated successfully."));
});


export {
    registerRestaurant,
    getRestaurant,
    getRestaurantById,
    addRestaurantReview,
    getRestaurantReview,
    updateCloseOpen,
}