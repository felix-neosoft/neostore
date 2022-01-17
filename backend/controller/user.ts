import {Request, Response} from 'express'
import { createUser, findUser, findAndUpdate, deleteUser} from './service/user.service'
import { encryptPassword, decryptPassword } from '../config/bcrypt'
import { generateToken } from '../config/JWT'
import generateOTP from '../config/generateOTP'
import { authenticateMail, changePasswordOTP } from '../config/nodemailer'
import { unlink } from 'fs'
import { createCart } from './service/cart.service'
import { createOrder } from './service/order.service'
import { connected } from 'process'

interface user{
    email:string,
    password:string
}

const getUser = async (req:Request, res:Response) => {
    const {email , password} = req.query as unknown as user
    const data = await findUser({email:email})
    if(data!==null){
        const status = await decryptPassword(password,data.password) 
        if(status){
            if(data.authenticate.userVerify){
                const token = await generateToken({email:email,fname:data.fname})
                res.json({"success":true, "status_code":200, "message":"You have logged In", token:token})
            }else res.json({"success":false, "status_code":404, "message":"User is not authenticated"})
        } else res.json({"success":false, "status_code":404, "message":"Email or Password does not match"})
    }else res.json({"success":false, "status_code":404, "message":`User Does Not Exist`})
}

const addUser = async(req:Request, res:Response) => { 
    const password = await encryptPassword(req.body.password)
    const code = generateOTP().toString()
    const body = {fname: req.body.fname, lname:req.body.lname, email:req.body.email, password:password, mobile:req.body.mobile, gender:req.body.gender, authenticate:{ code:code, userVerify:false},address:[], profileImg:'', birthDate:'' }
    await createUser(body).then(()=>{
        authenticateMail(req.body.email,code)
        createCart({email:req.body.email, cart:[],total:0})
        createOrder({email:req.body.email,order:[]})
        res.json({"success":true, "status_code":200, "message":`${req.body.fname} ${req.body.lname} was successfully registered`})
    })
    .catch(()=>{
        res.json({"success":true, "status_code":404, "message":`Email: ${req.body.email} already exist `})
    })
}

const socialLogin = async(req:Request, res:Response) => {
    const {email , fname, lname} = req.body
    const data = await findUser({email:email})
    if(data===null){
        const body = {fname:fname, lname:lname, email:email, password:'querty123', mobile:'0000000000', gender:'', authenticate:{code: '000000', userVerify:true}, address:[], profileImg:'', birthDate:'' }
        await createUser(body).then(async()=>{
            const token = await generateToken({email:email,fname:fname})
            createCart({email:req.body.email, cart:[],total:0})
            createOrder({email:req.body.email,order:[]})
            res.json({"success":true, "status_code":200, "message":`${req.body.fname} ${req.body.lname} was successfully registered`, "token":token})
        })
        .catch(()=>{
            res.json({"success":true, "status_code":404, "message":`Email: ${req.body.email} already exist `})
        })
    }
    else{
        if(data.authenticate.userVerify){
            const token = await generateToken({email:email,fname:data.fname})
            res.json({"success":true, "status_code":200, "message":"You have logged In", token:token})
        }else res.json({"success":false, "status_code":404, "message":"User is not authenticated"})
    }
}

const recoverPassword = async(req:Request, res:Response) => {
    const email = req.query.email as unknown as string
    const code = generateOTP().toString()
    const data = await findUser({email:email}) 
    if(data!==null){
        if(data.authenticate.userVerify){
            await findAndUpdate({email:email},{authenticate:{code:code, userVerify:true}}, {new:true})
            changePasswordOTP(email,code)
            res.json({"success":true, "status_code":200, "message":`Recovery Password OTP has been send to registered email`})
        } else res.json({"success":false, "status_code":404, "message":`User is not authenticated`})
    } else res.json({"success":false, "status_code":404, "message":`User Does Not Exist`})
}

const changePassword = async(req:Request, res:Response) => {
    const data = await findUser({email:req.body.email})
    if(data!==null){
        if(data.authenticate.code === req.body.code){
            const status = await decryptPassword(req.body.password,data.password) 
            if(!status){
                const password = await encryptPassword(req.body.password)
                await findAndUpdate({email:req.body.email},{password:password,authenticate:{code:'000000', userVerify:true}},{new:true})
                res.json({"success":true, "status_code":200, "message":`Password has been changed`})
            }else res.json({"success":false, "status_code":404, "message":`User cannot use same password`})
        }else res.json({"success":false, "status_code":404, "message":`OTP does not match`})
    }else res.json({"success":false, "status_code":404, "message":`User Does Not Exist`})
}

const updatePassword = async(req:Request, res:Response) =>{
    const {email, oldpass, newpass} = req.body
    const data = await findUser({email:email})
    const status = await decryptPassword(oldpass,data?.password) 
    if(data!==null){
        if(status){
            if(oldpass!==newpass){
                const password = await encryptPassword(newpass)
                await findAndUpdate({email:email},{password:password},{new:true})
                res.json({"success":true, "status_code":200, "message":`Password has been changed`})
            }else res.json({"success":false, "status_code":404, "message":`Old Password and New Password must not be same`})
        }else res.json({"success":false, "status_code":404, "message":`Old Password is wrong`})
    }else res.json({"success":false, "status_code":404, "message":`User Does Not Exist`})
}

const getUserData = async(req:Request, res:Response) =>{
    const email = req.query.email as unknown as string
    const data = await findUser({email:email})
    if(data!==null){
        const info ={fname:data?.fname, lname:data?.lname, email:data?.email, gender:data?.gender, birthdate:data?.birthDate, mobile:data?.mobile, userVerify:data?.authenticate.userVerify, address:data?.address, profileImg: req.protocol + '://' + req.get('host') + '/profile/' + data?.profileImg}
        res.json({"success":true, "status_code":200, "message":`User Exist`, "info":info})
    }else res.json({"success":false, "status_code":404, "message":`User Does Not Exist`})
}

const updateProfile = async(req:Request, res:Response) => {
    const {fname, lname, email, gender, mobile, date} = req.body
    await findAndUpdate({email:email},{fname:fname, lname:lname, gender: gender, mobile: mobile, birthDate:date},{new:true})
    .then(()=>{
        res.json({"success":true, "status_code":200, "message":`User Profile Updated`})
    })
    .catch((err)=>{
        res.json({"success":false, "status_code":404, "message":`User Profile Failed to Update`})
    })
}

const updateProfileImage = async(req:Request, res:Response) => {
    // const url = req.protocol + '://' + req.get('host') + '/profile/' + req.file?.filename
    const data = await findUser({email:req.body.email}) 
    if(req.file!==undefined){
        await findAndUpdate({email:req.body.email},{profileImg:req.file?.filename},{new:true})
        .then(()=>{
            if(data?.profileImg!=='') unlink(`./data/profile/${data?.profileImg}`,err=>{ if(err) throw err })
            res.json({"success":true, "status_code":200, "message":`User Profile Image Updated`})
        })
        .catch((err)=>{
            res.json({"success":false, "status_code":404, "message":`User Profile Image Failed to Update`})
        })
    }
    else{
        res.json({"success":false, "status_code":404, "message":`User Profile Image Failed to Update`})
    }
}

const addAddress = async(req:Request, res:Response) => {
    const {email, name, address, pincode, city, state, country} = req.body
    await findAndUpdate({email:email},{$push:{address: {name:name, address:address, pincode:pincode, city:city, state:state, country:country, isDeliveryAddress:false }}}, {new:true})
    .then(()=>{
        res.json({"success":true, "status_code":200, "message":`Address Added`})
    })
    .catch(err=>{
        res.json({"success":false, "status_code":404, "message":`Address must not be same.`})
    })
}

const defaultAddress = async(req:Request, res:Response) => {
    const { id } = req.query
    await findAndUpdate({'address._id':id},{$set:{'address.$[].isDeliveryAddress':false}},{new:true})
    await findAndUpdate({'address._id':id},{$set:{'address.$.isDeliveryAddress':true}},{new:true})
    res.send('working')
}

const updateAddress = async(req:Request, res:Response) => {
    const {name, id, address, pincode, city, state, country} = req.body
    await findAndUpdate({'address._id':id}, {$set:{'address.$.name':name, 'address.$.address':address, 'address.$.pincode':pincode, 'address.$.city':city, 'address.$.state':state, 'address.$.country':country}}, {new:true})
    .then(()=>{
        res.json({"success":true, "status_code":200, "message":`Address Updated`})
    })
    .catch(err=>{
        res.json({"success":false, "status_code":404, "message":`Address must not be same`})
    })
}

const deleteAddress = async(req:Request, res:Response) => {
    const id = req.query.id
    await findAndUpdate({'address._id':id},{$pull:{ address: {'_id':id}}}, {new:true})
    .then(()=>{
        res.json({"success":true, "status_code":200, "message":`Address Successfully Deleted`})
    })
    .catch(err=>{
        res.json({"success":false, "status_code":404, "message":`Address Failed to Delete`})
    })
}


//const val = await findAndUpdate({email:'relixmatrix@gmail.com'},{gender:'male'},{new:true})
// const del = await deleteUser({email:'relixmatrix@gmail.com'})

export {
    getUser,
    addUser,
    socialLogin,
    recoverPassword,
    changePassword,
    updatePassword,
    getUserData,
    updateProfile,
    updateProfileImage,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress
}