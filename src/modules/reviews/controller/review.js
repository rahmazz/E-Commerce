import orderModel from "../../../../DB/models/order.model.js";
import productModel from "../../../../DB/models/product.model.js"
import reviewModel from "../../../../DB/models/review.model.js";
import { ErrorClass } from "../../../utils/errorClass.js"
import { StatusCodes } from "http-status-codes";



export const createReview = async(req,res,next) =>{
    const { productId }=req.params
    const {comment , rating}=req.body
    const product = await productModel.findById(productId)
    if (!product) {
        return next (new ErrorClass("product not found ",StatusCodes.NOT_FOUND))
    }
    const order = await orderModel.findOne({
        userId:req.user._id ,
        status:"delivered" ,
        "products.productId":productId})
    if (!order) {
        return next (new ErrorClass("you can't review this order ",StatusCodes.BAD_REQUEST))
    }
    const checkReview = await reviewModel.findOne({ createdBy:req.user._id , productId , orderId:order._id})
    if (checkReview) {
        return next (new ErrorClass("you already reviewed this product",StatusCodes.CONFLICT))
    }
    const review =  await reviewModel.create({comment,productId,orderId:order._id,rating,createdBy:req.user._id})

    // const oldAvg = product.avgRate
    // const oldRateNo = product.rateNum
    // const oldSum = oldAvg * oldRateNo
    // const newSum = oldSum + rating
    // const newAvg = newSum / (oldRateNo+1)
    const newAvg = ((product.avgRate * product.rateNum) + rating )/ (product.rateNum+1)
    product.avgRate = newAvg 
    product.rateNum = product.rateNum + 1 
    await product.save()

    return res.status(201).json({message:"done",review})
}




export const updateReview = async(req,res,next) =>{
    const {reviewId}=req.params
    const review = await reviewModel.findById(reviewId)
    if (!review) {
        return next (new ErrorClass("review not found ",StatusCodes.NOT_FOUND))
    }
    const updateReview = await reviewModel.updateOne({ _id :reviewId, productId:review.productId },req.body)
    if (req.body.rating) {
        const product = await productModel.findById(review.productId)
        const newAvg = (((product.avgRate * product.rateNum) - review.rating ) + req.body.rating)/ (product.rateNum)
        product.avgRate = newAvg 
        await product.save()
        review.rating = req.body.rating
    }
    
    return res.status(201).json({message:"done",updateReview})
}


export const deleteReview = async(req,res,next) =>{
    const { reviewId}=req.params
    const review = await reviewModel.findByIdAndDelete(reviewId)
    if (!review) {
        return next (new ErrorClass("review not found ",StatusCodes.NOT_FOUND))
    }
        const product = await productModel.findById(review.productId)
        const newAvg = product.rateNum == 1 ? 0:((product.avgRate * product.rateNum) - review.rating ) / (product.rateNum - 1)
        product.avgRate = newAvg 
        product.rateNum = product.rateNum - 1 
        await product.save()
    
    return res.status(201).json({message:"done",updateReview})
}


export const getProductReviews = async(req,res,next) =>{
    const { productId}=req.params
    const review = await reviewModel.find({productId}).populate([{
        path:'createdBy',
        select:'userName phone image email'
    }])
    
    return res.status(201).json({message:"done",review})
}


