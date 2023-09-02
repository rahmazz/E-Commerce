import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"



export  const addToCart = {
    body:joi.object().required().keys({
        productId:globalValidationFields.id,
        quantity:joi.number().integer().min(1).required()
    }),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({}),
}

// export  const updateCoupon = {
//     body:joi.object().required().keys({
//         name:globalValidationFields.name
//     }),
//     file:globalValidationFields.file,
//     params:joi.object().required().keys({
//         CouponId:globalValidationFields.id 
//     }),
//     query:joi.object().required().keys({}),
// }

// export  const searchByName = {
//     body:joi.object().required().keys({}),
//     params:joi.object().required().keys({}),
//     query:joi.object().required().keys({
//         searchKey:joi.string().min(1).max(15).required(),
//     }),
// }

// export  const deleteCoupon = {
//     body:joi.object().required().keys({}),
//     params:joi.object().required().keys({
//         id:globalValidationFields.id 
//     }),
//     query:joi.object().required().keys({}),
// }

// export const getCouponById ={
//     body:joi.object().required().keys({}),
//     params:joi.object().required().keys({
//         CouponId:globalValidationFields.id 
//     }),
//     query:joi.object().required().keys({}),
// }


