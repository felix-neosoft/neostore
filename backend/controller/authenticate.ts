import {Request, Response} from 'express'
import { decodeToken } from '../config/JWT'
import { findAndUpdate, findUser } from './service/user.service'

interface token {
    token:string
}

interface decode{
    email:string,
    code:string
}

const verifyUser = async (req:Request, res:Response) => {
    const { token }= req.query as unknown as token
    const decode = await decodeToken(token) as unknown as decode
    const data  = await findUser({email:decode.email}) 
    if(decode.code === data?.authenticate.code){
        await findAndUpdate({email:decode.email},{authenticate:{code:'000000',userVerify:true}},{new:true})
        res.render('authenticate',{text:'Thank You, The Email is Verified'})
    }else res.render('authenticate',{text:'The Email is not Verified'})

}

export default verifyUser
