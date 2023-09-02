import { Router } from "express";
const router = Router()

import * as couponController from "./controller/coupon.js"
import { validation } from "../../middleWare/validation.js";
import { endPoint } from "./coupon.endPoint.js";

router.post(`/` ,
auth(endPoint.couponCrud),
couponController.addCoupon)


export default router