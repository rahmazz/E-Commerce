import DBconnection from "../DB/connection.js"
import authRouter from "./modules/auth/auth.router.js"
import productRouter from "./modules/product/product.router.js"
import categoryRouter from "./modules/category/category.router.js"
import subcategoryRouter from "./modules/subcategory/subcategory.router.js"
import orderRouter from "./modules/order/order.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import favouritesRouter from "./modules/favourite/favourite.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import reviewRouter from "./modules/reviews/review.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import cors from 'cors'
import { globalErrorHandelling } from "./utils/errorHandeling.js"
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
import { ErrorClass } from "./utils/errorClass.js"


const bootstrap = (app,express) =>{

    var whitelist = ['http://example1.com', 'http://example2.com']
    // var corsOptions = {
    // origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //     callback(null, true)
    //     } else {
    //     callback(new Error('Not allowed by CORS'))
    //     }
    // }
        app.use(cors())
    // }
    // app.use(async (req,res,next) => {
    //     if (!whitelist.includes(req.header('origin'))) {
    //         next(new ErrorClass('Not Allowed By CORS',StatusCodes.FORBIDDEN))
    //     }
    //     for (const origin of whitelist) {
    //         if (req.header('origin') == origin) {
    //             await req.header('Acess-Control-Allow-Origin',origin)
    //             break;
    //         }
    //     }
    //     await req.header('Acess-Control-Allow-Headers','*')
    //     await req.header('Acess-Control-Allow-Methods','*')
    //     await req.header('Acess-Control-Allow-Private-Network','true')
    //     console.log('Origin Work');

    // })
    app.use((req,res,next)=>{
        console.log(req.originalUrl);
        if (req.originalUrl == '/order/webhook') {
            next()
        }else{
            express.json({})(req,res,next)
        }
    })
    app.use(`/auth`,authRouter)
    app.use(`/product`,productRouter)
    app.use(`/category`,categoryRouter)
    app.use(`/subcategory`,subcategoryRouter)
    app.use(`/cart`,cartRouter)
    app.use(`/coupon`,couponRouter)
    app.use(`/order`,orderRouter)
    app.use(`/brand`,brandRouter)
    app.use(`/favourites`,favouritesRouter)
    app.use(`/review`,reviewRouter)
    app.all(`*`,(req,res,next)=>{
        res.json({message:"In-Valid routing"})
    })
    app.use(globalErrorHandelling)
    DBconnection()
}

export default bootstrap