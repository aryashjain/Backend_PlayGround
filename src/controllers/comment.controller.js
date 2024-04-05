import {Comment} from "../models/comments.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
   // const {page = 1, limit = 10} = req.query
    if(!videoId) throw new ApiError(403, "Invalid video id");

    // todo: write pagination algo
    const comments = await Comment.find({
        'videoId':videoId
    })
    if(!comments) throw new ApiError(403,"could not fetch comments with the given video id");
 
    return res.status(201).json(
        new ApiResponse(200,comments, "COMMENTS ->")
    )
})


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
   try {
     const {videoId} = req.params
     const {content , owner} = req.body;
 
  if(!videoId || !content || !owner) throw new ApiError(403, "Invalid fields retry");
  const comment = await Comment.create({
     content,
     owner,
     videoId
  })
  return res.status(201).json(
    new ApiResponse(200,comment, "Comment posted")
)

   } catch (error) {
    throw new ApiError(403,"could not post comment");
   }
})

const updateComment = asyncHandler(async (req,res)=>{
    try {
        const commentId = req.params;
        const updatedContent = req.body;
        if(!commentId || !updatedContent)  throw new ApiError(403,"invalid details");
        const comment = await Comment.findOneAndUpdate(commentId,{
            $set:{
                content:updateContent
            }
        },{
                new:true
            });
        if(!comment)  throw new ApiError(403,"Could not find and update comment");
        return res.status(201).json(
            new ApiResponse(200,comment, "Comment updated")
        )
    } catch (error) {
        throw new ApiError(403,"could not update comment",error);
    }
})


const deleteComment = asyncHandler(async (req, res)=>{
    try {
        const commentId = req.params;
        const resp = await Comment.findOneAndDelete(commentId);
        return res.status(201).json(
            new ApiResponse(200,resp, "Comment deleted")
        )
    } catch (error) {
        throw new ApiError(403,"could not delete comment",error);
    }
})





export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }