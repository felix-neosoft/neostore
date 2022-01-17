import mongoose from 'mongoose'

export interface OrderDocument extends mongoose.Document{
    email:string,
    order:[]
}


interface Order{
    email:string,
    order:[]
}


const orderSchema = new mongoose.Schema<Order>({
    email:{
        type:String,
        unique:true
    },
    order:Array

},{timestamps:true})

export default mongoose.model<Order>('order',orderSchema)