import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"



export  const addCoupon = {
    body:joi.object().required().keys({
        code:globalValidationFields.name.required(),
        expireDate:joi.date().min(Date.now()).required(),
        amount:joi.number().min(1).max(100).required(),
        numOfUse:joi.number().integer()
    }),
    file:globalValidationFields.file,
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({}),
}

export  const updateCoupon = {
    body:joi.object().required().keys({
        code:globalValidationFields.name,
        expireDate:joi.date().min(Date.now()),
        amount:joi.number().min(1).max(100),
        numOfUse:joi.number().integer()
    }),
    file:globalValidationFields.file,
    params:joi.object().required().keys({
        id:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}


