import mongoose, { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
    {
        token:{
            type:String,
            required:true,
        },
        isValid:{
            type:Boolean,
            default:true
        },
        expiredAt:{
            type:String,
        },
        agent:{
            type:String
        },
        userId:{
            type:Types.ObjectId,
            ref:'User',
        }
    },
    {
        timestamps:true
    }
)

const tokenModel =mongoose.models.token|| model( "Token", tokenSchema )
export default tokenModel