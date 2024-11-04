import mongoose, { Schema } from "mongoose"

const offerSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
    },
    offerName: {
        type: String,
        required: true,
        trim: true,
    },
    offerDescription: {
        type: String,
        required: true,
    },
    offerImage: {
        type: String, // cloudinary url
        required: true,
    },
}, { timestamps: true })

export const Offer = mongoose.model("Offer", offerSchema)