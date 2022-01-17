import axios from 'axios'
import MAIN_URL from './URL'

export const getProducts = () => {
    return axios.get(`${MAIN_URL}/products`)
}

export const getCart = (data) => {
    return axios.get(`${MAIN_URL}/cart?email=${data}`)
}

export const addCart = (data) => {
    axios.post(`${MAIN_URL}/cart`,data)
}

export const rateProduct = (data) => {
    return axios.post(`${MAIN_URL}/products`,data)
}

export const orderPlaced = (data) => {
    axios.post(`${MAIN_URL}/order`,{data})
}

export const getOrder = (data,token) => {
    return axios.get(`${MAIN_URL}/order?email=${data}`, { headers:{'Authorization':`Bearer ${token}`}})
}

export const deleteOrder = (data) => {
    return axios.put(`${MAIN_URL}/order`,data)
}