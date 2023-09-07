import cartModel from "../../../../DB/models/cart.model.js";
import productModel from "../../../../DB/models/product.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;

    const productExist = await productModel.findById(productId);
    if (!productExist) {
        return next(new ErrorClass("product not exist", StatusCodes.NOT_FOUND));
    }
    if (productExist.stock < quantity || productExist.isDeleted) {
        await productModel.updateOne(
        { _id: productId },
        {
            $addToSet: { wishingList: req.user._id },
        }
        );
        return next(
        new ErrorClass(
            `quantity out of stock Max available is ${productExist.stock}`
        )
        );
    }

    const cart = await cartModel.findOne({ userId: req.user._id });

    // const productIndex = cart.products.findIndex((ele) => {
    //     return ele.productId == productId;
    // });
    // //-1 mean productId not found
    // if (productIndex == -1) {
    //     cart.products.push({ productId, quantity });
    // } else {
    //     const tatalQuantity = cart.products[productIndex].quantity + quantity;
    //     if (tatalQuantity > productExist.stock) {
    //     return next(
    //         new ErrorClass(
    //         `quantity out of stock Max available is ${productExist.stock}`
    //         )
    //     );
    //     }
    // }
    // cart.products[productIndex].quantity += quantity;

    let productExistBefore = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString()==productId) {
            productExistBefore=true
            if ((cart.products[i].quantity + quantity) > productExist.stock) {
                return next(new ErrorClass(`quantity out of stock Max available is ${productExist.stock}`))
            }
            cart.products[i].quantity += quantity
            break;
        }
    }
    if (!productExistBefore) {
        cart.products.push({productId , quantity})
    }
    await cart.save();

    res.status(StatusCodes.CREATED).json({ message: "done", cart });
    };



export const userCart = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id }).populate(
        "products.productId",
        "name image.secure_url paymentPrice  stock "
        //or but them in object but you will need write path select
        //{
        // path:'products.productId',
        // select:"name image.secure_url"
        // }
    );
    let totalPrice = 0;
    cart.products = cart.products.filter((ele) => {
        if (ele.productId && ele.productId.stock) {
            if (ele.productId.stock < ele.quantity) {
                ele.quantity = ele.productId.stock
            }
        totalPrice += ele.quantity * ele.productId.paymentPrice;
        return ele;
        }
    });
    await cart.save();
    res.status(StatusCodes.ACCEPTED).json({ message: "done", cart ,totalPrice });
    };




export const updateCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const productExist = await productModel.findById(productId);
    if (!productExist) {
        return next(new ErrorClass("product not exist", StatusCodes.NOT_FOUND));
    }
    if (productExist.stock < quantity || productExist.isDeleted) {
        await productModel.updateOne(
        { _id: productId },
        {
            $addToSet: { wishingList: req.user._id },
        }
        );
        return next(
        new ErrorClass(
            `quantity out of stock Max available is ${productExist.stock}`
        )
        );
    }
    const cart = await cartModel.findOneAndUpdate(
        { userId: req.user._id, "products.productId": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
    );

    res.status(StatusCodes.ACCEPTED).json({ message: "done", cart });
    };




export const removeProductFromCart = async (req, res, next) => {
    const productExist = await productModel.findById(req.params.id);
    if (!productExist) {
        return next(
        new ErrorClass(
            "this cart doesnnot include this product ",
            StatusCodes.NOT_FOUND
        )
        );
    }
    const cart = await cartModel.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { products: { productId: req.params.id } } },
        { new: true }
    );
    res.status(StatusCodes.ACCEPTED).json({ message: "done", cart });
    };



    
    export const clearCart = async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        { userId: req.user._id },
        { products: [] },
        { new: true }
    );
    res.status(StatusCodes.ACCEPTED).json({ message: "done", cart });
    };
