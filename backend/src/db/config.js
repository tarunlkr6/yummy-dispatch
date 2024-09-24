import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log("Database Connection Error ", err)
        process.exit(1)
    }
}

export default connectDB