import { roles } from "../../middleWare/authontication.js";


export const endPoint ={
    orderCrud:[roles.user]
}