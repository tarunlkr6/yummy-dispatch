import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

dotenv.config({
    path: "./.env"
})

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
    try {
        if (!path) return null
        const response = await cloudinary.uploader.upload(path, { resource_type: "auto", folder: "/yummy-dispatch" })
        //console.log(response)
        //console.log("File uploaded on cloudinary. File src: " + response.url)
        fs.unlinkSync(path)
        return response
    } catch (err) {
        console.log(err)
        fs.unlinkSync(path)
        return null
    }
}

export { uploadOnCloudinary }