import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
const SECREAT_KEY = 'h.&{mxE3&#>X&D[m+NA^'
const time = 1000 * 60 * 60 

interface usertoken{
    email:string,
    fname:string
}

interface emailtoken{
    email:string,
    code:string
}

interface token{
    token:string
}

interface decode{
    email:string,
    code:string
}

function generateToken(data:usertoken){
    return new Promise((resolve,reject)=>{
        jwt.sign(data,SECREAT_KEY,{expiresIn:time},function(err,token){
            if(err) reject(err)
            else resolve(token)
        })
    })
}

function generateEmailToken(data:emailtoken){
    return new Promise((resolve,reject)=>{
        jwt.sign(data,SECREAT_KEY,function(err,token){
            if(err) reject(err)
            else resolve(token)
        })
    })
}

function decodeToken (token:string){
    return new Promise((resolve,reject)=>{
        const decode = jwt.verify(token,SECREAT_KEY)
        resolve(decode)
    })
}


function authenticateToken(req:Request, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null){
        res.json({"success":false, "status_code":404, "message":'Token is Empty' })
    }
    else{
        jwt.verify(token,SECREAT_KEY,(err,data)=>{
            if(err) { res.json({"success":false, "status_code":404, "message":'Token does not match' }) }
            else{ next() }
        })
    }
}

export {
    generateToken,
    generateEmailToken,
    decodeToken,
    authenticateToken
}