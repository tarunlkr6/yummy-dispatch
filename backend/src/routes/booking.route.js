import { Router } from "express"
import { bookTable, cancelBooking, cancelBookTable, getAllBookings, updateBookingStatus } from "../controllers/booking.controller.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/:resid/book-table").post(verifyJWT, bookTable)
router.route("/cancel/:bookingid").patch(verifyJWT, cancelBookTable)
router.route("/cancel/:bookingid").delete(verifyJWT, authRole, cancelBooking)
router.route("/update/:bookingid").patch(verifyJWT, authRole, updateBookingStatus)
router.route("/:resid/all").get(verifyJWT, authRole, getAllBookings)

export default router