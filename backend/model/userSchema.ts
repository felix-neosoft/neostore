import mongoose from 'mongoose'

export interface UserDocument extends mongoose.Document{
    fname:string,
    lname:string,
    email:string,
    password:any,
    mobile:string,
    gender:string,
    authenticate:{
        code:string,
        userVerify:boolean
    },
    address:[
        {
            name:string,
            address:string,
            pincode:string,
            city:string,
            state:string,
            country:string,
            isDeliveryAddress:boolean

        }
    ],
    profileImg:string,
    birthDate:string
}

interface User {
    fname:string,
    lname:string,
    email:string,
    password:string,
    mobile:string,
    gender:string,
    authenticate:{
        code:string,
        userVerify:boolean
    },
    address:[
        {
            name:string,
            address:string,
            pincode:string,
            city:string,
            state:string,
            country:string,
            isDeliveryAddress:boolean

        }
    ],
    profileImg:string,
    birthDate:string
}

const userSchema = new mongoose.Schema<User>({
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    mobile:{
        type:String
    },
    gender:{
        type:String
    },
    authenticate:{
        code:String,
        userVerify:Boolean
    },
    address:[
        {
            name:String,
            address:String,
            pincode:String,
            city:String,
            state:String,
            country:String,
            isDeliveryAddress:Boolean

        }
    ],
    profileImg:{
        type:String
    },
    birthDate:{
        type:String
    }
},{timestamps:true})

export default mongoose.model<User>('user',userSchema)