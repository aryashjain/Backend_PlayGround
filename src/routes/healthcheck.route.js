import { Router } from "express";
const router = Router();

 router.route('/healthCheck').get((req,res)=>{
    res.send(200).json({
        message:"yayyyy"
    })
})
export default router