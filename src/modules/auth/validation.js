import joi from "joi";
import { globalValidationFields } from "../../middleWare/validation.js";

export const signup = {body:joi.object({
                email: globalValidationFields.email,
                password: globalValidationFields.password,
                cpassword: globalValidationFields.cpassword,
                userName: globalValidationFields.userName,
                phone: globalValidationFields.phone,
                age:globalValidationFields.age,
                gender: globalValidationFields.gender,
                role:joi.string().valid("User" , "Admin"),
                DOB: joi.date()
        }).required()

}


export const signIn = {
        body:joi.object({
                email:globalValidationFields.email,
                password:globalValidationFields.password,
        }).required()
}

export const confirmemail ={body:joi.object({
        code:globalValidationFields.code}).required()
}

export const sendChangePasswordCode ={
   body:joi.object({
        email:globalValidationFields.email,
}).required()
}


export const resetPassword ={
   body:joi.object({
        email:globalValidationFields.email,
        code:globalValidationFields.code,
        password:globalValidationFields.password,
        cpassword:globalValidationFields.cpassword
}).required()
}
