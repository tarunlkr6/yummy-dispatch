import dotenv from "dotenv"
import nodemailer from "nodemailer"
import { google } from "googleapis"
dotenv.config({
    path: './.env'
})

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

export async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken()
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.SERVICE_MAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        }
    })
}

export const sender = {
    email: process.env.SERVICE_MAIL,
    name: process.env.SENDER_NAME,
}