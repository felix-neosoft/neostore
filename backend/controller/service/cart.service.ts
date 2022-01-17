import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import CartModel, { CartDocument } from '../../model/cartSchema'

export function createCart(input:DocumentDefinition<CartDocument>){
    return CartModel.create(input)
}

export function findCart(query:FilterQuery<CartDocument>,options:QueryOptions={lean:true}){
    return CartModel.findOne(query,{},options)
}

export function findAndUpdateCart(query:FilterQuery<CartDocument>,update:UpdateQuery<CartDocument>,options:QueryOptions){
    return CartModel.findOneAndUpdate(query,update,options)
}

export function deleteCart(query:FilterQuery<CartDocument>){
    return CartModel.deleteOne(query)
}