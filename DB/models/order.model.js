import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
    {
        userId:{
            type:Types.ObjectId,
            ref:'User',
            required:true ,
            unique:true,
        },
        couponId:{
            type:Types.ObjectId,
            ref:'Coupon',
        },
        address:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        notes:{
            type:String,
        },
        price:{
            type:Number,
            required:true
        },
        paymentPrice:{
            type:Number,
            required:true
        },
        paymentMethod:{
            type:String,
            enum:['cash','card'],
            default:'cash'
        },
        status:{
            type:String,
            enum:['canceled','waitPayment','placed','rood','rejected','delivered'],
            default:'placed'
        },
        reason:{
            type:String,
        },
        allProducts:[{
            _id:false,
            product:{
                name:{type:String,required:true},
                paymentPrice:{type:String ,required:true},
                price:{type:Number ,required:true },
                productId:{type:Types.ObjectId,ref:'Product',required:true }
            },
            quantity:{type:Number ,required:true ,default:1 }
        }],
        invoice:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)

const orderModel = mongoose.models.Order|| model( "Order", orderSchema )
export default orderModel