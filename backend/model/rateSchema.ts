import mongoose from 'mongoose'


export interface RateDocument extends mongoose.Document{
    productid:string,
    rating:[{
        email:string,
        rate:number
    }]
}

interface Rate{
    productid:string,
    rating:[{
        email:string,
        rate:number
    }]
}

const rateSchema = new mongoose.Schema<Rate>({
    productid:{
        type:String,
        unique:true
    },
    rating:[{
        email:String,
        rate: Number
    }]
},{timestamps:true})

export default mongoose.model<Rate>('rating',rateSchema)