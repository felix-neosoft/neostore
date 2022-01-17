import {Request, Response} from 'express'
import { createCart, findAndUpdateCart, findCart } from './service/cart.service'

const addCartProduct = async(req:Request, res:Response) => {
    const { email, arrayData, total } = req.body
    const data = await findCart({email:email})
    if(data===null){
        await createCart({email:email,cart:arrayData,total:total})
    }
    else{
        await findAndUpdateCart({email:email},{cart:arrayData,total:total},{new:true})
    }
}

const getCartData = async(req:Request, res:Response) => {
    const email = req.query.email as unknown as string
    const data = await findCart({email:email})
    res.send(data?.cart)
}

export {
    addCartProduct,
    getCartData
}
