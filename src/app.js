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
import testRoute from "./routes/testRoute.route.js";
import tweetRouter from "./routes/tweet.route.js";
// import subscriptionRouter from "./routes/subscription.route.js";
 import videoRouter from "./routes/video.route.js";
 import commentRouter from "./routes/comment.route.js";
// import likeRouter from "./routes/like.route.js";
// import playlistRouter from "./routes/playlist.route.js";
// import dashboardRouter from "./routes/dashboard.route.js";


// routes declare
app.use("/users",userRoute);
app.use("/yo",healthCheck)
app.use("/test",testRoute)
app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
 app.use("/api/v1/videos", videoRouter)
 app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

export { app }