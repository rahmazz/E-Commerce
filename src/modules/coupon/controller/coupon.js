import slugify from "slugify";
import couponModel from "../../../../DB/models/coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import productModel from "../../../../DB/models/product.model.js";
import subCategoryModel from "../../../../DB/models/subcategory.model.js";

export const addCoupon = async (req, res, next) => {
    const { code ,expireDate ,amount ,numOfUse } = req.body;
    const isExist = await couponModel.findOne({ code });
    if (isExist) {
        return next(new ErrorClass(`this coupon name ${code} is already exist` , StatusCodes.CONFLICT));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/coupon`}
    );
    req.body.image = { secure_url, public_id }
}
    const coupon = await couponModel.create({
        code,
        numOfUse,
        amount,
        expireDate,
        image:req.body.image,
        createdBy:req.user._id
    });
    res.status(StatusCodes.CREATED).json({ message: "Done", coupon, status: ReasonPhrases.CREATED });
    };




export const updateCoupon = async (req, res, next) => {
    const { id } = req.params;
    const isExist = await couponModel.findById(id);
    if (!isExist) {
        return next(new ErrorClass("couponId is Not Exist" ,StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
        const nameExist = await couponModel.findOne({
            name: req.body.name,
            _id: { $ne: id },
        });
        if (nameExist) {
            return next(new ErrorClass(`coupon ${req.body.name} is already exist` , StatusCodes.CONFLICT));
        }
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            public_id: isExist.image.public_id,
            secure_url: isExist.image.secure_url,
        }
        );
        req.body.image = {
        secure_url,
        public_id,
        };
    }
    const updatecoupon = await couponModel.updateOne(
        { _id: id },
        req.body
    );
    return res.status(StatusCodes.OK).json({ message: "Done", updatecoupon });
    };





export const deleteCoupon = async (req, res, next) => {
    const { id  } = req.params;
    const isExist = await couponModel.findByIdAndDelete(id);
    if (!isExist) {
        return next(new ErrorClass("coupon is not exist" , StatusCodes.NOT_FOUND));
    }
    await cloudinary.uploader.destroy(isExist.image.public_id);
    const subcoupon = await subCategoryModel.find({couponId:id})
    for (let i = 0; i < subcoupon.length; i++) {
        await cloudinary.uploader.destroy(subcoupon[i].image.public_id);
    }
    const product = await productModel.find({couponId:id})
    for (let i = 0; i < product.length; i++) {
        await cloudinary.uploader.destroy(product[i].image.public_id);
    }
    await subCategoryModel.deleteMany({couponId:id})
    await productModel.deleteMany({couponId:id})
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };



export const getCouponById = async (req, res, next) => {
    const { id } = req.params;
    const isExist = await couponModel.findById(id);
    if (!isExist) {
        return next(new ErrorClass("couponId is Not Exist" , StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };

