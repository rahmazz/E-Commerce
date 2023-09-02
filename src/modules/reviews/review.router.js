import { Router } from "express";
const router = Router()

import * as reviewsController from "./controller/review.js"
import { validation } from "../../middleWare/validation.js";

router.post(`/` ,reviewsController)


export default router