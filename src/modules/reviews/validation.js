import joi from "joi";
import { globalValidationFields } from "../../middleWare/validation.js";




export const  createReview ={
    body:joi.object().required().keys({
        comment:joi.string().required().min(3).max(100),
        rating:joi.number().max(5).min(0).positive(),
        productId:globalValidationFields.id,
    })
}

export const  updateReview ={
    body:joi.object().required().keys({
        comment:joi.string().required().min(3).max(100),
        rating:joi.number().max(5).min(0).positive(),
    }),
    params:joi.object().required().keys({
        productId:globalValidationFields.id,
        reviewId:globalValidationFields.id,
    })
}