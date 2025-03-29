import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minLength: [8, "password must be in between 8 to 14 characters"],
        maxLength: [14, "password must be in between 8 to 14 characters"],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiry: {
        type: Date,
    },
}, { timestamps: true })

userSchema.index({ verificationTokenExpiry: 1, passwordResetTokenExpiry: 2 }, { expireAfterSeconds: 300 })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        restaurantId: this.restaurantId,
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        restaurantId: this.restaurantId,
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateResetToken = function () {
    const token = crypto.randomBytes(20).toString("hex")

    this.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex")

    this.passwordResetTokenExpiry = Date.now() + 5 * 60 * 1000

    return token
}

export const User = mongoose.model("User", userSchema)