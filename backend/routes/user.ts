import express from 'express'
import uploadImage from '../config/FileUpload'
import { authenticateToken } from '../config/JWT'
import { getUser, addUser, recoverPassword, changePassword, getUserData, updateProfile, updateProfileImage, updatePassword, addAddress, updateAddress, deleteAddress, defaultAddress, socialLogin } from '../controller/user'
const Router = express.Router()


Router.get(`/user`,getUser)
Router.post('/user',addUser)
Router.post('/user/social',socialLogin)
Router.put('/user',changePassword)
Router.get('/user/password',recoverPassword)
Router.post('/user/password',updatePassword)
Router.get('/user/data',authenticateToken,getUserData)
Router.post('/user/data',updateProfile)
Router.put('/user/data',uploadImage.single('profileImg'),updateProfileImage)
Router.get('/user/address',defaultAddress)
Router.post('/user/address',addAddress)
Router.put('/user/address',updateAddress)
Router.delete('/user/address',deleteAddress)

export = Router