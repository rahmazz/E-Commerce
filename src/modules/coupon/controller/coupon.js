import slugify from "slugify";
import couponModel from "../../../../DB/models/coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAll } from "../../../utils/handlers/globalGetAll.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import productModel from "../../../../DB/models/product.model.js";

export const addCoupon = async (req, res, next) => {
    const { name } = req.body;
    const userId =rqe.user._id
    // console.log({ slug ,name , file: req.file });
    const isExist = await couponModel.findOne({ name });
    if (isExist) {
        return next(new ErrorClass("this name is already exist" , StatusCodes.CONFLICT));
    }
    const slug = slugify(name);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `Ecommerce/coupon` }
    );
    const coupon = await couponModel.create({
        name,
        slug,
        image: { secure_url, public_id },
        createdBy:userId
    });
    res.status(StatusCodes.CREATED).json({ message: "Done", coupon, status: ReasonPhrases.CREATED });
    };

export const updatecoupon = async (req, res, next) => {
    const { couponId } = req.params;
    const isExist = await couponModel.findById(couponId);
    if (!isExist) {
        return next(new ErrorClass("couponId is Not Exist" ,StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
        const nameExist = await couponModel.findOne({
            name: req.body.name,
            _id: { $ne: couponId },
        });
        if (nameExist) {
            return next(new ErrorClass(`coupon ${req.body.name} is already exist` , StatusCodes.CONFLICT));
        }
        req.body.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: "coupon" }
        );
        await cloudinary.uploader.destroy(isExist.image.public_id);
        req.body.image = {
        secure_url,
        public_id,
        };
    }
    const updatecoupon = await couponModel.updateOne(
        { _id: couponId },
        req.body
    );

    return res.status(StatusCodes.OK).json({ message: "Done", updatecoupon });
    };

export const deletecoupon = async (req, res, next) => {
    const { id  } = req.params;
    const isExist = await couponModel.findByIdAndDelete(id);
    if (!isExist) {
        return next(new ErrorClass("coupon is not exist" , StatusCodes.NOT_FOUND));
    }
    await cloudinary.uploader.destroy(isExist.image.public_id);
    const subcoupon = await subcouponModel.find({couponId:id})
    for (let i = 0; i < subcoupon.length; i++) {
        await cloudinary.uploader.destroy(subcoupon[i].image.public_id);
    }
    const product = await productModel.find({couponId:id})
    for (let i = 0; i < product.length; i++) {
        await cloudinary.uploader.destroy(product[i].image.public_id);
    }
    await subcouponModel.deleteMany({couponId:id})
    await productModel.deleteMany({couponId:id})
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };


// no need to it because we use apiFeature class

// export const searchByName = async (req, res, next) => {
//     const { searchKey } = req.query;
//     const coupon = await couponModel.find({
//         name: { $regex: `${searchKey}` },
//     });
    //   $regex: `^t` --> search any coupon start with "t"
    //   $regex: `t$` --> search any coupon end with "t"
    //   $regex: `t` --> search any coupon contain this letter (t)
    //   $regex: `^tec&` --> search any coupon with this name already
    // return res.status(StatusCodes.ACCEPTED).json({ message: "Done", coupon });
    // };

export const getcouponById = async (req, res, next) => {
    const { couponId } = req.params;
    const isExist = await couponModel.findById(couponId);
    if (!isExist) {
        return next(new ErrorClass("couponId is Not Exist" , StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ message: "Done", isExist });
    };

// search by using api feature class
export const getAllCategories = async (req, res, next) => {
        const mongooseQuery =  couponModel.find().populate([{
            path:'Subcoupon'
        }]);
        const api = new ApiFeatures(mongooseQuery,req.query).pagination().search().sort().filter().select()
        const coupon = await api.mongooseQuery
        return res.json({ message: "Done", coupon });
    };


// export const globalGetAllcoupon =  getAll(couponModel)---> search by getAll global function
