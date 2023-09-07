import mongoose from "mongoose";
import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
    {
        code:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        expireDate:{
            type:Date,
            required:true,
            min:Date.now()
        },
        image:{
            type:Object
        },
        amount:{
            type:Number,
            default:1,
            max:100,
            required:true
        },
        usedBy:[{
            type:Types.ObjectId,
            ref:'User',
        }],
        numOfUse:{
            type:Number
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'User',
            required:true
        }
    }
)
const couponModel = mongoose.models.Coupon || model( "Coupon", couponSchema )
export default couponModel