import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"


export const changepassword = {
    body:joi.object({
            password:globalValidationFields.password,
            cpassword:globalValidationFields.cpassword,
            }).required(),
    headers:joi.object({
        authorization:globalValidationFields.authorization,
    }).required(),
}


export const update = {
    body:joi.object({
        fName:globalValidationFields.fName,
        lName:globalValidationFields.lName,
        age:globalValidationFields.age,
        }).required(),
    headers:joi.object({
        authorization:globalValidationFields.authorization,
    }).required(),
}



export const userprofile  = {
    headers:joi.object({
        authorization:globalValidationFields.authorization,
    }).required(),
}


export const deleteuser = {
    headers:joi.object({
        authorization:joi.string().required(),
    }).required(),
}


export const softdeleteuser ={
    headers:joi.object({
        authorization:globalValidationFields.authorization,
    }).required()
}



export const logout ={
    headers:joi.object({
        authorization:globalValidationFields.authorization,
    }).required(),
}


