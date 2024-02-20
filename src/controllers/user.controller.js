import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";



// generate access and refresh token .... kind of utils

const generateAccessandRefreshToken =  async(userId) =>{
    try {
        const user = await User.findById(userId);
        const refreshToken =await user.generateRefreshToken()
        const accessToken =await user.generateAccessToken()

        // add to user and save on db
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})
        
        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refreshtoken/accesstoken")
    }
}


const registerUser = asyncHandler( async (req,res) =>{
const {fullName, email, username, password} = req.body
// take data from resp , check user exist , if not create new user and save the details
if(!username) throw new ApiError(400, "userName is required")

if([fullName, email, username, password].some((field)=> field?.trim() ==="")) {
    throw new ApiError(400, "All fields are required");
}

const exists = await User.findOne({
    $or: [{username}, {email}]
})

if(exists) throw new ApiError(409, "USERNAME OR EMAIL ALREADY EXISTS, TRY WITH NEW ONE")

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath) throw new ApiError(400, "AVATAR IS REQUIRED")

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath);   
console.log(avatar)
console.log(coverImage)

if(!avatar) throw new ApiError(400, "AVATAR IS REQUIRED")

const user = await User.create({
    fullName,
    avatar: avatar?.url||'nahichalacloudinary',
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
);

if(!createdUser) throw new ApiError(500, "something went wrong while registerigbg the user")
return res.status(201).json(
    new ApiResponse(200, createdUser, "USER REGISTERED SUCESSFULLY")
)
})

const loginUser = asyncHandler( async (req,res)=>{
   // get username, email , password from the user
   // find username/ email
   // validate the user and check password
   // generate a access and refresh token of the user
   // send in secure cookies

   const {email, username, password} = req.body;
   if(!email && !username) throw new ApiError(400, "username or email is required");

   const  user = await User.findOne({   
        $or: [{username},{email}]
    })

    if(!user) throw new ApiError(404, "NO USER :( Register first")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, "Invalid user creds");

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id);
    
    // send in cookies 
    const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

     return res
     .status(200)
     .cookie("accessToken",accessToken)
     .cookie("refreshToken", refreshToken, options)
     .json(
        new ApiResponse(
            200,{
                user: loggedInuser, accessToken, refreshToken
            },
            "user logged in succrees"
        )
     )

})

const logoutUser = asyncHandler(async(req, res)=>{
 const id = req.user._id;
 await User.findByIdAndUpdate(id,{
    $set: {
        refreshToken: undefined
    }
},
{
    new:true
}
)

const options = {
    httpOnly: true,
    secure: true
}

return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200, {}, "user logged out succesfully"))


})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const {oldRefreshToken} = req.cookie.refreshToken || req.body.refreshToken; 
    
    if(!oldRefreshToken) throw new ApiError(401, " unauthorized : could not find refresh token");

    try {
        
        const decodedToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id);
        if(!user) throw new ApiError(401, " unauthorized :  invalid refresh token");
        if( oldRefreshToken !== user.refreshToken) throw new ApiError(401, " unauthorized :  token doesnt match");
        const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(user._id);
        
        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res
        .status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
           new ApiResponse(
               200,{accessToken,newRefreshToken},
               "user tokens refreshed"
           )
        )
        
    } catch (error) {
        throw new ApiError(400, error?.message||"cannot refresh token");
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}