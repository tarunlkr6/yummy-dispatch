import { Menu } from "../models/menu.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getMenuItem = asyncHandler(async (req, res) => {
    const { resid } = req.params
    const menu = await Menu.find({ restaurantId: resid })

    if (!menu) {
        throw new ApiError(500, "Error while fetching menu")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, menu, "Menu fetched successfully"))
})

const createMenuItem = asyncHandler(async (req, res) => {
    const { itemName, price, description, category, isVeg, isAvailable } = req.body

    if (
        [itemName, price, description, category, isVeg].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    let imageLocalPath = []
    imageLocalPath = req.files.image
    //console.log(imageLocalPath)

    if (!imageLocalPath) {
        throw new ApiError(401, "Image is required")
    }
    let imageArray = []
    for (let i = 0; i < imageLocalPath.length; i++) {
        let imageLinks = imageLocalPath[i]?.path;
        const result = await uploadOnCloudinary(imageLinks)
        imageArray.push({
            publicId: result.public_id,
            url: result.url
        })
    }

    const menuItem = await Menu.create({
        restaurantId: req.params.resid,
        itemName,
        price,
        image: imageArray,
        price,
        description,
        category,
        isVeg,
        isAvailable,
    })
    const createdMenuItem = await Menu.findById(menuItem._id)

    if (!createdMenuItem) {
        throw new ApiError(500, "Something went wrong while adding menu")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdMenuItem, "Menu addedd successfully"))
})

const updateMenuItem = asyncHandler(async (req, res) => {
    const { resid, itemid } = req.params
    const { price, description, isAvailable } = req.body

    if (!price && !description && !isAvailable) {
        throw new ApiError(400, "All fields are required")
    }

    const menuItem = await Menu.findByIdAndUpdate({ restaurantId: resid, _id: itemid }, {
        $set: {
            price,
            description,
            isAvailable
        }
    }, {
        new: true
    })

    return res
        .status(200)
        .json(new ApiResponse(200, menuItem, "Item updated successfully."))
})

const deleteMenuItem = asyncHandler(async (req, res) => {
    const { resid, itemid } = req.params
    const menuItem = await Menu.findByIdAndDelete({ restaurnatId: resid, _id: itemid })

    if (!menuItem) {
        throw new ApiError(400, "Item not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Menu item deleted successfully"))
})

export {
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
}