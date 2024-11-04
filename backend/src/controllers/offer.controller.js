import { Offer } from "../models/offer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createOffer = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const { offerName, offerDescription } = req.body
    if (!offerName && offerDescription) {
        throw new ApiError(400, "Offer name and description are required")
    }

    const offerLocalPath = req.files?.offerImage[0]?.path

    if (!offerLocalPath) {
        throw new ApiError(401, "Offer image is required")
    }

    const offerImage = await uploadOnCloudinary(offerLocalPath)

    const offer = await Offer.create({
        restaurantId: resid,
        offerName,
        offerDescription,
        offerImage: offerImage.url,
    })

    const createdOffer = await Offer.findById(offer._id)

    if (!createdOffer) {
        throw new ApiError(500, "Something went wrong while creating offer")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdOffer, "Offer created successfully"))
})

const getOffers = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const offers = await Offer.find({ restaurantId: resid })

    if (!offers) {
        throw new ApiError(404, "Offer not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, offers, "Offeres fetched successfully."))
})

const deleteOffer = asyncHandler(async (req, res) => {
    const { resid, offerid } = req.params
    const offer = await Offer.findById(offerid)

    if (!offer) {
        throw new ApiError(404, "Offer not found")
    }

    if (offer.restaurantId.toString() !== resid) {
        throw new ApiError(401, "Access denied")
    }

    await Offer.deleteOne({ _id: offer._id })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Offer deleted successfully."))
})

export {
    createOffer,
    deleteOffer,
    getOffers,
}