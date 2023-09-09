import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"



export  const addCategory = {
    body:joi.object().required().keys({
        name:globalValidationFields.name.required(),
        brandId:globalValidationFields.id
    }),
    file:globalValidationFields.file.required(),
}

export  const updateCategory = {
    body:joi.object().required().keys({
        name:globalValidationFields.name,
        brandId:globalValidationFields.id
    }),
    file:globalValidationFields.file,
    params:joi.object().required().keys({
        categoryId:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}

export  const searchByName = {
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({}),
    query:joi.object().required().keys({
        searchKey:joi.string().min(1).max(15).required(),
    }),
}

export  const deleteCategory = {
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({
        id:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}

export const getCategoryById ={
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({
        categoryId:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}


