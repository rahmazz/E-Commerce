import slugify from "slugify"
import brandModel from "../../../../DB/models/brand.model.js"
import cloudinary from "../../../utils/cloudinary.js";
import {
	ReasonPhrases,
	StatusCodes,
} from 'http-status-codes';
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { deleteOne } from "../../../utils/handlers/globalDelete.js";
import productModel from "../../../../DB/models/product.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

export const addBrand = async(req,res,next) =>{
    const {name} =req.body
    const isExist = await brandModel.findOne({name})
    if (isExist) {
        return next (new ErrorClass(`Brand ${name} is already exist`))
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload( req.file.path , {folder:`${process.env.FOLDER_CLOUD_NAME}/brand`})
    const brand  = await brandModel.create({ 
        name , 
        slug:slugify(name),
        logo:{ secure_url , public_id },
        addedBy:req.user._id
    })
    res.status(StatusCodes.CREATED).json({ message: "Done", brand, status: ReasonPhrases.CREATED });
}


export const updateBrand = async (req, res, next) => {
    const { id } = req.params;
    const isExist = await brandModel.findById(id);
    if (!isExist) {
        return next(new ErrorClass("BrandId is Not Exist",StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
        const nameExist = await brandModel.findOne({
            name: req.body.name,
            _id: { $ne: id },
        });
        if (nameExist) {
            return next(new ErrorClass(`Brand ${req.body.name} is already exist`,StatusCodes.CONFLICT));
        }
        req.body.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            public_id:isExist.logo.public_id,
            secure_url:isExist.logo.secure_url,
        }
        );
        req.body.logo = {
        secure_url,
        public_id,
        };
    }
    const updateBrand= await brandModel.updateOne(
        { _id: id },
        req.body
    );
    return res.status(StatusCodes.OK).json({ message: "Done", updateBrand });
    };

export const deleteBrand = async (req, res, next) => {
        const {id} = req.params;
        const isExist = await brandModel.findByIdAndDelete(id);
        if (!isExist) {
            return next(new ErrorClass("brand is not exist" , StatusCodes.NOT_FOUND));
        }
        await cloudinary.uploader.destroy(isExist.logo.public_id);
        const product = await productModel.find({brandId:id})
        for (let i = 0; i < product.length; i++) {
            await cloudinary.uploader.destroy(product[i].image.public_id);
        }
        
        await productModel.deleteMany({brandId:id})
        return res.status(StatusCodes.OK).json({ message: "Done", isExist });
        };

// export const deleteBrand = deleteOne(brandModel)



export const getAllBrands= async (req, res, next) => {
    const mongooseQuery =  brandModel.find()
    const api = new ApiFeatures(mongooseQuery , req.query).filter().pagination(brandModel).search().sort().select()
    const brands = await api.mongooseQuery
    res.json(brands)
    };
    

export const getBrandById = async (req, res, next) => {
    const { id } = req.params;
    const isExist = await brandModel.findById(id);
    if (!isExist) {
        return next(new ErrorClass("BrandId is Not Exist",StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };


// export const globalGetAllBrands =  getAll(brandModel)
