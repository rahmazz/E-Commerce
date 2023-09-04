import { Router } from "express";
const router = Router()

import * as productController from "./controller/product.js"
import { validation } from "../../middleWare/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";
import * as validatores from "./validation.js"
import { idVal } from "../../utils/globalValidation.js";
import { auth, roles } from "../../middleWare/authontication.js";
import { endPoint } from "./product.endPoint.js";

router.route(`/`)
    .post(
        auth(endPoint.productCrud),
        fileUpload(fileValidation.image).fields([
            { name : 'image', maxCount: 1 },
            { name : 'coverImages' , maxCount: 5 }
        ]),
        validation(validatores.addProduct),
        asyncHandeller(productController.addProduct)
    )
    // .get(
    //     asyncHandeller(productController.getAllProduct)
    // )
    .get(
        asyncHandeller(productController.getAllProductByClass)
    )

router.delete('/:id',
    auth(endPoint.productCrud),
    validation(idVal),
    asyncHandeller(productController.deleteProduct)
)




export default router