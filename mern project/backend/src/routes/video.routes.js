import { Router } from "express";
import { videoController } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/configervideo").get(videoController)

export default videoRouter
