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

export  const updateCart = {
    body:joi.object().required().keys({
        productId:globalValidationFields.id,
        quantity:joi.number().integer().min(1).required()
    }),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({}),
}

export  const removeProductFromCart = {
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({
        id:globalValidationFields.id
    }),
    query:joi.object().required().keys({}),
}
