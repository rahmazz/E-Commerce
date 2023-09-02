import { Router } from "express";
import* as authController from "./controller/auth.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";

const  router = Router()

router.post(`/signup`,
validation(validatores.signup),
fileUpload(fileValidation.image).single('image'),
asyncHandeller(authController.signUp))

router.patch(`/confirmEmail`,
validation(validatores.confirmemail),
asyncHandeller(authController.confirmEmail))

router.post(`/signin`,
validation(validatores.signIn),
asyncHandeller(authController.signIn))

router.patch(`/sendChangePasswordCode`,
validation(validatores.sendChangePasswordCode),
asyncHandeller(authController.sendChangePasswordCode))

router.patch(`/resetPassword`,
validation(validatores.resetPassword),
asyncHandeller(authController.resetPassword))



export default router