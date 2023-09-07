import { Router } from "express";
const router = Router({mergeParams:true})

import * as reviewsController from "./controller/review.js"
import { validation } from "../../middleWare/validation.js";
import * as validators from "./validation.js"
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./review.endPoint.js";

router.post(`/` ,
auth(endPoint.reviewCrud),
validation(validators.createReview),
reviewsController.createReview)

router.put(`/` ,
auth(endPoint.reviewCrud),
validation(validators.updateReview),
reviewsController.updateReview)


export default router