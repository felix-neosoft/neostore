import { addCart } from "../config/ProductNodeService"

const ADD_PRODUCT = 'ADD_PRODUCT'
const MERGE_PRODUCT = 'MERGE_PRODUCT'
const UPDATE_CART = 'UPDATE_CART'
const CLEAR_CART = 'CLEAR_CART'
const DELETE_ITEM = 'DELETE_ITEM'
const CHECKOUT_CLEAR = 'CHECKOUT_CLEAR'

export const addCartDispatch = (data,email) =>{
    return{
        type: ADD_PRODUCT,
        payload: data,
        email:email
    }
}

export const mergeCartDispatch = (data,email) =>{
    return{
        type: MERGE_PRODUCT,
        payload:data,
        email:email
    }
}

export const updateCartDispatch = (id,condition) => {
    return {
        type:UPDATE_CART,
        condition:condition,
        id:id
    }
}

export const clearCartDispatch = (email) => {
    return {
        type: CLEAR_CART,
        email:email
    }
}

export const deleteItemDispatch = (id,email) => {
    return {
        type: DELETE_ITEM,
        id:id,
        email:email
    }
}

export const checkoutClearDispatch = (email) => {
    return{
        type:CHECKOUT_CLEAR,
        email:email
    }
}






const initialValue = {
    cart:[],
    NumOfItems:0
}

const cartReducer = (state = initialValue , action) => {
    let reduxTemp = state.cart
    let total = 0
    let check = true
    let num = 0
    switch(action.type){

        case ADD_PRODUCT:    
            const val = reduxTemp.some(ele => {
                total += ele.numofitems * ele.cost
                if(ele.id===action.payload.id){
                    if(ele.numofitems>=10) {
                        check = false
                        alert('Maximum 10 quantity can be added')
                        return false
                    }
                    else {
                       ele.numofitems += 1 
                       return true
                    }
                }
                return false
            })
            if(check){
                if(!val){
                    reduxTemp.push(action.payload)
                    
                }
                total += action.payload.cost
                if(action.email!==''){
                    addCart({email:action.email,arrayData:reduxTemp,total:total})
                }
                return {...state, cart:reduxTemp, NumOfItems:state.NumOfItems+=1}
            }
            else return state

        case MERGE_PRODUCT:
            const dbTemp = action.payload
            let temp = []
            let bool = true
            if(reduxTemp!==null && dbTemp!==null){
                dbTemp.forEach(Dele => {
                    bool = true
                    reduxTemp.forEach(Rele => {
                        if(Dele.id===Rele.id){
                            let quantity = Dele.numofitems+Rele.numofitems
                            if(quantity>=10) Rele.numofitems = 10
                            else Rele.numofitems = Dele.numofitems + Rele.numofitems
                            bool = false
                        }
                        return true
                    })
                    if(bool) temp.push(Dele)
                })
            }
            else if( dbTemp!==null){
                temp = dbTemp
            }
            temp = reduxTemp.concat(temp)
            temp.forEach(ele => {
                total += ele.numofitems * ele.cost
                num += ele.numofitems
            })
            
            addCart({email:action.email,arrayData:temp, total:total})
            return {...state, cart:temp, NumOfItems:num}

        case CLEAR_CART:
            reduxTemp.forEach(ele =>{
                total = total + (ele.numofitems * ele.cost)
            })
            if(action.email!==''){
                addCart({email:action.email,arrayData:reduxTemp,total:total})
            }
            return {...state,cart:[], NumOfItems:0}

        case UPDATE_CART:
            reduxTemp.forEach(ele => {
                num = num + ele.numofitems
                if(ele.id===action.id){
                    if(action.condition==='ADD'){
                        if(ele.numofitems<10){
                            ele.numofitems++ 
                            num++
                        }
                    } 
                    else if(action.condition==='SUB'){
                        if(ele.numofitems>1){
                            ele.numofitems--
                            num--
                        }
                    } 
                }
            })
            return {...state, cart:reduxTemp, NumOfItems:num}
        
        case DELETE_ITEM:
            let deleteTemp = reduxTemp
            reduxTemp.forEach((ele,id) => {
                if(ele.id===action.id){
                    deleteTemp.splice(id,1)
                }
                else{
                    num = num + ele.numofitems
                    total = total + (ele.numofitems * ele.cost)
                }
            })
            if(action.email!==''){
                addCart({email:action.email,arrayData:reduxTemp,total:total})
            }
            return {...state, cart:deleteTemp, NumOfItems:num}

        default: return state

        case CHECKOUT_CLEAR:
            if(action.email!==''){
                addCart({email:action.email,arrayData:[],total:0})
            }
            return {...state,cart:[], NumOfItems:0}
    }
}

export default cartReducer


