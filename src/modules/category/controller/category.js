import slugify from "slugify";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import subCategoryModel from "../../../../DB/models/subcategory.model.js";
import productModel from "../../../../DB/models/product.model.js";
import brandModel from "../../../../DB/models/brand.model.js";

export const addCategory = async (req, res, next) => {
    const { name , brandId} = req.body;
    const isExist = await categoryModel.findOne({ name });
    if (isExist) {
        return next(new ErrorClass("this name is already exist" , StatusCodes.CONFLICT));
    }
    const isBrandExist = await brandModel.findById(brandId)
    if (!isBrandExist) {
        return next(new ErrorClass("this brand not exist" , StatusCodes.NOT_FOUND));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/category` }
    );
    const category = await categoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
        createdBy:req.user._id,
        brandId
    });
    res.status(StatusCodes.CREATED).json({ message: "Done", category, status: ReasonPhrases.CREATED });
    };

export const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const isExist = await categoryModel.findById(categoryId);
    if (!isExist) {
        return next(new ErrorClass("categoryId is Not Exist" ,StatusCodes.NOT_FOUND));
    }
    const isBrandExist = await brandModel.findById(isExist.brandId)
    if (!isBrandExist) {
        return next(new ErrorClass("this brand not exist" , StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
        const nameExist = await categoryModel.findOne({
            name: req.body.name,
            _id: { $ne: categoryId },
        });
        if (nameExist) {
            return next(new ErrorClass(`category ${req.body.name} is already exist` , StatusCodes.CONFLICT));
        }
        req.body.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            public_id:isExist.image.public_id,
            secure_url:isExist.image.secure_url,
        }
        );
        req.body.image = {
        secure_url,
        public_id,
        };
    }
    const updateCategory = await categoryModel.updateOne(
        { _id: categoryId },
        req.body
    );

    return res.status(StatusCodes.OK).json({ message: "Done", updateCategory });
    };

export const deleteCategory = async (req, res, next) => {
    const { id  } = req.params;
    const isExist = await categoryModel.findByIdAndDelete(id);
    if (!isExist) {
        return next(new ErrorClass("category is not exist" , StatusCodes.NOT_FOUND));
    }
    const result = await cloudinary.uploader.destroy(isExist.image.public_id);
    if (result.result != 'ok') {
        return next(new ErrorClass("Error with deleting the image" , StatusCodes.NOT_FOUND));
    }
    const subcategory = await subCategoryModel.find({categoryId:id})
    for (let i = 0; i < subcategory.length; i++) {
        await cloudinary.uploader.destroy(subcategory[i].image.public_id);
    }
    const product = await productModel.find({categoryId:id})
    for (let i = 0; i < product.length; i++) {
        await cloudinary.uploader.destroy(product[i].image.public_id);
    }
    await subCategoryModel.deleteMany({categoryId:id})
    await productModel.deleteMany({categoryId:id})
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };


// no need to it because we use apiFeature class

// export const searchByName = async (req, res, next) => {
//     const { searchKey } = req.query;
//     const category = await categoryModel.find({
//         name: { $regex: `${searchKey}` },
//     });
    //   $regex: `^t` --> search any category start with "t"
    //   $regex: `t$` --> search any category end with "t"
    //   $regex: `t` --> search any category contain this letter (t)
    //   $regex: `^tec&` --> search any category with this name already
    // return res.status(StatusCodes.ACCEPTED).json({ message: "Done", category });
    // };

export const getCategoryById = async (req, res, next) => {
    const { categoryId } = req.params;
    const isExist = await categoryModel.findById(categoryId);
    if (!isExist) {
        return next(new ErrorClass("categoryId is Not Exist" , StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };

// search by using api feature class
export const getAllCategories = async (req, res, next) => {
        const mongooseQuery =  categoryModel.find().populate([{
            // nested populate because createdBy is a feild inside the first populate (Subcategory)
            path:'Subcategory',
            populate:[{
                path:'createdBy'
            }]
        }]);
        const api = new ApiFeatures(mongooseQuery,req.query).pagination().search().sort().filter().select()
        const category = await api.mongooseQuery
        return res.json({ message: "Done", category });
    };


// export const globalGetAllCategory =  getAll(categoryModel)---> search by getAll global function
