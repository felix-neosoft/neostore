import express from 'express'
import userRouter from './routes/user'
import productRouter from './routes/products'
import cartRouter from './routes/cart'
import orderRouter from './routes/order'
import authenticateRouter from './routes/authenticate'
import DBConnect from './config/connect'
import cors from 'cors'
import { productScript } from './controller/service/productScript'
const PORT = 9000
const app = express()

app.use(cors())

app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.use('/api',userRouter)
app.use('/api',productRouter)
app.use('/api',authenticateRouter)
app.use('/api',cartRouter)
app.use('/api',orderRouter)

app.use(express.static('data'))

// productScript()  // Product adding function

DBConnect()
 app.listen(PORT, ()=>{
     console.log(`Server running on http://localhost:${PORT}`)
 })