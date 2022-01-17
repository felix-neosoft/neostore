import { rmSync } from "fs";
import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import OrderModel, { OrderDocument } from '../../model/orderSchema'

export function createOrder(input:DocumentDefinition<OrderDocument>){
    return OrderModel.create(input)
}

export function findOrder(query:FilterQuery<OrderDocument>,options:QueryOptions={lean:true}){
    return OrderModel.findOne(query,{},options)
}

export function findAndUpdateOrder(query:FilterQuery<OrderDocument>,update:UpdateQuery<OrderDocument>,options:QueryOptions){
    return OrderModel.findOneAndUpdate(query,update,options)
}

export function deleteOrder(query:FilterQuery<OrderDocument>){
    return OrderModel.deleteOne(query)
}