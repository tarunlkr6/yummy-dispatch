import { Router } from "express"
import { registerUser, logoutUser, loginUser, refreshAccessToken } from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// sercured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router