import { Router } from "express";
import express from 'express'
const router = Router()

import * as orderController from "./controller/order.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./order.endPoint.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";


router.post(`/` ,
auth(endPoint.orderCrud),
validation(validatores.createOrder),
orderController.createOrder)


router.post('/webhook', express.raw({type: 'application/json'}),orderController.webhook)

export default router