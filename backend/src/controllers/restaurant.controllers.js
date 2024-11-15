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
    const { resid } = req.params;
    const userId = req.user?._id;
    const { rating, review } = req.body; // Remove 'name' from the destructured body

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    // Find user by ID and check existence
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    const restaurant = await Restaurant.findById(resid);
    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // Check if the user has already reviewed the restaurant
    const alreadyReviewed = restaurant.restaurantReviews?.find(
        (rev) => rev.user && rev.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
        throw new ApiError(400, "You have already reviewed this restaurant.");
    }

    // Create the new review using the user's full name
    const newReview = {
        user: userId,
        name: user.fullName, // Use user's full name directly
        rating: Number(rating),
        review,
    };

    // Push the new review to restaurant's reviews array
    restaurant.restaurantReviews.push(newReview);

    // Calculate and update the average rating
    const totalRatings = restaurant.restaurantReviews.reduce((acc, rev) => acc + rev.rating, 0);
    restaurant.rating = totalRatings / restaurant.restaurantReviews.length;

    // Save the restaurant with the new review
    await restaurant.save({ validateBeforeSave: false });

    // Send a response with the user's name
    return res.status(200).json(
        new ApiResponse(200, {}, "Review added successfully")
    );
});

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
export {
    registerRestaurant,
    getRestaurant,
    getRestaurantById,
    addRestaurantReview,
    getRestaurantReview,
}