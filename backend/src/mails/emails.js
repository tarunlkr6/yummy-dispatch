import { createTransporter, sender } from "./gmailApi.config.js"
import { ApiError } from "../utils/ApiError.js"

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: sender,
            to: email,
            subject: "test",
            text: "emaml"
        })
    } catch (err) {
        console.log(err)
        throw new ApiError(500, "Error while sending mail")
    }
}

const sendResetSuccessMail = async (email) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: sender,
            to: email,
            subject: "password reset success",
            text: "password reset success mail",
        })

    } catch (err) {
        console.log(err)
        throw new ApiError(500, "Error while sending reset success mail")
    }
}
export { sendPasswordResetEmail, sendResetSuccessMail }