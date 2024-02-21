import  express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors"



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes

import userRoute from "./routes/user.route.js"
import healthCheck from "./routes/healthcheck.route.js";
import testRoute from "./routes/testRoute.route.js"

// routes declare

app.use("/users",userRoute);
app.use("/yo",healthCheck)
app.use("/test",testRoute)

export { app }