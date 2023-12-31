import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"

export  const addsubCategory = {
    body:joi.object().required().keys({
        name:globalValidationFields.name.required(),
    }),
    file:globalValidationFields.file.required(),
    params:joi.object().required().keys({
        categoryId:globalValidationFields.id
    }),
    query:joi.object().required().keys({}),
}


export  const updateSubCategory = {
    body:joi.object().required().keys({
        name:globalValidationFields.name
    }),
    file:globalValidationFields.file,
    params:joi.object().required().keys({
        SubCategoryId:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}

export  const deleteSubCategory = {
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({
        id:globalValidationFields.id 
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

export const getSubCategoryById ={
    body:joi.object().required().keys({}),
    params:joi.object().required().keys({
        SubCategoryId:globalValidationFields.id 
    }),
    query:joi.object().required().keys({}),
}