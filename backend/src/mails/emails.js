import { createTransporter, sender } from "./gmailApi.config.js"
import { ApiError } from "../utils/ApiError.js"
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS } from "./emailTemplate.js"

const sendPasswordResetEmail = async (email, name, resetURL) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST.replace("{reset_link}", resetURL).replace("{userName}", name)
        })
    } catch (err) {
        throw new ApiError(500, `Error while sending mail: ${err}`)
    }
}

const sendResetSuccessMail = async (email, name) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: sender,
            to: `scan&Dine <${email}>`,
            subject: "password reset success",
            html: PASSWORD_RESET_SUCCESS.replace("{userName}", name),
        })

    } catch (err) {
        // console.log(err)
        throw new ApiError(500, `Error while sending reset success mail: ${err}`)
    }
}
export { sendPasswordResetEmail, sendResetSuccessMail }