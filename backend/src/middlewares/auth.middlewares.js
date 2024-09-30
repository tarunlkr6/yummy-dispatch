import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Unauthorized")
        }

        req.user = user
        next()
    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid access token")

    }
})

const authRole = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        throw new ApiError(401, "Permission denied, contact admin")
    }
})

export {
    verifyJWT,
    authRole,
}