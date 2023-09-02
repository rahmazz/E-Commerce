import { Router } from "express";
const router = Router()

import * as orderController from "./controller/order.js"
import { validation } from "../../middleWare/validation.js";

router.post(`/` ,orderController.order)


export default router