import { asyncHandeller } from "../../../utils/errorHandeling.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { decrypt } from "dotenv";
import jwt from "jsonwebtoken"
import sendEmail from "../../../utils/email.js";
import * as validatores from "../validation.js"
import { ErrorClass } from "../../../utils/errorClass.js";
import { compare, hash } from "../../../utils/hashAndCompare.js";
import cloudinary from "../../../utils/cloudinary.js";
import htmlContent from "../../../utils/html.js";
import userModel from "../../../../DB/models/user.model.js";
import CryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';
import { generateToken } from "../../../utils/generateAndVerifiyToken.js";
import cartModel from "../../../../DB/models/cart.model.js";
import tokenModel from "../../../../DB/models/token.model.js";


export const signUp = async(req,res,next) =>{
    
        const checkEmail = await userModel.findOne({email:req.body.email})
        if(checkEmail){
            return next(new ErrorClass(`This Email ${req.body.email} already exist`,StatusCodes.CONFLICT))
        }
        const code = nanoid(6)
        // const code = crypto.randomBytes(6).toString('hex')
        const html = htmlContent(code)
        const isEmailSent = await sendEmail({to:req.body.email ,subject:"Confirmation Email",html})
        if (!isEmailSent) {
            return next(new ErrorClass(`email rejected`,StatusCodes.BAD_REQUEST))
        }
        req.body.phone = CryptoJS.AES.encrypt(req.body.phone,process.env.PHONE_ENCRPTION_KEY).toString()
        req.body.password = hash(req.body.password)
        if (req.body.file) {
            const {public_id , secure_url} = await cloudinary.uploader.upload( req.file.path,{ folder:`${process.env.FOLDER_CLOUD_NAME}/user` })
            req.body.image =  {public_id , secure_url}
        }
        req.body.code = code
        const user = await userModel.create(req.body)
        res.status(StatusCodes.CREATED).json({message:"user added sucessfully",user});
    }



export const confirmEmail = async(req ,res ,next)=>{
    const {code} =req.body
    const user = await userModel.findOneAndUpdate({code},{confirmemail:true , $unset:{ code : 1} },{new:true})
        if(!user){
            return next(new ErrorClass(` user not found`,StatusCodes.NOT_FOUND))
        }if (user.role == 'User') {
            await cartModel.create({userId:user._id})
        }
        return res.status(StatusCodes.OK).json({message:"Email confirmed", user})
}



export const signIn = async(req,res,next) =>{
        const {email,password}=req.body
        const user = await userModel.findOne({email})
        if(!user){
            return next(new ErrorClass("invalid login data",StatusCodes.NOT_ACCEPTABLE))
        }
        if (!user.confirmemail) {
            return next(new ErrorClass("confirm your email before login",StatusCodes.NOT_ACCEPTABLE))
        }
        const matchpass= compare(password,user.password)
        if(!matchpass){
            return next(new ErrorClass("invalid login data",StatusCodes.NOT_ACCEPTABLE))
        }
        const payload ={
            id:user._id,
            email:user.email
        }
        const token = generateToken({payload})
        await tokenModel.create({
            token,
            userId:user._id,
            agent:req.headers['user-agent']
        })
        user.status = "online"
        await user.save()
        res.status(StatusCodes.ACCEPTED).json({message:"done",token})
    }



export const sendChangePasswordCode = async(req,res,next) =>{
    const {email} = req.body
    const user = await userModel.findOne({email})
        if(!user){
            return next(new ErrorClass("User NOT Found",StatusCodes.NOT_FOUND))
        }
        const code = nanoid(6)
        const html = htmlContent(code)
        sendEmail({to:req.body.email ,subject:"Forget Password",html})
        await userModel.updateOne({email},{code})
        res.status(StatusCodes.ACCEPTED).json({message:"done check your email",code})
}



export const resetPassword = async(req, res ,next) =>{
    let { email, code ,password} =req.body
    const user = await userModel.findOne({email})
        if(!user){
            return next(new ErrorClass("invalid login data",StatusCodes.NOT_FOUND))
        }
        if (user.code != code) {
            return next(new ErrorClass(`In-Valid code`,StatusCodes.BAD_REQUEST))
        }
        password = hash(password)
        await userModel.updateOne({email},{password , $unset:{code:1} })
        const tokens = await tokenModel.find({userId:user._id})
        tokens.forEach( async (token) => {
            token.isValid = false
            await token.save()
        });
        res.status(StatusCodes.ACCEPTED).json({message:"done , try to login now"})

}


















