import {Request} from 'express'
import multer from 'multer'
import { nextTick } from 'process';
import { v4 as uuidv4 } from 'uuid';


const profileDir = './data/profile'

const storage = multer.diskStorage({
    destination:(req:Request,file,cb) =>{
        cb(null, profileDir)
    },
    filename:(req:Request,file,cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, uuidv4()+'-'+filename)
    }
})

const uploadImage = multer({
    storage: storage,
    fileFilter:(req:Request, file, cb) => {
        if(file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)) {
            cb(null,true)
        }else {
            cb(null,false)
        }
    }
})

export default uploadImage