import express from 'express'
import { authenticateToken } from '../config/JWT'
import { cancelOrder, getOrder, placeOrder } from '../controller/order'
const Router = express()


Router.post('/order',placeOrder)
Router.get('/order',authenticateToken,getOrder)
Router.put('/order',cancelOrder)


export = Router