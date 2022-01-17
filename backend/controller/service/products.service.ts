import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import ProductModel, { ProductsDocument } from '../../model/productSchema'

export function createProduct(input:DocumentDefinition<ProductsDocument>){
    return ProductModel.create(input)
}

export function findProduct(query:FilterQuery<ProductsDocument>,options:QueryOptions={lean:true}){
    return ProductModel.find(query,{},options)
}

export function findAndUpdateProduct(query:FilterQuery<ProductsDocument>,update:UpdateQuery<ProductsDocument>,options:QueryOptions){
    return ProductModel.findOneAndUpdate(query,update,options)
}

export function deleteProduct(query:FilterQuery<ProductsDocument>){
    return ProductModel.deleteOne(query)
}