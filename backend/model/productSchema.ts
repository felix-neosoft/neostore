import mongoose from 'mongoose'

export interface ProductsDocument extends mongoose.Document {
    name:string,
    images:[{
        location:string
        }],
    category:string,
    color:[{
        name:string,
        code:string,
        }],
    desc:string
    rating:number,
    producer:string,
    cost:number,
    stock:number,
    dimensions:string,
    material:string,
}

interface Products {
    name:string,
    images:[{
        location:string
        }],
    category:string,
    color:[{
        name:string,
        code:string,
        }],
    desc:string
    rating:number,
    producer:string,
    cost:number,
    stock:number,
    dimensions:string,
    material:string,
}


const productSchema  = new mongoose.Schema<Products>({
    name:{
        type:String,
        unique:true
    },
    images:[{
        location:String
    }],
    category:{
        type:String
    },
    desc:{
        type:String
    },
    rating:{
        type:Number
    },
    producer:{
        type:String
    },
    color:[{
        name:String,
        code:String
    }],
    cost:{
        type:Number
    },
    stock:{
        type:Number
    },
    dimensions:{
        type:String
    },
    material:{
        type:String
    }
},{timestamps:true})

export default mongoose.model<Products>('product',productSchema)