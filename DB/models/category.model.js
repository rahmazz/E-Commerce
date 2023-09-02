import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
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
        brandId:{
            type:Types.ObjectId,
            ref:'Brand',
            required:true
        }
        //populate subcategories here rather than in subcategyModel
        //subcategories:[{
            // type:Types.ObjectId,
            // ref:'Subcategy',
            // required:true}]
    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
        timestamps:true
    }
)
categorySchema.virtual('Subcategory',{
    localField:'_id',
    foreignField: 'categoryId',
    ref:'Subcategory'
})
const categoryModel = mongoose.models.Category|| model( "Category", categorySchema )
export default categoryModel