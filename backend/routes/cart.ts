import express from 'express'
const Router = express()
import { addCartProduct, getCartData } from '../controller/cart'


Router.get('/cart',getCartData)
Router.post('/cart',addCartProduct)


export = Router