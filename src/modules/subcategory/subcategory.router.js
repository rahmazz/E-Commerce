import { Router } from "express";
const router = Router({ mergeParams:true });

import * as subCategoryController from "./controller/subcategory.js";
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";
import { idVal } from "../../utils/globalValidation.js";
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./subcategory.endPoint.js";


// router in category router  --> router.use("/:categoryId/subcategory",subcategoryRouter)
router.post(`/`,
auth(endPoint.subcategoryCrud),
  fileUpload(fileValidation.image).single("image"),
  validation(validatores.addsubCategory),
  asyncHandeller(subCategoryController.addsubCategory)
);

router.put(`/updateSubCategory/:SubCategoryId`,
auth(endPoint.subcategoryCrud),
  fileUpload([...fileValidation.image,...fileValidation.file]).single("image"),
  validation(validatores.updateSubCategory),
  asyncHandeller(subCategoryController.updateSubCategory)
);

//we use *id* because we use idVal
router.delete(`/deletesubcategory/:id`,
auth(endPoint.subcategoryCrud),  
  validation(idVal),
  asyncHandeller(subCategoryController.deleteSubCategory)
);

//get by function
// router.get(`/`,
//     asyncHandeller(subCategoryController.globalgetAllSubCategory)
// )


//get by class
router.get(`/`, asyncHandeller(subCategoryController.getAllSubCategories));

router.get(`/`,
  validation(validatores.searchByName),
  asyncHandeller(subCategoryController.searchByName)
);

router.get(`/getSubCategoryById/:categoryId`,
  validation(validatores.getSubCategoryById),
  asyncHandeller(subCategoryController.getSubCategoryById)
);

export default router;
