import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    bookingToken: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    reservationDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v > new Date()
            },
            message: "Reservation date must be in the future.",
        },
    },
    reservationTime: {
        type: String,
        required: true,
        enum: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00', '21:00'],
    },
    numGuests: {
        type: Number,
        required: true,
        min: [1, 'At least one guest is required'],
        max: [20, 'Maximum number of gues is 20'],
    },
    specialRequests: {
        type: String,
        trim: true,
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true,
        match: /^\+?[1-9]\d{1,14}$/,
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true })

bookingSchema.index({
    reservationDate: 1, reservationTime: 1,
}, { unique: true, }
)

bookingSchema.index({
    user: 1, reservationDate: 1
}, { unique: true })

export const Booking = mongoose.model('Booking', bookingSchema)