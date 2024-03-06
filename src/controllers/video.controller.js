import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // add pagination
    const lastVideoId = req.body;


    const videoObj = await Video.find({})
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const id = req.user._id;
    if(!id) throw new ApiError(404, "login first")
    const userdetails = await User.findById(id).select(
        "username"
    );
    console.log(userdetails);
    if(!userdetails) throw new ApiError(404,"user doesnt exist");

    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if(!videoLocalPath || !thumbnailLocalPath) throw new ApiError(404,"Something went wrong")

    const videoObject = await uploadOnCloudinary(videoLocalPath);
    const thumbnailObject = await uploadOnCloudinary(thumbnailLocalPath);
  
    if(!videoObject || !thumbnailObject) throw new ApiError(404,"unable to upload the video")
    //console.log(videoObject.url);
    //console.log(videoObject.duration)
  
    const uploadedVideo = await Video.create({
        videoFile: videoObject?.url,
        thumbnail: thumbnailObject?.url,
        title,
        description,
        duration:videoObject?.duration,
        isPublished:true,
        owner:userdetails
    })
    if(!uploadedVideo) throw new ApiError(500, "something went wrong while uploading the video")
return res.status(201).json(
    new ApiResponse(201, uploadedVideo, "Video Upload successfulll")
)

})

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        if(!videoId) throw new ApiError(403,"Bad Params",videoId);
        const videoObj = await Video.findById(videoId);
        if(!videoObj) throw new ApiError(403,"video doesnt exist, first upload a video")
        return res.status(201).json(
             new ApiResponse(200, videoObj, "Video Updated successfulllyy ")
         )
      }
    catch (error) {
             throw new ApiError(403,"Unable to update the video", error)
   }
})

const updateVideo = asyncHandler(async (req, res) => {
   try {
     const { videoId } = req.params
     const {title, description} = req.body;
     console.log(videoId)
     if(!videoId) throw new ApiError(403,"Bad Params",videoId);
     const thumbnailLocalPath =  req.file?.path;
     console.log("req.", req.file.path,"FILES \n", req.files)
  
     if(!thumbnailLocalPath) throw new ApiError(403,"cannot gert thumbnail");
     const thumbnailObject = await uploadOnCloudinary(thumbnailLocalPath);
     if(!thumbnailObject) throw new ApiError(500,"Unable to upload on cloudnary");
     const videoObj = await Video.findByIdAndUpdate(videoId, {
        title: title,
        description: description,
        thumbnail: thumbnailObject?.url
     }, {
         new:true
     })
     if(!videoObj) throw new ApiError(403,"video doesnt exist, first upload a video")
 
     return res.status(201).json(
         new ApiResponse(200, videoObj, "Video Updated successfulllyy ")
     )
   } catch (error) {
    throw new ApiError(403,"Unable to update the video", error)
   }

})

const deleteVideo = asyncHandler(async (req, res) => {try {
    
        const { videoId } = req.params
        const resp = await Video.findByIdAndDelete(videoId)
        if(!resp) throw new ApiError(403,"unable to delete the video")
     
        return res.status(201).json(
            new ApiResponse(200, resp, "deleted the video successfulllyy ")
        )
} catch (error) {
    throw new ApiError(403,"Unable to delete the video", error)
}
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const {status} = req.body;
        console.log(videoId)
        if(!videoId || !status) throw new ApiError(403,"Bad Params",videoId);
        const videoObj = await Video.findByIdAndUpdate(videoId, {
          isPublished: status.toLowerCase().trim()==='true'?true:false
         }, {
             new:true
         })
         if(!videoObj) throw new ApiError(403,"unable to update the status")
     
         return res.status(201).json(
             new ApiResponse(200, videoObj, "Updated Video publish status successfulllyy ")
         )

    } catch (error) {
        throw new ApiError(403,"Unable to update the video publish status", error)
    }
})





export {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
}