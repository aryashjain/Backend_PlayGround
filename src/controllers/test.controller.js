import { asyncHandler } from "../utils/asyncHandler.js";
const testController = asyncHandler( async (req,res) =>{
res.status(200).json({
    message:"ok tested "
})
})

export {
    testController,
}