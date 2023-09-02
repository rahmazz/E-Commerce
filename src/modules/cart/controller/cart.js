import cartModel from "../../../../DB/models/cart.model.js";
import productModel from "../../../../DB/models/product.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import { ReasonPhrases, StatusCodes } from "http-status-codes";






export const addToCart = async(req,res,next) => {
    const {productId , quantity} = req.body

    const productExist = await productModel.findById(productId)
    if (!productExist) {
        return next(new ErrorClass('product not exist',StatusCodes.NOT_FOUND))
    }
    if (productExist.stock < quantity || productExist.isDeleted) {
        await productModel.updateOne({ _id:productId },
            {$addToSet:{wishingList:req.user._id}})
        return next(new ErrorClass(`quantity out of stock Max available is ${productExist.stock}`))
    }
    const cart = await cartModel.findOneAndUpdate(
        {userId:req.user._id},
        {$push:{products:{productId,quantity}}},
        {new:true}
        )
        
        res.status(StatusCodes.CREATED).json({message:"done", cart})  
    
}