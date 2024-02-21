import { Router } from "express";
import { testController } from "../controllers/test.controller.js";

const router = Router();


router.route("/t").get(testController)



export default router