import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        slug:{
            type:String,
            required:true,
            unique:true,
        },
        description:{
            type:String,
            required:true,
        },
        stock:{
            type:Number,
            default:1,
            required:true
        },
        price:{
            type:Number,
            min: 1 ,
            required:true
        },
        discount:{
            type:Number,
            min: 1 ,
            max:100
        },
        paymentPrice:{
            type:Number,
            default: 0 ,
        },
        colors:{
            type:Array,
        },
        sizes:{
            type:Array,
        },
        image:{
            type:Object,
            required:true
        },
        coverImages:{
            type:Array,
        },
        defaultImage:{
            url:{
                type:String,
                default: "https://res.cloudinary.com/dvpxyuuhm/image/upload/v1693316729/defaultPic/OIP_n0xp0v.jpg",
            },
            public_id:{
                type:String,
                default: "defaultPic/OIP_n0xp0v",
            }
        },
        categoryId:{
            type:Types.ObjectId,
            ref:'Category',
            required:true
        },
        brandId:{
            type:Types.ObjectId,
            ref:'Brand',
            required:true
        },
        subcategoryId:{
            type:Types.ObjectId,
            ref:'Subcategory',
            required:true
        },
        avgRate:{
            type:Number,
            default: 0 ,
        },
        rateNum:{
            type:Number,
            default: 0 ,
        },
        soldItem:{
            type:Number,
            default: 0 ,
        },
        QrCode:{
            type:String,
            required:true,
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'User',
            required:true
        },
        wishingList:{
            type:Types.ObjectId,
            ref:'User'
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)
productSchema.virtual('review',{
    ref:"Review",
    localField:'_id',
    foreignField:'productId'
})

// we can use this insteade of store patment price in the DB
//toFixed() --> للتقريب لااقرب رقمين مثلا 

// productSchema.virtual('paymentPrice').get(function(){
//     if (this.price) {
//         return Number.parseFloat(this.price - this.price * ((this.discount || 0) / 100)).toFixed(2)
//     }
// })

const productModel = mongoose.models.Product|| model( "Product", productSchema )
export default productModel