import userModel from "../../../../DB/models/user.model.js";
import productModel from "../../../../DB/models/product.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";




export const addToFavourites = async(req,res,next) =>{
    const {productId} = req.body
    const isProductExist = await productModel.findById(productId)
    if (!isProductExist) {
        return next(new ErrorClass("product not found",StatusCodes.NOT_FOUND))
    }
    const user = await userModel.updateOne({_id:req.user._id},{$addToSet:{favourites:productId}})
    res.json(user)
}



export const getUserFavourites = async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('favourites')
    user.favourites = user.favourites.filter((ele) => {
        if (ele) {
            return ele;
        }
    });
    res.status(StatusCodes.ACCEPTED).json({ message: "done", favourites:user.favourites });
    };