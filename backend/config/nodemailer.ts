import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid';
import { generateEmailToken }  from './JWT';
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.email,
        pass: process.env.password
    }
})

async function authenticateMail(email:string, code:string){
    const token = await generateEmailToken({email:email, code:code})
    const message = {
        from : 'Neostore@neosoftmail.com <Neostore@neosoftmail.com>' ,
        to: `${email}`,
        subject: "NeoSTORE Account Authentication",
        text: `Please click on the link to authenticate: http://localhost:9000/api/authenticate?token=${token}`
    }
    const info = await transporter.sendMail(message)
}

async function changePasswordOTP(email:string, code:string){
    const message = {
        from : 'Neostore@neosoftmail.com <Neostore@neosoftmail.com>' ,
        to: `${email}`,
        subject: "NeoSTORE Change Password OTP",
        text: `OTP Code: ${code}`
    }
    const info = await transporter.sendMail(message)
}

export{
    authenticateMail,
    changePasswordOTP
}