import { Router } from "express";
import {practiceController} from "../controllers/practice.controller.js"

const practiceRoute = Router()

practiceRoute.route("/practice").get(practiceController)


export default practiceRoute;


