import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { createMenuItem, deleteMenuItem, getMenuItem, updateMenuItem } from "../controllers/menu.controllers.js"

const router = Router()

router.route("/:resid/menu").get(getMenuItem)
router.route("/:resid/menu/add").post(verifyJWT, authRole, upload.fields([{
    name: 'image',
    maxCount: 3,
}]), createMenuItem)
router.route("/:resid/menu/:itemid").patch(updateMenuItem)
router.route("/:resid/menu/:itemid").delete(deleteMenuItem)

export default router