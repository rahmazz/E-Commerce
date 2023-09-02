import DBconnection from "../DB/connection.js"
import userRouter from "./modules/user/user.router.js"
import authRouter from "./modules/auth/auth.router.js"
import productRouter from "./modules/product/product.router.js"
import categoryRouter from "./modules/category/category.router.js"
import subcategoryRouter from "./modules/subcategory/subcategory.router.js"
// import orderRouter from "./modules/order/order.router.js"
import cartRouter from "./modules/cart/cart.router.js"
// import couponRouter from "./modules/coupon/coupon.router.js"
// import reviewsRouter from "./modules/reviews/review.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import { globalErrorHandelling } from "./utils/errorHandeling.js"
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';


const bootstrap = (app,express) =>{
    app.use(express.json())
    app.use(`/user`,userRouter)
    app.use(`/auth`,authRouter)
    app.use(`/product`,productRouter)
    app.use(`/category`,categoryRouter)
    app.use(`/subcategory`,subcategoryRouter)
    app.use(`/cart`,cartRouter)
    // app.use(`/coupon`,couponRouter)
    // app.use(`/order`,orderRouter)
    app.use(`/brand`,brandRouter)
    // app.use(`/reviews`,reviewsRouter)
    app.all(`*`,(req,res,next)=>{
        res.json({message:"In-Valid routing"})
    })
    app.use(globalErrorHandelling)


    DBconnection()
}

export default bootstrap