import { Router } from "express";
const router = Router();

import * as cartController from "./controller/cart.js";
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js";
import { auth } from "../../middleWare/authontication.js";
import { endPoint } from "./cart.endPoint.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";

router.post(
  `/`,
  auth(endPoint.cartCrud),
  validation(validatores.addToCart),
  asyncHandeller(cartController.addToCart)
);

router.patch(
  `/`,
  auth(endPoint.cartCrud),
  validation(validatores.updateCart),
  asyncHandeller(cartController.updateCart)
);

router.patch(
  `/clearCart`,
  auth(endPoint.cartCrud),
  asyncHandeller(cartController.clearCart)
);

router.patch(
  `/:id`,
  auth(endPoint.cartCrud),
  validation(validatores.removeProductFromCart),
  asyncHandeller(cartController.removeProductFromCart)
);

router.get(
  `/`,
  auth(endPoint.cartCrud),
  asyncHandeller(cartController.userCart)
);

export default router;
