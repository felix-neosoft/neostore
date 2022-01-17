import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import UserModel, {UserDocument} from "../../model/userSchema";

export function createUser(input:DocumentDefinition<UserDocument>){
    return UserModel.create(input)
}

export function findUser(query:FilterQuery<UserDocument>,options:QueryOptions={lean:true}){
    return UserModel.findOne(query,{},options)
}

export function findAndUpdate(query:FilterQuery<UserDocument>,update:UpdateQuery<UserDocument>,options:QueryOptions){
    return UserModel.findOneAndUpdate(query,update,options)
}

export function deleteUser(query:FilterQuery<UserDocument>){
    return UserModel.deleteOne(query)
}

