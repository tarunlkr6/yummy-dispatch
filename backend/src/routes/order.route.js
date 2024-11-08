import { Router } from "express"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { addItem, getMyOrders, getOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js"

const router = Router()

router.route("/:resid/order/place-order").post(verifyJWT, placeOrder)
router.route("/orders").get(verifyJWT, getMyOrders)
router.route("/orders/:resid").get(verifyJWT, authRole, getOrders)
router.route("/order/:orderid/add-item").put(verifyJWT, addItem)
router.route("/order/:orderid/update").patch(verifyJWT, authRole, updateOrderStatus)

export default router