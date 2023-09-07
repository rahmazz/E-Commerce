import joi from "joi"
import { globalValidationFields } from "../../middleWare/validation.js"


export const addToFavourites = {
    body:joi.object().required().keys({
        productId:globalValidationFields.id,
    }),
    
}


