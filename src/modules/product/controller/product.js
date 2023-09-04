import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/models/product.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import subCategoryModel from "../../../../DB/models/subcategory.model.js";
import brandModel from "../../../../DB/models/brand.model.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { deleteOne } from "../../../utils/handlers/globalDelete.js";
import QRCode from "qrcode";
import { paigination } from "../../../utils/pagination.js";
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

export const addProduct = async (req, res, next) => {
    const CategoryExist = await categoryModel.findById(req.body.categoryId);
    if (!CategoryExist) {
        return next(new ErrorClass("category not found", StatusCodes.NOT_FOUND));
    }
    const subcategoryExist = await subCategoryModel.findById(
        req.body.subcategoryId
    );
    if (!subcategoryExist) {
        return next(new ErrorClass("subcategory not found", StatusCodes.NOT_FOUND));
    }
    const brandExist = await brandModel.findById(req.body.brandId);
    if (!brandExist) {
        return next(new ErrorClass("brand not found", StatusCodes.NOT_FOUND));
    }
    const nameExist = await productModel.findOne({ name: req.body.name });
    if (nameExist) {
        nameExist.stock += Number(req.body.quantity);
        // nameExist.stock += +req.body.quantity
        await nameExist.save();
        return res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Done", product: nameExist });
    }
    req.body.slug = slugify(req.body.name);
    if (req.body.sizes) {
        req.body.sizes = JSON.parse(req.body.sizes);
    }
    if (req.body.colors) {
        req.body.colors = JSON.parse(req.body.colors);
    }
    if (req.body.quantity) {
        req.body.stock = req.body.quantity;
    }
    req.body.paymentPrice =req.body.price - req.body.price * ((req.body.discount || 0) / 100);
    
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/product/image` }
    );
    req.body.image = { secure_url, public_id };

    if (req.files.coverImages?.length) {
        const coverImages = [];
        for (let i = 0; i < req.files.coverImages.length; i++) {
        const  { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.coverImages[i].path,
            { folder:`${process.env.FOLDER_CLOUD_NAME}/product/coverImage` });
            coverImages.push({ secure_url, public_id });
        }
        req.body.coverImages = coverImages;
    }
    req.body.QrCode = await QRCode.toDataURL(
        JSON.stringify({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.image.secure_url,
        price: req.body.price,
        discount: req.body.discount,
        paymentPrice: req.body.paymentPrice,
        })
    );
    console.log(req.body.QrCode);
    req.body.createdBy = req.user._id


    const product = await productModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: "Done", product });
};

export const deleteProduct = deleteOne(productModel);

export const getAllProductByClass = async(req,res,next)=>{
    const apiFeatures = new ApiFeatures(productModel.find(),req.query).pagination(productModel).search().sort().select()
    const products = await apiFeatures.mongooseQuery
    res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        products,
        totalPages:apiFeatures.queryData.totalPages,
        currentPage:apiFeatures.queryData.page,
        nextPage:apiFeatures.queryData.nextPage,
        previousPage:apiFeatures.queryData.previousPage,
    });
}


export const getAllProduct =  getAll(productModel)


