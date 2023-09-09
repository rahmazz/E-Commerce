import { Router } from "express";
const router = Router()
import * as categoryController from "./controller/category.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./category.endPoint.js";

router.use("/:categoryId/subcategory",subcategoryRouter)


router.post(`/addcategory`,
auth(endPoint.categoryCrud),
fileUpload(fileValidation.image).single('image'),
validation( validatores.addCategory),
categoryController.addCategory)

router.put(`/updatecategory/:categoryId`,
auth(endPoint.categoryCrud),
fileUpload(fileValidation.image).single('image'),
validation( validatores.updateCategory),
asyncHandeller(categoryController.updateCategory))

router.delete(`/deletecategory/:id`,
auth(endPoint.categoryCrud),
validation( validatores.deleteCategory),
asyncHandeller(categoryController.deleteCategory))

// router.get(`/`,
// fileUpload(fileValidation.image).single('image'),
// validation( validatores.searchByName),
// asyncHandeller(categoryController.searchByName))

router.get(`/getcategorybyid/:categoryId`,
validation( validatores.getCategoryById),
asyncHandeller(categoryController.getCategoryById))


router.get(`/`,
asyncHandeller(categoryController.getAllCategories))


// router.get(`/`,
//     asyncHandeller(categoryController.globalGetAllCategory)
// )


export default router


















router.use(`/:categoryId/subcategory` , subcategoryRouter)
//from parent to child ---> from category to subcategory 
// we use router.user ? to tell the router to search in all endpoints inside subcategory



// router.route(`/`)
//     .post(
//         fileUpload(fileValidation.image).single('image'),
//         validation( validatores.addCategory),
//         asyncHandeller(categoryController.addCategory)
//     )
//     .get(
//         fileUpload(fileValidation.image).single('image'),
//         validation( validatores.searchByName),
//         asyncHandeller(categoryController.searchByName)
//     )


// router.route(`/:categoryId`)
//     .put(
//         fileUpload(fileValidation.image).single('image'),
//         validation( validatores.updateCategory),
//         asyncHandeller(categoryController.updateCategory)
//     )
//     .delete(
//         fileUpload(fileValidation.image).single('image'),
//         validation( validatores.deleteCategory),
//         asyncHandeller(categoryController.deleteCategory)
//     )
//     .get(
//         fileUpload(fileValidation.image).single('image'),
//         validation( validatores.getCategoryById),
//         asyncHandeller(categoryController.getCategoryById))
