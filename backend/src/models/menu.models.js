import mongoose, { Schema } from "mongoose"

const menuSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    image: [{
        publicId: {
            type: String,
        },
        url: {
            type: String,
        },
    }],
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['starters', 'rice', 'breads', 'drinks', 'desserts', 'mainCourse'],
        required: true,
    },
    isVeg: {
        type: Boolean,
        required: true,
        default: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true,
    },

}, { timestamps: true })

export const Menu = mongoose.model("Menu", menuSchema)