import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { getRestaurant, registerRestaurant, getRestaurantById, addRestaurantReview, getRestaurantReview } from "../controllers/restaurant.controllers.js"

const router = Router()

router.route("/all").get(getRestaurant)
router.route("/register").post(verifyJWT, authRole, upload.fields([{ name: 'avatar', maxCount: 1, }]), registerRestaurant)
router.route("/:id").get(getRestaurantById)
router.route("/:resid/review/add").post(verifyJWT, addRestaurantReview)
router.route("/:resid/reviews").get(getRestaurantReview)

export default router