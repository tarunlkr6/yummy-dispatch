import express from "express"
import cors from "cors"

const app = express()

//app config
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// common middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.get("/",(req,res) => {
    res.send("API Is Working");
})
// import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import restaunatRouter from "./routes/restaurant.routes.js"
import { foodRouter } from "./routes/foodRoute.js"

// routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/restaurant", restaunatRouter)
app.use('/api/food',foodRouter)
app.use('/images',express.static('uploads'))// mount the(uploads) folder at this end point





export { app }