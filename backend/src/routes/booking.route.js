import { Router } from "express"
import { bookTable, cancelBooking, cancelBookTable, getAllBookings, getBookingsByUserId, updateBookingStatus } from "../controllers/booking.controller.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/:resid/book-table").post(verifyJWT, bookTable)
router.route("/cancel/:bookingid").delete(verifyJWT, authRole, cancelBooking)
router.route("/update/:bookingid").patch(verifyJWT, authRole, updateBookingStatus)
// Route to get all bookings by a Amin Only   @Private
router.route("/:resid/all").get(verifyJWT, authRole, getAllBookings)
// Route to get all bookings by a specific user  @User only
router.route("/details/user/:userId").get(verifyJWT, getBookingsByUserId);
router.route("/:resid/cancel/:bookingid").patch(verifyJWT, cancelBookTable)

export default router