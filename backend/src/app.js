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


// import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import restaurantRouter from "./routes/restaurant.routes.js"
import menuRouter from "./routes/menu.route.js"
import bookingRouter from "./routes/booking.route.js"

// routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/restaurant", restaurantRouter)
app.use("/api/v1", menuRouter)
app.use("/api/v1/booking", bookingRouter)




export { app }