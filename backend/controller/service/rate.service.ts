import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import rateModel, { RateDocument } from '../../model/rateSchema'

export function createRate(input:DocumentDefinition<RateDocument>){
    return rateModel.create(input)
}

export function findRate(query:FilterQuery<RateDocument>,options:QueryOptions={lean:true}){
    return rateModel.findOne(query,{},options)
}

export function findAndUpdateRate(query:FilterQuery<RateDocument>,update:UpdateQuery<RateDocument>,options:QueryOptions){
    return rateModel.findOneAndUpdate(query,update,options)
}

export function deleteRate(query:FilterQuery<RateDocument>){
    return rateModel.deleteOne(query)
}