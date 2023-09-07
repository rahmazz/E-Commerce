import { Router } from "express";
const router = Router()

import * as couponController from "./controller/coupon.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { endPoint } from "./coupon.endPoint.js";
import { auth } from "../../middleWare/authontication.js";
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { idVal } from "../../utils/globalValidation.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";

router.post( `/`,
        auth(endPoint.couponCrud),
        fileUpload(fileValidation.image).single('image'),
        validation(validatores.addCoupon),
        asyncHandeller(couponController.addCoupon))
router.route(`/:id`)
    .delete( 
        auth(endPoint.couponCrud),
        validation(idVal),
        couponController.deleteCoupon)
    .patch( 
        auth(endPoint.couponCrud),
        fileUpload(fileValidation.image).single('image'),
        validation(validatores.updateCoupon),
        couponController.updateCoupon)
    .get( 
        auth(endPoint.couponCrud),
        validation(idVal),
        couponController.getCouponById)



export default router