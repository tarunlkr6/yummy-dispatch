import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/config.js";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`\nServer is running on port ${port}`)
        })
    })
    .catch((err) => {
        console.log("\nDatabase connection error ", err)
    })
