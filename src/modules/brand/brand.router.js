import { Router } from "express";
const router = Router()

import * as brandController from "./controller/brand.js"
import { validation } from "../../middleWare/validation.js";
import * as validators from "./validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";
import { idVal } from "../../utils/globalValidation.js";
import { auth, roles } from "../../middleWare/authontication.js";
import { endPoint } from "./brand.endPoint.js";

router.post(`/addbrand` ,
auth(endPoint.BrandCrud),
fileUpload(fileValidation.image).single('logo'),
validation(validators.addBrand)
,asyncHandeller(brandController.addBrand))

router.get(`/`,
validation(validators.getAllBrands),
asyncHandeller(brandController.getAllBrands)
)

router.route(`/:id`)
    .put(
        auth(endPoint.BrandCrud),
        fileUpload(fileValidation.image).single('logo'),
        validation(validators.updateBrand),
        asyncHandeller(brandController.updateBrand)
    )
    .delete(
        auth(endPoint.BrandCrud),
        validation(idVal),
        asyncHandeller(brandController.deleteBrand)
    )
    .get(
        validation(idVal),
        asyncHandeller(brandController.getBrandById))


// router.get(`/`,
//     asyncHandeller(brandController.globalGetAllBrands)
// ) 



export default router