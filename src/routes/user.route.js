import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(
    upload.fields([
        // accepting 2 feilds
        {
           name: "avatar",
           maxCount:1 
        },
        {
             name:"coverImage",
             maxCount:1,
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
// verify jwt will happen at the login and so the cookie willbe set so we can acces it directly
router.route("/refreshToken").post(refreshAccessToken)


export default router