import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { getRestaurant, registerRestaurant, getRestaurantById } from "../controllers/restaurant.controllers.js"
import { createMenuItem, deleteMenuItem, getMenuItem, updateMenuItem } from "../controllers/menu.controllers.js"

const router = Router()

router.route("/register").post(verifyJWT, authRole, upload.fields([{ name: 'avatar', maxCount: 1, }]), registerRestaurant)
router.route("/all").get(getRestaurant)
router.route("/:id").get(getRestaurantById)
router.route("/:id/menu").get(getMenuItem)
router.route("/:id/add").post(verifyJWT, authRole, upload.fields([{
    name: 'image',
    maxCount: 3,
}]), createMenuItem)
router.route("/restaurant/:id/menu/:id").patch(updateMenuItem)
router.route("/restaurant/:id/menu/:id").delete(deleteMenuItem)


export default router