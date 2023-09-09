import Stripe from "stripe"
import cartModel from "../../../../DB/models/cart.model.js"
import couponModel from "../../../../DB/models/coupon.model.js"
import orderModel from "../../../../DB/models/order.model.js"
import productModel from "../../../../DB/models/product.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import payment from "../../../utils/payment.js"
import { createInvoice } from "../../../utils/pdf.js"
import sendEmail from "../../../utils/email.js"




export const createOrder = async (req,res,next)=>{
    let {address,phone,notes,products,couponCode,paymentMethod}=req.body


    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart?.products?.length) {
        return next(new ErrorClass("empty cart",400))
    }
    req.body.isCart = true
    req.body.products = cart.products
    }


    //if user send coupon 
    if (couponCode) {
    const isCouponExist = await couponModel.findOne({code:couponCode.toLowerCase() /*,usedBy:{$nin:req.user._id}*/} )//instead of the third if
        if (!isCouponExist) {
            return next(new ErrorClass("coupon not found",404))
        }
        if (isCouponExist.expireDate < Date.now()) {
            return next(new ErrorClass("coupon expired",400))
        }
        if (isCouponExist.usedBy.includes(req.user._id)) {
            return next(new ErrorClass("you already used this coupon before",409))
        }
        if (isCouponExist.usedBy.length >= isCouponExist.numOfUse) {
            return next(new ErrorClass("number of uses exceeded the maximum limit",400))
        }
        req.body.coupon = isCouponExist
    }

    //if user send products array
    const existedProducts = []
    const foundedIds = []
    let price = 0
    for (let product of req.body.products) {
        const checkedProducts = await productModel.findOne({ _id:product.productId ,isDeleted:false})
        if (!checkedProducts) {
            return next(new ErrorClass("product not found",404))
        }
        if (checkedProducts.stock < product.quantity) {
            return next(new ErrorClass(`quantity out of stock ... available stock is ${checkedProducts.stock}`,404))
        }
        if (req.body.isCart){
            product = product.toObject()//product is BSon object
        }
        product.name = checkedProducts.name,               
        product.price = checkedProducts.price,                
        product.paymentPrice = checkedProducts.paymentPrice,
        product.quantity = product.quantity,
        existedProducts.push(product)
        foundedIds.push(product.productId)
        price += checkedProducts.paymentPrice * product.quantity
    }

    //create order
    const order = await orderModel.create({
        userId:req.user._id,
        couponId:req.body.coupon?._id,
        address,
        products:existedProducts,
        phone,
        notes,
        paymentMethod,
        price,
        paymentPrice:  price - (price * ((req.body.coupon?.amount || 0) / 100)).toFixed(2),
        status: paymentMethod == 'card' ? "waitPayment" : "placed"
    })

    //add user to used by array in coupon
    if (req.body.coupon) {
        await couponModel.updateOne({
            code:couponCode,
            $addToSet:{usedBy:req.user._id}
        })
    }


    // decrease stock by the quantity 
    for (const product of req.body.products) {
        await productModel.updateOne({ _id:product.productId },{ $inc:{ stock: -parseInt(product.quantity) }})
    }//or -->// checkedProducts.stock = checkedProducts.stock - product.quantity
    // await checkedProducts.save()


    if (req.body.isCart) {
        await cartModel.updateOne({userId:req.user._id},{products:[]})
    }else{
        // remove products from cart *only that inside the array (Products)* and leave other produts in cart the same 
    await cartModel.updateOne({userId:req.user._id},
        {
            $pull:{
                products:{
                    productId:{ $in: foundedIds}}
            }
        })
    }
    
    //Generate PDF

    const invoice = {
    shipping: {
        name: req.user.name,
        address: order.address,
        city: "Cairo",
        state: "Egypt",
        country: "Elzamalek",
        postal_code: 94111
    },
    items:order.products,
    subtotal: price ,
    total: order.paymentPrice ,
    invoice_nr: order._id,
    Date:order.createdAt
    };
    await createInvoice(invoice, "invoice.pdf");


    //SendEmail to notify user
    await sendEmail({to:req.user.email, subject:'invoice' , attachments:[{
        path:'invoice.pdf',
        contentType:'application/pdf'
    }]})



    //payment 
    if (order.paymentMethod == 'card') {
    const stripe = new Stripe(process.env.STRIPE_KEY)
    if (req.body.coupon) {
        const coupon  = await stripe.coupons.create({ percent_off : req.body.coupon.amount , duration:'once'})
        req.body.couponId = coupon.id
    }
    const session = await payment({
        stripe,
        payment_method_types:['card'],
        mode:'payment',
        customer_email:req.user.email,
        metadata:{
            orderId:order._id.toString()
        },
        cancel_url:`${process.env.CANCEL_URL}?orderId=${order._id.toString()}`,
        line_items:order.products.map(product =>{
            return {
                quantity:product.quantity,
                price_data:{
                    currency:'egp',
                    product_data:{
                        name:product.name
                    },
                    unit_amount:product.paymentPrice * 100
                }
            }
        }),
        discounts:req.body.couponId?[{coupon:req.body.couponId}]:[]
        
    })
    res.status(201).json({message:"done",order,session,url:session.url})
    }

    res.status(201).json({message:"done",order})
}




export const webhook = async(req, res) => {

    const stripe = new Stripe(process.env.STRIPE_KEY)
    const sig = req.headers['stripe-signature'];

        let event;
        try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
        } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
        }

        const {orderId} = event.data.object.metadata
        if (event.type != 'checkout.session.completed') {
            await orderModel.updateOne({_id:orderId},{status:'rejected'})
            return res.json({message:"Order Rejected"})
        }
        await orderModel.updateOne({_id:orderId},{status:'placed'})

        return res.status(200).json({message:"done"})

    }