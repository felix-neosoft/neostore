import express, {Request, Response} from 'express'
import verifyUser from '../controller/authenticate'
const Router = express.Router()



Router.get('/authenticate',verifyUser)

export = Router