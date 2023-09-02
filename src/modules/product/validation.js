import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"
const arrayParsing = ((value, helper) => {
    value = JSON.parse(value)
    const valueSchema = joi.object({
        value:joi.array().items(joi.string())
    })
    const validationResult = valueSchema.validate({value})
    if (validationResult.error) {
        return helper.message(validationResult.error.details)
    }
    return true
})


export const addProduct = {
    body:joi.object().required().keys({
        name:globalValidationFields.name,
        description:globalValidationFields.name.min(20),
        price:joi.number().min(0).positive().required(),
        discount:joi.number().min(0).max(100).positive(),
        quantity:joi.number().min(0).positive().integer(),
        colors:joi.custom(arrayParsing),
        sizes:joi.custom(arrayParsing),
        categoryId:globalValidationFields.id,
        brandId:globalValidationFields.id,
        subcategoryId:globalValidationFields.id,
        files:joi.object().required().keys({
            image:joi.array().items(globalValidationFields.file).length(1).required(),
            coverImages:joi.array().items(globalValidationFields.file).max(5),
        })
    }),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({})
}
