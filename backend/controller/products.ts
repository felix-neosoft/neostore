import { Request, Response } from  'express'
import { findAndUpdateProduct, findProduct } from './service/products.service'
import { createRate, findAndUpdateRate, findRate } from './service/rate.service'

const calulateRate = async(id:string) => {
        const rating = await findRate({productid:id})
        let sum = 0, i = 0
        rating?.rating.forEach(ele=>{
            sum += ele.rate
            i++
        })
        const avg = Math.round(sum/i)
        await findAndUpdateProduct({_id:id},{rating:avg},{new:true})
}


const getProduct = async(req:Request, res:Response) => {
    const data = await findProduct({})
    res.send(data)
}

const rateProduct = async(req:Request, res:Response) => {
    const {email, id, rate} = req.body
    const data = await findRate({productid:id})
    if(data===null){
        await createRate({productid:id,rating:[{email:email,rate:rate}]})
        calulateRate(id)
        res.json({"success":true, "status_code":200, "message":`Product have been rated`})
    }
    else{
        const check = data?.rating.some(ele => {
            if(ele.email===email) return true
            else return false
        })
        if(!check){
            await findAndUpdateRate({productid:id},{$push:{rating:{email:email,rate:rate}}},{new:true})
            .then(()=>{
                calulateRate(id)
                res.json({"success":true, "status_code":200, "message":`Product have been rated`})
            })
        }
        else  res.json({"success":false, "status_code":404, "message":`User already rated the product`})
    }
}



export{
    getProduct,
    rateProduct
}