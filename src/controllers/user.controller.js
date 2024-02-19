import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



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
console.log(avatarLocalPath, " --<", coverImageLocalPath)
if(!avatarLocalPath) throw new ApiError(400, "AVATAR IS REQUIRED")

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath);   
console.log(avatar)
console.log(coverImage)

//if(!avatar) throw new ApiError(400, "AVATAR IS REQUIRED")

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

export {
    registerUser,
}