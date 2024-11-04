import { Booking } from "../models/booking.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"


// generate unique booking number
const generateBookingToken = async () => {

    try {
        let unique = false
        let token
        while (!unique) {

            token = crypto.randomInt(10000000, 100000000)
            const existingBooking = await Booking.findOne({ bookingToken: token })

            if (!existingBooking) {
                unique = true
            }
        }
        return token
    } catch (err) {
        console.log("booking no generation err", err)
        throw new ApiError(500, "Something went wrong while generating booking number")
    }
}

// user access
const bookTable = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const { name, reservationDate, reservationTime, numGuests, specialRequests, contactPhone, contactEmail } = req.body

    if (
        [name, reservationDate, reservationTime, contactPhone, contactEmail].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    const existedBooking = await Booking.findOne({ contactEmail, contactPhone })

    if (existedBooking) {
        throw new ApiError(409, "You already have an existing booking")
    }

    const bookingToken = await generateBookingToken()

    const booking = await Booking.create({
        user: req.user._id,
        restaurantId: resid,
        bookingToken,
        name,
        contactEmail,
        contactPhone,
        numGuests,
        reservationDate,
        reservationTime,
        specialRequests,
    })

    const createdBooking = await Booking.findById(booking._id)

    if (!createdBooking) {
        throw new ApiError(500, "Something went wrong while booking table")
    }

    // send booking confirmation mail

    return res
        .status(201)
        .json(new ApiResponse(201, createdBooking, "Table booked successfully"))
})

// user access
const cancelBookTable = asyncHandler(async (req, res) => {
    const { resid, bookingid } = req.params
    const userId = req.user._id

    const booking = await Booking.findOne({ _id: bookingid, user: userId, restaurantId: resid })

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    if (booking.reservationDate < new Date()) {
        throw new ApiError(400, "Past booking cannot be cancelled")
    }

    booking.status = 'Cancelled'
    await booking.save({ validateBeforeSave: false })

    // send cancellation mail

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Booking cancelled successfully"))
})

// restaurant owner access
const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingid } = req.params

    const booking = await Booking.findById(bookingid)

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    if (booking.reservationDate < new Date()) {
        throw new ApiError(400, "Past booking cannot cancelled")
    }

    if (booking.status === 'Confirmed') {
        throw new ApiError(400, "Confirmed booking cannot be cancelled")
    }

    await Booking.deleteOne({ _id: bookingid })

    // send cancellation mail

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Booking cancelled successfully"))

})

// update booking status
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingid } = req.params

    const booking = await Booking.findById(bookingid)

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    if (booking.status === 'Confirmed') {
        throw new ApiError(402, "Booking is already confirmed")
    }

    if (booking.status === 'Cancelled') {
        throw new ApiError(400, "Cancelled booking cannot be confirmed")
    }

    if (booking.status === 'Pending') {
        booking.status = 'Confirmed'

        // send confirmation mail
    }
    await booking.save({ validateBeforeSave: false })

    const updatedBooking = await Booking.findOne({ bookingToken: booking.bookingToken })

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBooking, "Booking Confirmed successfully"))
})

const getAllBookings = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const allBookings = await Booking.find({ restaurantId: resid })

    if (!allBookings) {
        throw new ApiError(404, "There is no any bookings")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allBookings, "All bookings fetched successfully"))
})

export {
    bookTable,
    updateBookingStatus,
    cancelBookTable,
    cancelBooking,
    getAllBookings,
}