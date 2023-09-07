import orderModel from "../../../../DB/models/order.model.js";
import productModel from "../../../../DB/models/product.model.js"
import reviewModel from "../../../../DB/models/review.model.js";
import { ErrorClass } from "../../../utils/errorClass.js"
import { StatusCodes } from "http-status-codes";



export const createReview = async(req,res,next) =>{
    const { productId }=req.paramd
    const {comment , rating}=req.body
    const order = await orderModel.findOne({
        userId:req.user._id ,
        status:"delivered" ,
        "products.productId":productId})
    if (!order) {
        return next (new ErrorClass("you can't review this order before receive it",StatusCodes.NOT_FOUND))
    }
    const checkReview = await reviewModel.findOne({ createdBy:req.user._id , productId , orderId:order._id})
    if (checkReview) {
        return next (new ErrorClass("you already reviewed this product",StatusCodes.CONFLICT))
    }
    const review =  await reviewModel.create({Comment,productId,orderId:order_id,rating})

    res.status(201).json({message:"done",review})

}

export const updateReview = async(req,res,next) =>{
    const { productId, reviewId}=req.paramd
    const updateReview = await reviewModel.findOne({ _id :reviewId, productId },req.body)
    res.status(201).json({message:"done",updateReview})
}