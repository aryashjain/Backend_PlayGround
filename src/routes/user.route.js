import { Router } from "express";
import { 
    loginUser,
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAvatar, 
    updateCoverImage, 
    updateUserDetails,
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


//upload.fields for 2 files and upload.single for 1 file
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
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/logout").post(verifyJWT,logoutUser)

// update user details
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/update-userDetails").patch(verifyJWT, updateUserDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

// verify jwt will happen at the login and so the cookie willbe set so we can acces it directly
router.route("/refreshToken").post(refreshAccessToken)


// 
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)

// TODO:  DELETE ACCOUNT FOREVER


export default router