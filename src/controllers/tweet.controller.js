import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    try {
        const id = req.user._id;
        if(!id) throw new ApiError(403,"Login first");
        const content = req.body;
        const userData = await User.findById(id).select("username");
        const tweet = await Tweet.create({
            owner:userData,
            content:content,
        })
        if(!tweet) throw new ApiError(403,"Login first");   
    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweeted successfully"))
    } catch (error) {
        throw new ApiError(500,"Unable to twweeet");
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const id=req.user._id
    const userData = await User.findById(id).select("username");
    if(!id) throw new ApiError(403,"user doesnt exist or is not logged in");
    const tweets = await User.find(userData);
    if(!tweets) throw new ApiError(403,"no tweets");
    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweeted successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content, tweetId}= req.body;

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {content, tweetId}= req.body;
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}