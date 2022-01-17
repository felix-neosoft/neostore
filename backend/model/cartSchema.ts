import mongoose from 'mongoose'

export interface CartDocument extends mongoose.Document {
    email:String,
    cart:[],
    total:number
}


interface Cart {
    email:String,
    cart:[], 
    total:number
}

const cartSchema = new mongoose.Schema<Cart> ({
    email:{
        type:String,
        unique:true
    },
    cart:Array,
    total:Number
},{timestamps:true})

export default mongoose.model<Cart>('cart',cartSchema)


