import { Router } from "express";
const router = Router()

import * as cartController from "./controller/cart.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./cart.endPoint.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";

router.post(`/` ,
auth(endPoint.cartCrud),
validation(validatores.addToCart),
asyncHandeller(cartController.addToCart))


export default router