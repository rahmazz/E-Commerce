import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
    {
        userId:{
            type:Types.ObjectId,
            ref:'User',
            required:true ,
            unique:true,
        },
        products:[{
            _id:false,
            productId:{type:Types.ObjectId ,ref:'Product', required:true },
            quantity:{type:Number ,required:true ,default:1 }
        }]
    },
    {
        timestamps:true
    }
)

const cartModel = mongoose.models.Cart|| model( "Cart", cartSchema )
export default cartModel