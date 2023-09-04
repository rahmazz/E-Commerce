import joi from "joi"
import { Types } from "mongoose"
// import * as validatores from "../modules/auth/validation.js"
const dataMethods = [ 'body' , 'params' , 'headers' , 'files' , 'query']


export const validation = (joiSchema) =>{
    return (req,res,next) => {
        const ValidationErr=[]
        dataMethods.forEach(key =>{
            if (joiSchema[key]) {
                const validationResult = joiSchema[key].validate(req[key] , { abortEarly: false})
                if (validationResult.error) {
                    ValidationErr.push(validationResult.error.details)
                }
            }
        })
        if (ValidationErr.length > 0) {
            res.json({message:"Validation Error" ,ValidationErr})
        }
        return next()
    } 
}


const validateObjectId = ( value , helper) =>{
    return Types.ObjectId.isValid(value) ? true : helper.message('In-Valid object-Id from validation')
}


export const globalValidationFields = {
    email:joi.string().email({ minDomainSegments:2 , maxDomainSegments:3 , tlds:{ allow: [ 'com' , 'edu' , 'eg' , 'net'] } }).required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    cpassword:joi.string().valid(joi.ref("password")).required(),
    userName:joi.string().alphanum().min(3).max(15).required(),
    name:joi.string().min(3).max(20),
    fName:joi.string().min(3).max(15).required(),
    lName:joi.string().min(3).max(15).required(),
    age:joi.number().integer().positive().min(18).max(95),
    phone:joi.string().min(11).max(11).required(),
    id:joi.string().custom(validateObjectId).required(),
    gender:joi.string().valid("male" , "female"),
    code:joi.string().min(6).max(6).required(),
    file:joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),
    }),
    authorization:joi.string().required(),
}









//في حاله اني هعمل joi.object واحد بس استلم فيه الداتا بتاعتي كلها مش هقسمهم لkeys
// export const validation = (schema) =>{
//     return (req,res,next) =>{
// const dataFromAllMethods = {...body , ...params , ...query , ...headers , ...files}
//         const validationResult = schema.validate(dataFromAllMethods , { abortEarly: false})
//             if (validationResult.error) {
//                 res.json({message:"Validation Error" , ERR: validationResult.error.details})
//             }
//             return next()
// }
// }