import { createTransporter, sender } from "./gmailApi.config.js"
import { ApiError } from "../utils/ApiError.js"
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, VERIFICATION_EMAIL, WELCOME_EMAIL } from "./emailTemplate.js"

const sendVerificationMail = async (recipient, username, verificationToken, next) => {

    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL.replace("{username}", username)
                .replace("{Verification code}", verificationToken)
        })
    } catch (err) {
        console.log(err)
        return next(ApiError(500, "Error while sending verification email"))
    }

}

const sendWelcomeMail = async (recipient, username, next) => {

    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient,
            subject: "Welcome",
            html: WELCOME_EMAIL.replace("{username}", username)
        })
    } catch (err) {
        console.log(err)
        return next(new ApiError(500, "Error while sending welcome email"))
    }

}

const sendPasswordResetEmail = async (email, name, resetURL, next) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST.replace("{reset_link}", resetURL).replace("{userName}", name)
        })
    } catch (err) {
        return next(new ApiError(500, `Error while sending mail: ${err}`))
    }
}

const sendResetSuccessMail = async (email, name, next) => {
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
        return next(new ApiError(500, `Error while sending reset success mail: ${err}`))
    }
}
export { sendPasswordResetEmail, sendResetSuccessMail, sendVerificationMail, sendWelcomeMail }