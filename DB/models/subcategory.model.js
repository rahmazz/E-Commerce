import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        categoryId:{
            type:Types.ObjectId,
            ref:'Category',
            required:true
        },
        slug:{
            type:String,
            required:true
        },
        image:{
            type:Object
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'User',
            required:true
        },
        
    },
    {
        timestamps:true
    }
)

const subCategoryModel = mongoose.models.Subcategory|| model( "Subcategory", subCategorySchema )
export default subCategoryModel