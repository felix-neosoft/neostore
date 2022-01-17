import express from 'express'
import { getProduct, rateProduct } from '../controller/products'
const Router = express.Router()

Router.get('/products', getProduct)
Router.post('/products', rateProduct)

export = Router