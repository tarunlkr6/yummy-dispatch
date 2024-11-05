import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { addMenuReview, createMenuItem, deleteMenuItem, getMenuById, getMenuItem, getMenuReviews, updateMenuItem } from "../controllers/menu.controllers.js"

const router = Router()

router.route("/:resid/menu").get(getMenuItem)
router.route("/:resid/menu/:itemid").get(getMenuById)
router.route("/:resid/menu/add").post(verifyJWT, authRole, upload.fields([{
    name: 'image',
    maxCount: 3,
}]), createMenuItem)
router.route("/:resid/menu/:itemid").put(verifyJWT, authRole, upload.fields([{
    name: 'image',
    maxCount: 3
}]), updateMenuItem)
router.route("/:resid/menu/:itemid").delete(verifyJWT, authRole, deleteMenuItem)
router.route("/:resid/menu/:menuid/review").post(verifyJWT, addMenuReview)
router.route("/:resid/menu/:menuid/reviews").get(getMenuReviews)

export default router