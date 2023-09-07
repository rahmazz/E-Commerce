import * as favouritesController from "./controller/favourite.js"
import { Router } from "express"
const router = Router()
import {auth} from "../../middleWare/authontication.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { endPoint } from "./favourite.endPoint.js";
import { asyncHandeller } from "../../utils/errorHandeling.js";




router.put(`/`,
auth(endPoint.favouritesCrud),
validation(validatores.addToFavourites),
asyncHandeller(favouritesController.addToFavourites)
)

router.get(`/`,
auth(endPoint.favouritesCrud),
asyncHandeller(favouritesController.getUserFavourites)
)



export default router





