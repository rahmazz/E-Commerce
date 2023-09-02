// import { asyncHandeller } from "../utils/errorHandeling.js"



// export const isAuthrized = (role) =>{
//     return asyncHandeller (
//         async(req,res,next) =>{
//         if (role != req.user.role) {
//             return next(new ErrorClass("Not authorized user to access here",StatusCodes.FORBIDDEN))
//         }
//         return next()
//     })}