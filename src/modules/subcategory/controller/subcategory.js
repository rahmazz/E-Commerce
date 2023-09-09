import slugify from "slugify";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import subCategoryModel from "../../../../DB/models/subcategory.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { deleteOne } from "../../../utils/handlers/globalDelete.js";
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import productModel from "../../../../DB/models/product.model.js";


export const addsubCategory = async (req, res, next) => {
    const { name} = req.body;
    const {categoryId} = req.params
    const categoryExist = await categoryModel.findById(categoryId);
    if (!categoryExist) {
        return next(new ErrorClass("categoryId is Not Exist", StatusCodes.NOT_FOUND));
    }
    const nameExist = await subCategoryModel.findOne({ name });
    if (nameExist) {
        return next(new ErrorClass("name is exist", StatusCodes.CONFLICT));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/Subcategory` }
    );
    const subcategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        categoryId,
        image: { secure_url, public_id },
        createdBy:req.user._id
    });
    res.status(StatusCodes.CREATED).json({ message: "Done", subcategory, status: ReasonPhrases.CREATED });
};

export const updateSubCategory = async (req, res, next) => {
    const { SubCategoryId } = req.params;
    const isExist = await subCategoryModel.findById(SubCategoryId);
    if (!isExist) {
        return next(new ErrorClass("SubcategoryId is Not Exist",StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
        const nameExist = await subCategoryModel.findOne({
            name: req.body.name,
            _id: { $ne: SubCategoryId },
        });
        if (nameExist) {
            return next(new ErrorClass(`Subcategory ${req.body.name} is already exist`));
        }
        req.body.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { 
            public_id: isExist.image.public_id,
            secure_url:isExist.image.secure_url,
        }
        );
        req.body.image = {
        secure_url,
        public_id,
        };
    }
    const updateSubCategory = await subCategoryModel.updateOne(
        { _id: SubCategoryId },
        req.body
    );
    return res.status(StatusCodes.OK).json({ message: "Done", updateSubCategory });
    };


export const deleteSubCategory = async (req, res, next) => {
        const { id  } = req.params;
        const isExist = await subCategoryModel.findByIdAndDelete(id);
        if (!isExist) {
            return next(new ErrorClass("Subcategory is not exist" , StatusCodes.NOT_FOUND));
        }
        await cloudinary.uploader.destroy(isExist.image.public_id);
        const product = await productModel.find({subcategoryId:id})
        for (let i = 0; i < product.length; i++) {
            await cloudinary.uploader.destroy(product[i].image.public_id);
        }
        await productModel.deleteMany({subcategoryId:id})
        return res.status(StatusCodes.OK).json({ message: "Done", isExist });
        };



// export const deleteSubCategory = deleteOne(subCategoryModel)



export const searchByName = async (req, res, next) => {
    const { searchKey } = req.query;
    const SubCategory = await subCategoryModel.find({
        name: { $regex: `^${searchKey}` },
    });
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", SubCategory });
    };


export const getSubCategoryById = async (req, res, next) => {
    const { SubCategoryId } = req.params;
    const isExist = await subCategoryModel.findById(SubCategoryId);
    if (!isExist) {
        return next(new ErrorClass("categoryId is Not Exist",StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };



export const getAllSubCategories = async (req, res, next) => {
        const mongooseQuery =  subCategoryModel.find(req.params).populate([
            //is populate with to coloums in same model or table no tnested populate
            {
            path:'categoryId'
            },
            {
            path:'createdBy'
            },
        ])
        const api = new ApiFeatures(mongooseQuery , req.query).filter().pagination(subCategoryModel).search().sort().select()
        const subCategory = await api.mongooseQuery
        return res.json({ message: "Done", subCategory });
    };


export const globalgetAllSubCategory =  getAll(subCategoryModel)
