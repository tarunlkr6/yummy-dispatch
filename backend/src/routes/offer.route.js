import { Router } from "express"
import { verifyJWT, authRole } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { createOffer, deleteOffer, getOffers } from "../controllers/offer.controller.js"

const router = Router()

router.route("/:resid/offer/create").post(verifyJWT, authRole, upload.fields([{ name: 'offerImage', maxCount: 1, }]), createOffer)
router.route("/:resid/offer/delete/:offerid").delete(verifyJWT, authRole, deleteOffer)
router.route("/:resid/offers").get(getOffers)

export default router