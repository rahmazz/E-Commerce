import joi from "joi";
import { globalValidationFields } from "../../middleWare/validation.js";




export const  createOrder ={
    body:joi.object().required().keys({
        address:joi.string().required(),
        status:joi.string().valid('canceled','waitPayment','placed','rood','rejected','delivered'),
        notes:joi.string().max(100).min(1),
        reason:joi.string().max(100),
        couponCode:globalValidationFields.name,
        phone:globalValidationFields.phone,
        paymentMethod:joi.string().valid("cash","card"),
        products:joi.array().items(
            joi.object().required().keys({
                productId:globalValidationFields.id,
                quantity:joi.number().integer().positive().min(1).required(),
            }))
        .min(1)
    })
}