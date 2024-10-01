import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { registerRestaurant } from "../controllers/restaurant.controllers.js"

const router = Router()

router.route("/register").post(verifyJWT, authRole, upload.fields([{ name: 'avatar', maxCount: 1, }]), registerRestaurant)

export default router