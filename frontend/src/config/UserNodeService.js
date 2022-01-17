import axios from 'axios'
import MAIN_URL from './URL'

export const getUser = (data) => {
    return axios.get(`${MAIN_URL}/user?email=${data.email}&password=${data.password}`)
}

export const addUser = (data) => {
    return axios.post(`${MAIN_URL}/user`,data)
}

export const socialLogin = (data) => {
    return axios.post(`${MAIN_URL}/user/social`,data)

}

export const recoverPassword = (data) => {
    return axios.get(`${MAIN_URL}/user/password?email=${data}`)
}

export const changePassword = (data) =>{
    return axios.put(`${MAIN_URL}/user`,data)
}

export const getUserData = (data,token) => {
    return axios.get(`${MAIN_URL}/user/data?email=${data}`, { headers:{'Authorization':`Bearer ${token}`}})
}

export const updateProfile = (data) => {
    return axios.post(`${MAIN_URL}/user/data`,data)
}

export const updateProfileImage = (data) => {
    return axios.put(`${MAIN_URL}/user/data`,data,{})
}

export const updateUserPassword = (data) => {
    return axios.post(`${MAIN_URL}/user/password`,data)
}

export const addAddressData = (data) => {
    return axios.post(`${MAIN_URL}/user/address`,data)
}

export const updateAddressData = (data) => {
    return axios.put(`${MAIN_URL}/user/address`,data)
}

export const setDefaultAddress = (data) => {
    return axios.get(`${MAIN_URL}/user/address?id=${data}`)
}

export const deleteAddressData = (data) => {
    return axios.delete(`${MAIN_URL}/user/address?id=${data}`,)
}

