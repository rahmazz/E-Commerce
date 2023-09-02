import jwt from "jsonwebtoken"
import { asyncHandeller } from "../utils/errorHandeling.js";
import userModel from "../../DB/models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../utils/errorClass.js";
import tokenModel from "../../DB/models/token.model.js";


export const roles = {
    admin : 'Admin',
    user : 'User',
    hr:'HR'
}
// console.log(Object.values(roles));
// Object.values ---> method in js to convert object to array so if i want to accept any type of role i will pass it to the auth function instead of doing auth([roles.admin,roles.user,roles.hr])
Object.freeze(roles)
export const auth = (roles = []) =>{
        return asyncHandeller(
        async(req,res,next) =>{
        const {authorization}=req.headers
        console.log({authorization});
    
        if(!authorization?.startsWith(process.env.TOKEN_BEARER)){
            return next(new ErrorClass("authorization is required or In-Valid Bearer key",{cause:400}))
        }
        console.log(authorization.startsWith(process.env.TOKEN_BEARER));
    
        const token = authorization.split(process.env.TOKEN_BEARER)[1]
        console.log({token});
        if (!token) {
            return next(new ErrorClass("token is required",{cause:400}))
        }
        const tokenIsValid = await tokenModel.findOne({token , isValid:true})
        if (!tokenIsValid) {
            return next(new ErrorClass("token is expired or logged out",{cause:400}))
        }
        const decoded = jwt.verify(token , process.env.TOKEN_SIGNITURE)
        console.log({decoded});
    
        if(!decoded?.id){
            return next(new ErrorClass("In-Valid token payload",{cause:400}))
        }
        
        const user = await userModel.findById(decoded.id).select('-password')
        console.log({user});
        if(!user){
            return next(new ErrorClass("Not register account",{cause:401}))
        }
        if (!user.confirmemail) {
            return next(new ErrorClass("confirm your email first",{cause:401}))
        }
        if (!roles.includes(user.role)) {
            return next(new ErrorClass("Not authorized user to access here",StatusCodes.FORBIDDEN))
        }
        req.user=user
        return next()
        })
} 