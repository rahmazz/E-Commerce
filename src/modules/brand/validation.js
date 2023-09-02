import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"



export  const addBrand = {
    body:joi.object().required().keys({
        name:globalValidationFields.name
    }),
    file:globalValidationFields.file.required(),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({}),
}

export  const updateBrand = {
    body:joi.object().required().keys({
        name:globalValidationFields.name
    }),
    file:globalValidationFields.file.required(),
    params:joi.object().required().keys({
        id:globalValidationFields.id
    }),
    query:joi.object().required().keys({}),
}

export  const getAllBrands = {
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({}),
}